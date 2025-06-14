from rest_framework import serializers
from .models import Categoria, UnidadesMedida, Producto, ProductoProveedor
from suppliers.models import Proveedor

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
    unidad_medida_abreviatura = serializers.CharField(source='unidad_medida_id.abreviatura', read_only=True)
    
    class Meta:
        model = Producto
        fields = [
            'idproducto', 'nombre', 'descripcion', 'lote',
            'idcategoria', 'categoria_nombre',
            'unidad_medida_id', 'unidad_medida_nombre', 'unidad_medida_abreviatura'
        ]

class ProductoProveedorSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    
    class Meta:
        model = ProductoProveedor
        fields = [
            'id', 'producto', 'producto_nombre', 
            'proveedor', 'proveedor_nombre'
        ]

# Serializer específico para el dashboard de productos
class ProductoDashboardSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(source='idcategoria', read_only=True)
    unidad_medida = UnidadesMedidaSerializer(source='unidad_medida_id', read_only=True)
    proveedores = serializers.SerializerMethodField()
    stock = serializers.IntegerField(default=0, read_only=True)  # Campo calculado
    estado = serializers.CharField(default='Disponible', read_only=True)  # Campo calculado
    
    class Meta:
        model = Producto
        fields = [
            'idproducto', 'nombre', 'descripcion', 'lote',
            'categoria', 'unidad_medida', 'proveedores',
            'stock', 'estado'
        ]
    
    def get_proveedores(self, obj):
        producto_proveedores = ProductoProveedor.objects.filter(producto=obj)
        return [pp.proveedor.nombre for pp in producto_proveedores]

# Serializer para crear/actualizar productos
class ProductoCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['nombre', 'descripcion', 'lote', 'idcategoria', 'unidad_medida_id']
    
    def validate_nombre(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("El nombre debe tener al menos 2 caracteres")
        return value.strip()
    
    def validate_descripcion(self, value):
        if not value or len(value.strip()) < 5:
            raise serializers.ValidationError("La descripción debe tener al menos 5 caracteres")
        return value.strip()
    
    def validate_lote(self, value):
        if not value or len(value.strip()) < 1:
            raise serializers.ValidationError("El lote es obligatorio")
        return value.strip()

# Serializer para productos próximos a vencer (simulado)
class ProductoVencimientoSerializer(serializers.ModelSerializer):
    fecha_vencimiento = serializers.DateField(default='2024-12-31')  # Campo simulado
    dias_restantes = serializers.IntegerField(default=30, read_only=True)  # Campo calculado
    estado_vencimiento = serializers.CharField(default='Vigente', read_only=True)  # Campo calculado
    proveedor = serializers.SerializerMethodField()
    cantidad = serializers.CharField(default='1', read_only=True)  # Campo simulado
    
    class Meta:
        model = Producto
        fields = [
            'idproducto', 'nombre', 'lote', 'descripcion',
            'fecha_vencimiento', 'dias_restantes', 'estado_vencimiento',
            'proveedor', 'cantidad'
        ]
    
    def get_proveedor(self, obj):
        producto_proveedor = ProductoProveedor.objects.filter(producto=obj).first()
        return producto_proveedor.proveedor.nombre if producto_proveedor else 'Sin proveedor'