from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Sum, Q, F, DecimalField
from django.db.models.functions import Coalesce
from datetime import datetime, timedelta
from django.utils import timezone
import json

from .models import TipoReporte, Reporte, DetalleReporteInventario, DetalleReporteProveedor, ConfiguracionReporte
from .serializers import (
    TipoReporteSerializer, ReporteSerializer, ReporteCreateSerializer,
    ConfiguracionReporteSerializer, ResumenInventarioSerializer,
    ProductoBajoStockSerializer, ReporteRapidoSerializer
)
from inventory.models import Producto, Categoria
from suppliers.models import Proveedor

class TipoReporteViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para tipos de reportes"""
    queryset = TipoReporte.objects.filter(activo=True)
    serializer_class = TipoReporteSerializer

class ReporteViewSet(viewsets.ModelViewSet):
    """ViewSet para reportes"""
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ReporteCreateSerializer
        return ReporteSerializer
    
    def perform_create(self, serializer):
        reporte = serializer.save(usuario=self.request.user)
        # Generar el reporte según el tipo
        self._generar_reporte(reporte)
    
    def _generar_reporte(self, reporte):
        """Genera los datos del reporte según su tipo"""
        try:
            if reporte.tipo_reporte.nombre == 'inventario':
                self._generar_reporte_inventario(reporte)
            elif reporte.tipo_reporte.nombre == 'stock_bajo':
                self._generar_reporte_stock_bajo(reporte)
            elif reporte.tipo_reporte.nombre == 'productos_categoria':
                self._generar_reporte_por_categoria(reporte)
            elif reporte.tipo_reporte.nombre == 'proveedores':
                self._generar_reporte_proveedores(reporte)
            
            reporte.estado = 'completado'
            reporte.save()
        except Exception as e:
            reporte.estado = 'error'
            reporte.save()
    
    def _generar_reporte_inventario(self, reporte):
        """Genera reporte completo de inventario"""
        productos = Producto.objects.select_related('categoria').all()
        
        for producto in productos:
            valor_total = producto.stock_actual * producto.precio_costo
            
            # Determinar estado del stock
            if producto.stock_actual <= 0:
                estado_stock = 'agotado'
            elif producto.stock_actual <= producto.stock_minimo:
                estado_stock = 'bajo'
            else:
                estado_stock = 'normal'
            
            DetalleReporteInventario.objects.create(
                reporte=reporte,
                producto=producto,
                categoria=producto.categoria,
                stock_actual=producto.stock_actual,
                stock_minimo=producto.stock_minimo,
                precio_costo=producto.precio_costo,
                precio_venta=producto.precio_venta,
                valor_total_stock=valor_total,
                estado_stock=estado_stock
            )
    
    def _generar_reporte_stock_bajo(self, reporte):
        """Genera reporte de productos con stock bajo"""
        productos = Producto.objects.select_related('categoria').filter(
            stock_actual__lte=F('stock_minimo')
        )
        
        for producto in productos:
            valor_total = producto.stock_actual * producto.precio_costo
            estado_stock = 'agotado' if producto.stock_actual <= 0 else 'bajo'
            
            DetalleReporteInventario.objects.create(
                reporte=reporte,
                producto=producto,
                categoria=producto.categoria,
                stock_actual=producto.stock_actual,
                stock_minimo=producto.stock_minimo,
                precio_costo=producto.precio_costo,
                precio_venta=producto.precio_venta,
                valor_total_stock=valor_total,
                estado_stock=estado_stock
            )
    
    def _generar_reporte_por_categoria(self, reporte):
        """Genera reporte de productos por categoría"""
        categoria_id = reporte.parametros.get('categoria_id')
        if categoria_id:
            productos = Producto.objects.select_related('categoria').filter(
                categoria_id=categoria_id
            )
        else:
            productos = Producto.objects.select_related('categoria').all()
        
        for producto in productos:
            valor_total = producto.stock_actual * producto.precio_costo
            
            if producto.stock_actual <= 0:
                estado_stock = 'agotado'
            elif producto.stock_actual <= producto.stock_minimo:
                estado_stock = 'bajo'
            else:
                estado_stock = 'normal'
            
            DetalleReporteInventario.objects.create(
                reporte=reporte,
                producto=producto,
                categoria=producto.categoria,
                stock_actual=producto.stock_actual,
                stock_minimo=producto.stock_minimo,
                precio_costo=producto.precio_costo,
                precio_venta=producto.precio_venta,
                valor_total_stock=valor_total,
                estado_stock=estado_stock
            )
    
    def _generar_reporte_proveedores(self, reporte):
        """Genera reporte de proveedores"""
        proveedores = Proveedor.objects.all()
        
        for proveedor in proveedores:
            productos_proveedor = Producto.objects.filter(
                productoproveedor__proveedor=proveedor
            )
            
            total_productos = productos_proveedor.count()
            productos_activos = productos_proveedor.filter(activo=True).count()
            productos_inactivos = total_productos - productos_activos
            
            valor_total = productos_proveedor.aggregate(
                total=Coalesce(
                    Sum(F('stock_actual') * F('precio_costo')),
                    0,
                    output_field=DecimalField(max_digits=12, decimal_places=2)
                )
            )['total']
            
            DetalleReporteProveedor.objects.create(
                reporte=reporte,
                proveedor=proveedor,
                total_productos=total_productos,
                valor_total_productos=valor_total,
                productos_activos=productos_activos,
                productos_inactivos=productos_inactivos
            )
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Endpoint para datos del dashboard de reportes"""
        # Resumen general del inventario
        total_productos = Producto.objects.count()
        productos_bajo_stock = Producto.objects.filter(
            stock_actual__lte=F('stock_minimo')
        ).count()
        productos_agotados = Producto.objects.filter(stock_actual=0).count()
        
        valor_total_inventario = Producto.objects.aggregate(
            total=Coalesce(
                Sum(F('stock_actual') * F('precio_costo')),
                0,
                output_field=DecimalField(max_digits=12, decimal_places=2)
            )
        )['total']
        
        categorias_activas = Categoria.objects.filter(activo=True).count()
        
        resumen_inventario = {
            'total_productos': total_productos,
            'productos_bajo_stock': productos_bajo_stock,
            'productos_agotados': productos_agotados,
            'valor_total_inventario': valor_total_inventario,
            'categorias_activas': categorias_activas
        }
        
        # Productos con stock bajo
        productos_bajo_stock_data = Producto.objects.select_related('categoria').filter(
            stock_actual__lte=F('stock_minimo')
        ).order_by('stock_actual')[:10]
        
        # Productos con mayor valor en stock
        productos_top_valor = Producto.objects.select_related('categoria').annotate(
            valor_stock=F('stock_actual') * F('precio_costo')
        ).order_by('-valor_stock')[:10]
        
        productos_top_data = [{
            'producto_id': p.id,
            'producto_nombre': p.nombre,
            'categoria_nombre': p.categoria.nombre,
            'stock_actual': p.stock_actual,
            'valor_stock': p.valor_stock
        } for p in productos_top_valor]
        
        # Productos por categoría
        productos_por_categoria = Categoria.objects.filter(activo=True).annotate(
            total_productos=Count('productos'),
            valor_total=Coalesce(
                Sum(F('productos__stock_actual') * F('productos__precio_costo')),
                0,
                output_field=DecimalField(max_digits=12, decimal_places=2)
            )
        ).values('nombre', 'total_productos', 'valor_total')
        
        productos_categoria_dict = {
            cat['nombre']: {
                'total_productos': cat['total_productos'],
                'valor_total': cat['valor_total']
            }
            for cat in productos_por_categoria
        }
        
        data = {
            'resumen_inventario': resumen_inventario,
            'productos_bajo_stock': ProductoBajoStockSerializer(productos_bajo_stock_data, many=True).data,
            'productos_top_valor': productos_top_data,
            'productos_por_categoria': productos_categoria_dict
        }
        
        return Response(data)
    
    @action(detail=False, methods=['post'])
    def generar_reporte_rapido(self, request):
        """Genera un reporte rápido según parámetros"""
        tipo_reporte = request.data.get('tipo_reporte')
        parametros = request.data.get('parametros', {})
        
        if tipo_reporte == 'inventario_general':
            return self._reporte_inventario_general()
        elif tipo_reporte == 'stock_bajo':
            return self._reporte_stock_bajo_rapido()
        elif tipo_reporte == 'por_categoria':
            return self._reporte_categoria_rapido(parametros.get('categoria_id'))
        
        return Response({'error': 'Tipo de reporte no válido'}, status=400)
    
    def _reporte_inventario_general(self):
        """Reporte rápido del inventario general"""
        productos = Producto.objects.select_related('categoria').annotate(
            valor_stock=F('stock_actual') * F('precio_costo')
        ).order_by('nombre')
        
        data = [{
            'id': p.id,
            'nombre': p.nombre,
            'categoria': p.categoria.nombre,
            'stock_actual': p.stock_actual,
            'stock_minimo': p.stock_minimo,
            'precio_costo': p.precio_costo,
            'precio_venta': p.precio_venta,
            'valor_stock': p.valor_stock,
            'estado': 'Agotado' if p.stock_actual <= 0 else 'Bajo' if p.stock_actual <= p.stock_minimo else 'Normal'
        } for p in productos]
        
        return Response({'productos': data})
    
    def _reporte_stock_bajo_rapido(self):
        """Reporte rápido de stock bajo"""
        productos = Producto.objects.select_related('categoria').filter(
            stock_actual__lte=F('stock_minimo')
        ).annotate(
            valor_stock=F('stock_actual') * F('precio_costo')
        ).order_by('stock_actual')
        
        data = [{
            'id': p.id,
            'nombre': p.nombre,
            'categoria': p.categoria.nombre,
            'stock_actual': p.stock_actual,
            'stock_minimo': p.stock_minimo,
            'diferencia': p.stock_minimo - p.stock_actual,
            'valor_stock': p.valor_stock,
            'urgencia': 'Alta' if p.stock_actual <= 0 else 'Media'
        } for p in productos]
        
        return Response({'productos': data})
    
    def _reporte_categoria_rapido(self, categoria_id):
        """Reporte rápido por categoría"""
        query = Producto.objects.select_related('categoria')
        
        if categoria_id:
            query = query.filter(categoria_id=categoria_id)
        
        productos = query.annotate(
            valor_stock=F('stock_actual') * F('precio_costo')
        ).order_by('categoria__nombre', 'nombre')
        
        data = [{
            'id': p.id,
            'nombre': p.nombre,
            'categoria': p.categoria.nombre,
            'stock_actual': p.stock_actual,
            'valor_stock': p.valor_stock,
            'activo': p.activo
        } for p in productos]
        
        return Response({'productos': data})

class ConfiguracionReporteViewSet(viewsets.ModelViewSet):
    """ViewSet para configuraciones de reportes"""
    serializer_class = ConfiguracionReporteSerializer
    
    def get_queryset(self):
        return ConfiguracionReporte.objects.filter(usuario=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)