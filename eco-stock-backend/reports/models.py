from django.db import models
from django.contrib.auth.models import User
from inventory.models import Producto, Categoria
from suppliers.models import Proveedor

class TipoReporte(models.Model):
    TIPOS_REPORTE = [
        ('inventario', 'Reporte de Inventario'),
        ('ventas', 'Reporte de Ventas'),
        ('compras', 'Reporte de Compras'),
        ('stock_bajo', 'Reporte de Stock Bajo'),
        ('productos_categoria', 'Reporte por Categoría'),
        ('proveedores', 'Reporte de Proveedores'),
        ('rentabilidad', 'Reporte de Rentabilidad'),
    ]
    
    nombre = models.CharField(max_length=50, choices=TIPOS_REPORTE, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.get_nombre_display()
    
    class Meta:
        verbose_name = "Tipo de Reporte"
        verbose_name_plural = "Tipos de Reportes"

class Reporte(models.Model):
    ESTADOS_REPORTE = [
        ('generando', 'Generando'),
        ('completado', 'Completado'),
        ('error', 'Error'),
    ]
    
    tipo_reporte = models.ForeignKey(TipoReporte, on_delete=models.CASCADE)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADOS_REPORTE, default='generando')
    parametros = models.JSONField(default=dict, blank=True)  # Para filtros adicionales
    fecha_generacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.nombre} - {self.fecha_generacion.strftime('%d/%m/%Y')}"
    
    class Meta:
        verbose_name = "Reporte"
        verbose_name_plural = "Reportes"
        ordering = ['-fecha_generacion']

class DetalleReporteInventario(models.Model):
    reporte = models.ForeignKey(Reporte, related_name='detalles_inventario', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    stock_actual = models.DecimalField(max_digits=10, decimal_places=2)
    stock_minimo = models.DecimalField(max_digits=10, decimal_places=2)
    precio_costo = models.DecimalField(max_digits=10, decimal_places=2)
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2)
    valor_total_stock = models.DecimalField(max_digits=10, decimal_places=2)
    estado_stock = models.CharField(max_length=20, choices=[
        ('normal', 'Normal'),
        ('bajo', 'Stock Bajo'),
        ('agotado', 'Agotado'),
        ('exceso', 'Exceso'),
    ])
    
    class Meta:
        verbose_name = "Detalle Reporte Inventario"
        verbose_name_plural = "Detalles Reporte Inventario"

class DetalleReporteProveedor(models.Model):
    reporte = models.ForeignKey(Reporte, related_name='detalles_proveedor', on_delete=models.CASCADE)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)
    total_productos = models.IntegerField()
    valor_total_productos = models.DecimalField(max_digits=12, decimal_places=2)
    productos_activos = models.IntegerField()
    productos_inactivos = models.IntegerField()
    
    class Meta:
        verbose_name = "Detalle Reporte Proveedor"
        verbose_name_plural = "Detalles Reporte Proveedor"

class ConfiguracionReporte(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    tipo_reporte = models.ForeignKey(TipoReporte, on_delete=models.CASCADE)
    configuracion = models.JSONField(default=dict)  # Configuraciones personalizadas
    es_favorito = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Configuración de Reporte"
        verbose_name_plural = "Configuraciones de Reportes"
        unique_together = ['usuario', 'tipo_reporte']