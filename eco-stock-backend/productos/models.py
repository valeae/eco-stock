from django.db import models

# Create your models here.

class categoria(models.Model):
    idcategoria = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=255,null=False)
    descripcion = models.CharField(null=False)

class unidades_medida(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=255,null=False)
    abreviatura = models.CharField(max_length=255,null=False)

class producto(models.Model):
    idproducto = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=255,null=False)
    descripcion = models.CharField(null=False)
    idcategoria = models.ForeignKey(categoria.idcategoria)
    unidad_medida_id = models.ForeignKey(unidades_medida.id)
