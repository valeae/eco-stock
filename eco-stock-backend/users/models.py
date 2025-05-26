from django.db import models

# Create your models here.

class Rol(models.Model):
    idrol = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=255, null=False)

class Usuario(models.Model):
    idusuario = models.BigIntegerField(primary_key=True)
    nombre = models.CharField(max_length=255, null=False)
    correo_electronico = models.EmailField(blank=True, null=True)
    contraseña = models.CharField(max_length=255, null=False)
    idrol = models.ForeignKey(Rol, on_delete=models.CASCADE)