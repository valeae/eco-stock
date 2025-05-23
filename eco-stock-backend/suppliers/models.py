from django.db import models

# Create your models here.

class proveedor(models.Model):
    idproveedor = models.BigIntegerField(primary_key=True)
    tipo = models.TextField(blank=True, null=True)
    nombre = models.TextField(blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    estado = models.BooleanField(default=True)
    correo = models.EmailField(blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)