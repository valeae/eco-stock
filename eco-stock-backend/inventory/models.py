from django.db import models
from django.utils import timezone
from productos.models import Producto  # ✅ CORREGIDO: Importar Producto directamente
from users.models import Usuario
# Create your models here.



class Inventario(models.Model):
    id = models.BigAutoField(primary_key=True)
    producto = models.ForeignKey(
        Producto,  # ✅ CORREGIDO: Referencia directa a Producto
        on_delete=models.CASCADE,
        db_column='producto_id'
    )
    cantidad = models.IntegerField(default=0)
    fecha_actualizacion = models.DateField(default=timezone.now)
    estado = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'inventario'
        verbose_name = 'Inventario'
        verbose_name_plural = 'Inventarios'
    
    def __str__(self):
        return f"{self.producto.nombre} - Stock: {self.cantidad}"

class MovimientoInventario(models.Model):
    idmovimientoinventario = models.BigAutoField(primary_key=True)  # ✅ CORREGIDO: Agregar campo primary_key explícito
    fecha = models.DateField(default=timezone.now)
    tipo_movimiento = models.CharField(max_length=255, null=False)
    idusuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    inventario_id = models.ForeignKey(Inventario, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'movimiento_inventario'
        verbose_name = 'Movimiento de Inventario'
        verbose_name_plural = 'Movimientos de Inventario'
    
    def __str__(self):
        return f"{self.tipo_movimiento} - {self.fecha}"

class DetalleEntradaSalida(models.Model):
    iddetalleentrada = models.BigAutoField(primary_key=True)  # ✅ CORREGIDO: Agregar campo primary_key explícito
    cantidad = models.IntegerField(default=0)
    identradainventario = models.ForeignKey(MovimientoInventario, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'detalle_entrada_salida'
        verbose_name = 'Detalle Entrada/Salida'
        verbose_name_plural = 'Detalles Entrada/Salida'
    
    def __str__(self):
        return f"Detalle {self.iddetalleentrada} - Cantidad: {self.cantidad}"

class ProductosVencimiento(models.Model):
    fecha_vencimiento = models.DateField()
    notificado = models.BooleanField(default=False)  # ✅ CORREGIDO: Agregar default y paréntesis
    producto_id = models.ForeignKey(
        Producto,  # ✅ CORREGIDO: Referencia directa a Producto
        on_delete=models.CASCADE,
        primary_key=True  # ✅ CORREGIDO: Mantener como primary_key según diseño original
    )
    
    class Meta:
        db_table = 'productos_vencimiento'
        verbose_name = 'Producto Vencimiento'
        verbose_name_plural = 'Productos Vencimiento'
    
    def __str__(self):
        return f"{self.producto_id.nombre} - Vence: {self.fecha_vencimiento}"
