from rest_framework import serializers
from .models import Categoria, UnidadesMedida, Producto, ProductoProveedor

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class UnidadesMedidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnidadesMedida
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='idcategoria.nombre', read_only=True)
    unidad_medida_nombre = serializers.CharField(source='unidad_medida_id.nombre', read_only=True)
    
    class Meta:
        model = Producto
        fields = '__all__'

class ProductoProveedorSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    
    class Meta:
        model = ProductoProveedor
        fields = '__all__'