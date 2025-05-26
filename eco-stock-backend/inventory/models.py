from django.db import models
from django.utils import timezone
from productos.models import producto
from suppliers.models import proveedor
# Create your models here.

class producto_proveedor(models.Model):
    id = models.BigAutoField(primary_key=True)
    producto = models.ForeignKey(
        producto, 
        on_delete=models.CASCADE,
        db_column='producto_id',
        to_field='idproducto'
    )
    proveedor = models.ForeignKey(
        proveedor, 
        on_delete=models.CASCADE,
        db_column='proveedor_id',
        to_field='idproveedor'
    )

class Inventario(models.Model):
    id = models.BigAutoField(primary_key=True)
    producto = models.ForeignKey(
        producto_proveedor,
        on_delete=models.CASCADE,
        db_column='producto_id'
    )
    cantidad = models.IntegerField(default=0)
    fecha_actualizacion = models.DateField(default=timezone.now)
    estado = models.TextField(blank=True, null=True)