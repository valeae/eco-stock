from django.db import models

# Create your models here.

class Rol(models.model):
    nombre = models.CharField(null=False)

class Usuario(models.Model):
    idusuario = models.BigIntegerField(primary_key=True)
    nombre = models.CharField(null=False)
    correo_electronico = models.CharField(null=False)
    contraseña = models.CharField(null=False)
    idrol = models.ForeignKey(Rol.pk)