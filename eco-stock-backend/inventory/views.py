from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from datetime import datetime, timedelta
import random

from .models import Categoria, UnidadesMedida, Producto, ProductoProveedor
from .serializers import (
    CategoriaSerializer, UnidadesMedidaSerializer, 
    ProductoSerializer, ProductoProveedorSerializer,
    ProductoDashboardSerializer, ProductoCreateUpdateSerializer,
    ProductoVencimientoSerializer
)

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    search_fields = ['nombre', 'descripcion', 'tipo']
    ordering_fields = ['nombre', 'tipo']
    ordering = ['nombre']

class UnidadesMedidaViewSet(viewsets.ModelViewSet):
    queryset = UnidadesMedida.objects.all()
    serializer_class = UnidadesMedidaSerializer
    search_fields = ['nombre', 'abreviatura']
    ordering_fields = ['nombre']
    ordering = ['nombre']

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.select_related('idcategoria', 'unidad_medida_id').all()
    serializer_class = ProductoSerializer
    search_fields = ['nombre', 'descripcion', 'lote']
    ordering_fields = ['nombre', 'idcategoria__nombre']
    ordering = ['nombre']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductoCreateUpdateSerializer
        elif self.action == 'dashboard':
            return ProductoDashboardSerializer
        elif self.action == 'proximos_vencer':
            return ProductoVencimientoSerializer
        return ProductoSerializer
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """
        Endpoint para el dashboard de productos con información completa
        """
        productos = self.get_queryset()
        
        # Aplicar filtros de búsqueda si existen
        search = request.query_params.get('search', '')
        if search:
            productos = productos.filter(
                Q(nombre__icontains=search) | 
                Q(descripcion__icontains=search) |
                Q(idcategoria__nombre__icontains=search)
            )
        
        # Simular datos de stock y estado para el dashboard
        productos_data = []
        for producto in productos:
            # Generar datos simulados para stock y estado
            stock_simulado = random.randint(0, 100)
            if stock_simulado == 0:
                estado = 'Agotado'
            elif stock_simulado <= 10:
                estado = 'Bajo stock'
            else:
                estado = 'Disponible'
            
            # Crear data enriquecida
            producto_dict = ProductoDashboardSerializer(producto).data
            producto_dict['stock'] = stock_simulado
            producto_dict['estado'] = estado
            productos_data.append(producto_dict)
        
        return Response({
            'count': len(productos_data),
            'results': productos_data
        })
    
    @action(detail=False, methods=['get'])
    def proximos_vencer(self, request):
        """
        Endpoint para productos próximos a vencer
        """
        productos = self.get_queryset()
        
        # Aplicar filtros
        search = request.query_params.get('search', '')
        filtro_estado = request.query_params.get('estado', 'todos')
        
        if search:
            productos = productos.filter(
                Q(nombre__icontains=search) | 
                Q(productoproveedor__proveedor__nombre__icontains=search)
            ).distinct()
        
        # Simular datos de vencimiento
        productos_vencimiento = []
        for producto in productos:
            # Generar fecha de vencimiento aleatoria
            dias_aleatorios = random.randint(-30, 90)  # Entre 30 días atrás y 90 días adelante
            fecha_vencimiento = datetime.now().date() + timedelta(days=dias_aleatorios)
            
            # Calcular estado de vencimiento
            dias_restantes = (fecha_vencimiento - datetime.now().date()).days
            if dias_restantes < 0:
                estado_vencimiento = 'Vencido'
            elif dias_restantes <= 30:
                estado_vencimiento = 'Próximo a vencer'
            else:
                estado_vencimiento = 'Vigente'
            
            # Aplicar filtro de estado
            if filtro_estado != 'todos':
                if filtro_estado == 'proximos' and estado_vencimiento != 'Próximo a vencer':
                    continue
                elif filtro_estado == 'vencidos' and estado_vencimiento != 'Vencido':
                    continue
            
            # Solo incluir productos próximos a vencer o vencidos para este endpoint
            if estado_vencimiento in ['Próximo a vencer', 'Vencido']:
                producto_dict = ProductoVencimientoSerializer(producto).data
                producto_dict['fecha_vencimiento'] = fecha_vencimiento.strftime('%Y-%m-%d')
                producto_dict['dias_restantes'] = dias_restantes
                producto_dict['estado_vencimiento'] = estado_vencimiento
                producto_dict['cantidad'] = str(random.randint(1, 10))
                productos_vencimiento.append(producto_dict)
        
        # Ordenar por días restantes (vencidos primero, luego próximos a vencer)
        productos_vencimiento.sort(key=lambda x: x['dias_restantes'])
        
        return Response({
            'count': len(productos_vencimiento),
            'results': productos_vencimiento
        })
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """
        Endpoint para estadísticas del dashboard
        """
        total_productos = self.get_queryset().count()
        total_categorias = Categoria.objects.count()
        
        # Simular estadísticas
        productos_disponibles = random.randint(int(total_productos * 0.6), total_productos)
        productos_bajo_stock = random.randint(0, int(total_productos * 0.2))
        productos_agotados = total_productos - productos_disponibles - productos_bajo_stock
        
        return Response({
            'total_productos': total_productos,
            'total_categorias': total_categorias,
            'productos_disponibles': productos_disponibles,
            'productos_bajo_stock': productos_bajo_stock,
            'productos_agotados': productos_agotados,
            'productos_proximos_vencer': random.randint(0, 10),
            'productos_vencidos': random.randint(0, 5)
        })

class ProductoProveedorViewSet(viewsets.ModelViewSet):
    queryset = ProductoProveedor.objects.select_related('producto', 'proveedor').all()
    serializer_class = ProductoProveedorSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        producto_id = self.request.query_params.get('producto_id', None)
        proveedor_id = self.request.query_params.get('proveedor_id', None)
        
        if producto_id is not None:
            queryset = queryset.filter(producto_id=producto_id)
        if proveedor_id is not None:
            queryset = queryset.filter(proveedor_id=proveedor_id)
            
        return queryset