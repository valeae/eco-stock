from django.db import models
from suppliers.models import Proveedor

# Create your models here.

class Categoria(models.Model):
    idcategoria = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=255,null=False)
    descripcion = models.CharField(max_length=255, null=False)
    tipo = models.CharField(max_length=255, null=False)
    vida_util = models.CharField(max_length=255, null=False)
    presentacion = models.CharField(max_length=255, null=False)


class UnidadesMedida(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=255,null=False)
    abreviatura = models.CharField(max_length=255,null=False)

class Producto(models.Model):
    idproducto = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=255,null=False)
    descripcion = models.CharField(max_length=255, null=False)
    lote = models.CharField(max_length=255, null=False)
    stock = models.IntegerField(default=0)
    idcategoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    unidad_medida_id = models.ForeignKey(UnidadesMedida, on_delete=models.CASCADE)

class ProductoProveedor(models.Model):
    id = models.BigAutoField(primary_key=True)
    producto = models.ForeignKey(
        Producto, 
        on_delete=models.CASCADE,
        db_column='producto_id',
        to_field='idproducto'
    )
    proveedor = models.ForeignKey(
        Proveedor, 
        on_delete=models.CASCADE,
        db_column='proveedor_id',
        to_field='idproveedor'
    )
