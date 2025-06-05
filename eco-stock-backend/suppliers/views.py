from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Proveedor
from .serializers import ProveedorSerializer

class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    
    def create(self, request):
        """Crear proveedor"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def list(self, request):
        """Listar proveedores"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Obtener proveedor por ID"""
        try:
            proveedor = self.get_object()
            serializer = self.get_serializer(proveedor)
            return Response(serializer.data)
        except Proveedor.DoesNotExist:
            return Response({'error': 'Proveedor no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, pk=None):
        """Actualizar proveedor"""
        try:
            proveedor = self.get_object()
            serializer = self.get_serializer(proveedor, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Proveedor.DoesNotExist:
            return Response({'error': 'Proveedor no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    def destroy(self, request, pk=None):
        """Eliminar proveedor"""
        try:
            proveedor = self.get_object()
            proveedor.delete()
            return Response({'mensaje': 'Proveedor eliminado correctamente'}, status=status.HTTP_204_NO_CONTENT)
        except Proveedor.DoesNotExist:
            return Response({'error': 'Proveedor no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['patch'])
    def activar(self, request, pk=None):
        """Activar proveedor"""
        try:
            proveedor = self.get_object()
            proveedor.estado = True
            proveedor.save()
            return Response({'mensaje': 'Proveedor activado correctamente'})
        except Proveedor.DoesNotExist:
            return Response({'error': 'Proveedor no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['patch'])
    def desactivar(self, request, pk=None):
        """Desactivar proveedor"""
        try:
            proveedor = self.get_object()
            proveedor.estado = False
            proveedor.save()
            return Response({'mensaje': 'Proveedor desactivado correctamente'})
        except Proveedor.DoesNotExist:
            return Response({'error': 'Proveedor no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def activos(self, request):
        """Obtener proveedores activos"""
        proveedores = Proveedor.objects.filter(estado=True)
        serializer = self.get_serializer(proveedores, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def buscar(self, request):
        """Buscar proveedores"""
        termino = request.query_params.get('q', '')
        if termino:
            proveedores = Proveedor.objects.filter(
                Q(nombre__icontains=termino) |
                Q(correo__icontains=termino) |
                Q(telefono__icontains=termino)
            )
            serializer = self.get_serializer(proveedores, many=True)
            return Response(serializer.data)
        return Response({'error': 'Término de búsqueda requerido'}, status=status.HTTP_400_BAD_REQUEST)
