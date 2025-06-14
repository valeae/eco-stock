from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from datetime import datetime, timedelta
from .models import Categoria, UnidadesMedida, Producto, ProductoProveedor
from .serializers import (
    CategoriaSerializer, UnidadesMedidaSerializer, ProductoSerializer,
    ProductoDetalleSerializer, ProductoVencimientoSerializer, ProductoProveedorSerializer
)

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) | 
                Q(descripcion__icontains=search)
            )
        return queryset

class UnidadesMedidaViewSet(viewsets.ModelViewSet):
    queryset = UnidadesMedida.objects.all()
    serializer_class = UnidadesMedidaSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) | 
                Q(abreviatura__icontains=search)
            )
        return queryset

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.select_related('idcategoria', 'unidad_medida_id')
    serializer_class = ProductoSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) | 
                Q(descripcion__icontains=search) |
                Q(lote__icontains=search)
            )
        return queryset
    
    @action(detail=False, methods=['get'])
    def detalles(self, request):
        """Endpoint para la página de detalles de productos"""
        queryset = self.get_queryset()
        search = request.query_params.get('search', None)
        
        if search:
            queryset = queryset.filter(nombre__icontains=search)
        
        # Simulamos datos adicionales de stock y estado
        productos_con_detalles = []
        for producto in queryset:
            data = ProductoDetalleSerializer(producto).data
            # Aquí podrías obtener el stock real de otra tabla/modelo
            data['stock'] = 50  # Valor por defecto
            data['estado'] = 'Disponible'  # Valor por defecto
            productos_con_detalles.append(data)
        
        return Response(productos_con_detalles)
    
    @action(detail=False, methods=['get'])
    def proximos_vencer(self, request):
        """Endpoint para productos próximos a vencer"""
        # Filtrar por estado si se proporciona
        estado_filtro = request.query_params.get('estado', 'todos')
        search = request.query_params.get('search', None)
        
        queryset = self.get_queryset()
        
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) |
                Q(productoproveedor__proveedor__nombre__icontains=search)
            ).distinct()
        
        # Simulamos productos con fechas de vencimiento
        productos_vencimiento = []
        fecha_actual = datetime.now().date()
        
        for producto in queryset:
            # Simulamos fecha de vencimiento (en un caso real esto estaría en el modelo)
            fecha_vencimiento = fecha_actual + timedelta(days=25)  # Ejemplo
            
            data = {
                'id': producto.idproducto,
                'lote': producto.lote,
                'nombre': producto.nombre,
                'cantidad': '5',  # Simulado
                'proveedor': 'Proveedor Ejemplo',  # Debería venir de ProductoProveedor
                'fechaVencimiento': fecha_vencimiento.strftime('%Y-%m-%d'),
                'notificado': False
            }
            
            # Calcular estado
            diferencia = (fecha_vencimiento - fecha_actual).days
            if diferencia < 0:
                estado_producto = 'vencidos'
            elif diferencia <= 30:
                estado_producto = 'proximos'
            else:
                estado_producto = 'vigentes'
            
            # Filtrar por estado
            if estado_filtro == 'todos' or estado_filtro == estado_producto:
                productos_vencimiento.append(data)
        
        return Response(productos_vencimiento)
    
    @action(detail=True, methods=['post'])
    def actualizar_stock(self, request, pk=None):
        """Actualizar stock de un producto específico"""
        try:
            producto = self.get_object()
            nuevo_stock = request.data.get('stock', 0)
            nuevo_estado = request.data.get('estado', 'Disponible')
            
            # Aquí actualizarías el stock en tu modelo de inventario
            # Por ahora solo retornamos una respuesta de éxito
            
            return Response({
                'message': 'Stock actualizado correctamente',
                'producto': producto.nombre,
                'nuevo_stock': nuevo_stock,
                'nuevo_estado': nuevo_estado
            })
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class ProductoProveedorViewSet(viewsets.ModelViewSet):
    queryset = ProductoProveedor.objects.select_related('producto', 'proveedor')
    serializer_class = ProductoProveedorSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        producto_id = self.request.query_params.get('producto_id', None)
        proveedor_id = self.request.query_params.get('proveedor_id', None)
        
        if producto_id:
            queryset = queryset.filter(producto__idproducto=producto_id)
        if proveedor_id:
            queryset = queryset.filter(proveedor__idproveedor=proveedor_id)
            
        return queryset