from django.db import models
from suppliers.models import Proveedor

# Create your models here.

class Categoria(models.Model):
    idcategoria = models.BigAutoField(primary_key=True)  # ✅ CORREGIDO: BigAutoField
    nombre = models.CharField(max_length=255, null=False)
    descripcion = models.CharField(max_length=255, null=False)
    tipo = models.CharField(max_length=255, null=False)
    vida_util = models.CharField(max_length=255, null=False)
    presentacion = models.CharField(max_length=255, null=False)
    
    class Meta:
        db_table = 'categoria'
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'
    
    def __str__(self):
        return self.nombre

class UnidadesMedida(models.Model):
    id = models.BigAutoField(primary_key=True)  # ✅ CORREGIDO: BigAutoField
    nombre = models.CharField(max_length=255, null=False)
    abreviatura = models.CharField(max_length=255, null=False)
    
    class Meta:
        db_table = 'unidades_medida'
        verbose_name = 'Unidad de Medida'
        verbose_name_plural = 'Unidades de Medida'
    
    def __str__(self):
        return f"{self.nombre} ({self.abreviatura})"

class Producto(models.Model):
    idproducto = models.BigAutoField(primary_key=True)  # ✅ CORREGIDO: BigAutoField
    nombre = models.CharField(max_length=255, null=False)
    descripcion = models.CharField(max_length=255, null=False)
    lote = models.CharField(max_length=255, null=False)
    idcategoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    unidad_medida_id = models.ForeignKey(UnidadesMedida, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'producto'
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
    
    def __str__(self):
        return self.nombre

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
    
    class Meta:
        db_table = 'producto_proveedor'
        verbose_name = 'Producto-Proveedor'
        verbose_name_plural = 'Productos-Proveedores'
        unique_together = ('producto', 'proveedor')
    
    def __str__(self):
        return f"{self.producto.nombre} - {self.proveedor.nombre}"
