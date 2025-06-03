from django.db import models

# Create your models here.

class Proveedor(models.Model):
    idproveedor = models.BigAutoField(primary_key=True)  # ✅ CORREGIDO: BigAutoField
    tipo = models.TextField(blank=True, null=True)
    nombre = models.TextField(blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    estado = models.BooleanField(default=True)
    correo = models.EmailField(blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    
    class Meta:
        db_table = 'proveedor'
        verbose_name = 'Proveedor'
        verbose_name_plural = 'Proveedores'
    
    def __str__(self):
        return self.nombre or f"Proveedor {self.idproveedor}"