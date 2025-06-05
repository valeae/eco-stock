from rest_framework import serializers
from .models import Inventario, MovimientoInventario, DetalleEntradaSalida, ProductosVencimiento

class InventarioSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    
    class Meta:
        model = Inventario
        fields = '__all__'

class MovimientoInventarioSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='idusuario.nombre', read_only=True)
    producto_nombre = serializers.CharField(source='inventario_id.producto.nombre', read_only=True)
    
    class Meta:
        model = MovimientoInventario
        fields = '__all__'

class DetalleEntradaSalidaSerializer(serializers.ModelSerializer):
    movimiento_tipo = serializers.CharField(source='identradainventario.tipo_movimiento', read_only=True)
    
    class Meta:
        model = DetalleEntradaSalida
        fields = '__all__'

class ProductosVencimientoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto_id.nombre', read_only=True)
    
    class Meta:
        model = ProductosVencimiento
        fields = '__all__'