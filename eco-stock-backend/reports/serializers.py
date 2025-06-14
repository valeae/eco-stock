from rest_framework import serializers
from .models import TipoReporte, Reporte, DetalleReporteInventario, DetalleReporteProveedor, ConfiguracionReporte
from inventory.models import Producto, Categoria
from suppliers.models import Proveedor

class TipoReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoReporte
        fields = ['id', 'nombre', 'descripcion', 'activo', 'fecha_creacion']

class DetalleReporteInventarioSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    
    class Meta:
        model = DetalleReporteInventario
        fields = [
            'id', 'producto', 'producto_nombre', 'categoria', 'categoria_nombre',
            'stock_actual', 'stock_minimo', 'precio_costo', 'precio_venta',
            'valor_total_stock', 'estado_stock'
        ]

class DetalleReporteProveedorSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    
    class Meta:
        model = DetalleReporteProveedor
        fields = [
            'id', 'proveedor', 'proveedor_nombre', 'total_productos',
            'valor_total_productos', 'productos_activos', 'productos_inactivos'
        ]

class ReporteSerializer(serializers.ModelSerializer):
    tipo_reporte_nombre = serializers.CharField(source='tipo_reporte.get_nombre_display', read_only=True)
    usuario_nombre = serializers.CharField(source='usuario.get_full_name', read_only=True)
    detalles_inventario = DetalleReporteInventarioSerializer(many=True, read_only=True)
    detalles_proveedor = DetalleReporteProveedorSerializer(many=True, read_only=True)
    
    class Meta:
        model = Reporte
        fields = [
            'id', 'tipo_reporte', 'tipo_reporte_nombre', 'usuario', 'usuario_nombre',
            'nombre', 'descripcion', 'fecha_inicio', 'fecha_fin', 'estado',
            'parametros', 'fecha_generacion', 'fecha_actualizacion',
            'detalles_inventario', 'detalles_proveedor'
        ]

class ReporteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reporte
        fields = [
            'tipo_reporte', 'nombre', 'descripcion', 'fecha_inicio',
            'fecha_fin', 'parametros'
        ]

class ConfiguracionReporteSerializer(serializers.ModelSerializer):
    tipo_reporte_nombre = serializers.CharField(source='tipo_reporte.get_nombre_display', read_only=True)
    
    class Meta:
        model = ConfiguracionReporte
        fields = [
            'id', 'tipo_reporte', 'tipo_reporte_nombre', 'configuracion',
            'es_favorito', 'fecha_creacion'
        ]

# Serializers para datos de dashboard
class ResumenInventarioSerializer(serializers.Serializer):
    total_productos = serializers.IntegerField()
    productos_bajo_stock = serializers.IntegerField()
    productos_agotados = serializers.IntegerField()
    valor_total_inventario = serializers.DecimalField(max_digits=12, decimal_places=2)
    categorias_activas = serializers.IntegerField()

class ProductoBajoStockSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'stock_actual', 'stock_minimo', 'categoria_nombre']

class ProductoTopSerializer(serializers.Serializer):
    producto_id = serializers.IntegerField()
    producto_nombre = serializers.CharField()
    categoria_nombre = serializers.CharField()
    stock_actual = serializers.DecimalField(max_digits=10, decimal_places=2)
    valor_stock = serializers.DecimalField(max_digits=12, decimal_places=2)

class ReporteRapidoSerializer(serializers.Serializer):
    resumen_inventario = ResumenInventarioSerializer()
    productos_bajo_stock = ProductoBajoStockSerializer(many=True)
    productos_top_valor = ProductoTopSerializer(many=True)
    productos_por_categoria = serializers.DictField()