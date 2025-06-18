from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Categoria, UnidadesMedida, Producto, ProductoProveedor
from .serializers import CategoriaSerializer, UnidadesMedidaSerializer, ProductoSerializer, ProductoProveedorSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    
    def create(self, request):
        """Crear categoría"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def list(self, request):
        """Listar categorías"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Obtener categoría por ID"""
        try:
            categoria = self.get_object()
            serializer = self.get_serializer(categoria)
            return Response(serializer.data)
        except Categoria.DoesNotExist:
            return Response({'error': 'Categoría no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, pk=None):
        """Actualizar categoría"""
        try:
            categoria = self.get_object()
            serializer = self.get_serializer(categoria, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Categoria.DoesNotExist:
            return Response({'error': 'Categoría no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    
    def destroy(self, request, pk=None):
        """Eliminar categoría"""
        try:
            categoria = self.get_object()
            categoria.delete()
            return Response({'mensaje': 'Categoría eliminada correctamente'}, status=status.HTTP_204_NO_CONTENT)
        except Categoria.DoesNotExist:
            return Response({'error': 'Categoría no encontrada'}, status=status.HTTP_404_NOT_FOUND)

class UnidadesMedidaViewSet(viewsets.ModelViewSet):
    queryset = UnidadesMedida.objects.all()
    serializer_class = UnidadesMedidaSerializer
    
    def create(self, request):
        """Crear unidad de medida"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def list(self, request):
        """Listar unidades de medida"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Obtener unidad de medida por ID"""
        try:
            unidad = self.get_object()
            serializer = self.get_serializer(unidad)
            return Response(serializer.data)
        except UnidadesMedida.DoesNotExist:
            return Response({'error': 'Unidad de medida no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, pk=None):
        """Actualizar unidad de medida"""
        try:
            unidad = self.get_object()
            serializer = self.get_serializer(unidad, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UnidadesMedida.DoesNotExist:
            return Response({'error': 'Unidad de medida no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    
    def destroy(self, request, pk=None):
        """Eliminar unidad de medida"""
        try:
            unidad = self.get_object()
            unidad.delete()
            return Response({'mensaje': 'Unidad de medida eliminada correctamente'}, status=status.HTTP_204_NO_CONTENT)
        except UnidadesMedida.DoesNotExist:
            return Response({'error': 'Unidad de medida no encontrada'}, status=status.HTTP_404_NOT_FOUND)

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    
    def create(self, request):
        """Crear producto"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def list(self, request):
        """Listar productos"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Obtener producto por ID"""
        try:
            producto = self.get_object()
            serializer = self.get_serializer(producto)
            return Response(serializer.data)
        except Producto.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, pk=None):
        """Actualizar producto"""
        try:
            producto = self.get_object()
            serializer = self.get_serializer(producto, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Producto.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    def destroy(self, request, pk=None):
        """Eliminar producto"""
        try:
            producto = self.get_object()
            producto.delete()
            return Response({'mensaje': 'Producto eliminado correctamente'}, status=status.HTTP_204_NO_CONTENT)
        except Producto.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def buscar(self, request):
        """Buscar productos"""
        termino = request.query_params.get('q', '')
        if termino:
            productos = Producto.objects.filter(
                Q(nombre__icontains=termino) |
                Q(descripcion__icontains=termino) |
                Q(lote__icontains=termino)
            )
            serializer = self.get_serializer(productos, many=True)
            return Response(serializer.data)
        return Response({'error': 'Término de búsqueda requerido'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def por_categoria(self, request):
        """Obtener productos por categoría"""
        categoria_id = request.query_params.get('categoria_id')
        if categoria_id:
            productos = Producto.objects.filter(idcategoria=categoria_id)
            serializer = self.get_serializer(productos, many=True)
            return Response(serializer.data)
        return Response({'error': 'ID de categoría requerido'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def por_lote(self, request):
        """Obtener productos por lote"""
        lote = request.query_params.get('lote')
        if lote:
            productos = Producto.objects.filter(lote=lote)
            serializer = self.get_serializer(productos, many=True)
            return Response(serializer.data)
        return Response({'error': 'Lote requerido'}, status=status.HTTP_400_BAD_REQUEST)

class ProductoProveedorViewSet(viewsets.ModelViewSet):
    queryset = ProductoProveedor.objects.all()
    serializer_class = ProductoProveedorSerializer
    
    @action(detail=False, methods=['post'])
    def asignar(self, request):
        """Asignar proveedor a producto"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def proveedores_producto(self, request):
        """Obtener proveedores de un producto"""
        producto_id = request.query_params.get('producto_id')
        if producto_id:
            asignaciones = ProductoProveedor.objects.filter(producto_id=producto_id)
            serializer = self.get_serializer(asignaciones, many=True)
            return Response(serializer.data)
        return Response({'error': 'ID de producto requerido'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def productos_proveedor(self, request):
        """Obtener productos de un proveedor"""
        proveedor_id = request.query_params.get('proveedor_id')
        if proveedor_id:
            asignaciones = ProductoProveedor.objects.filter(proveedor_id=proveedor_id)
            serializer = self.get_serializer(asignaciones, many=True)
            return Response(serializer.data)
        return Response({'error': 'ID de proveedor requerido'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['delete'])
    def eliminar_asignacion(self, request):
        """Eliminar asignación producto-proveedor"""
        producto_id = request.data.get('producto_id')
        proveedor_id = request.data.get('proveedor_id')
        
        if producto_id and proveedor_id:
            try:
                asignacion = ProductoProveedor.objects.get(
                    producto_id=producto_id,
                    proveedor_id=proveedor_id
                )
                asignacion.delete()
                return Response({'mensaje': 'Asignación eliminada correctamente'}, status=status.HTTP_204_NO_CONTENT)
            except ProductoProveedor.DoesNotExist:
                return Response({'error': 'Asignación no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'IDs de producto y proveedor requeridos'}, status=status.HTTP_400_BAD_REQUEST)