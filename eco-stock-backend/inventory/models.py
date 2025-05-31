from django.db import models
from django.utils import timezone
from productos.models import ProductoProveedor
from users.models import Usuario
# Create your models here.



class Inventario(models.Model):
    id = models.BigAutoField(primary_key=True)
    producto = models.ForeignKey(
        ProductoProveedor,
        on_delete=models.CASCADE,
        db_column='producto_id'
    )
    cantidad = models.IntegerField(default=0)
    fecha_actualizacion = models.DateField(default=timezone.now)
    estado = models.TextField(blank=True, null=True)

class MovimientoInventario(models.Model):
    fecha = models.DateField(default=timezone.now)
    tipo_movimiento = models.CharField(max_length=255, null=False)
    idusuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    inventario_id = models.ForeignKey(Inventario, on_delete=models.CASCADE)

class DetalleEntradaSalida(models.Model):
    cantidad = models.IntegerField(default=0)
    identradainventario = models.ForeignKey(MovimientoInventario, on_delete=models.CASCADE)

class ProductosVencimiento(models.Model):
    fecha_vencimiento = models.DateField()
    notificado = models.BooleanField
    producto_id = models.ForeignKey(DetalleEntradaSalida, on_delete=models.CASCADE)