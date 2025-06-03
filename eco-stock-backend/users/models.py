from django.db import models

# Create your models here.

class Rol(models.Model):
    idrol = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=255, null=False)
    
    class Meta:
        db_table = 'rol'
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'
    
    def __str__(self):
        return self.nombre

class Usuario(models.Model):
    idusuario = models.BigAutoField(primary_key=True)  # ✅ CORREGIDO: BigAutoField
    nombre = models.CharField(max_length=255, null=False)
    correo_electronico = models.EmailField(blank=True, null=True)
    contraseña = models.CharField(max_length=255, null=False)
    idrol = models.ForeignKey(Rol, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'usuario'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
    
    def __str__(self):
        return self.nombre