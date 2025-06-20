# Generated by Django 5.2 on 2025-06-09 23:47

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('productos', '0001_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Inventario',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('cantidad', models.IntegerField(default=0)),
                ('fecha_actualizacion', models.DateField(default=django.utils.timezone.now)),
                ('estado', models.TextField(blank=True, null=True)),
                ('producto', models.ForeignKey(db_column='producto_id', on_delete=django.db.models.deletion.CASCADE, to='productos.producto')),
            ],
            options={
                'verbose_name': 'Inventario',
                'verbose_name_plural': 'Inventarios',
                'db_table': 'inventario',
            },
        ),
        migrations.CreateModel(
            name='MovimientoInventario',
            fields=[
                ('idmovimientoinventario', models.BigAutoField(primary_key=True, serialize=False)),
                ('fecha', models.DateField(default=django.utils.timezone.now)),
                ('tipo_movimiento', models.CharField(max_length=255)),
                ('idusuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.usuario')),
                ('inventario_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.inventario')),
            ],
            options={
                'verbose_name': 'Movimiento de Inventario',
                'verbose_name_plural': 'Movimientos de Inventario',
                'db_table': 'movimiento_inventario',
            },
        ),
        migrations.CreateModel(
            name='DetalleEntradaSalida',
            fields=[
                ('iddetalleentrada', models.BigAutoField(primary_key=True, serialize=False)),
                ('cantidad', models.IntegerField(default=0)),
                ('identradainventario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.movimientoinventario')),
            ],
            options={
                'verbose_name': 'Detalle Entrada/Salida',
                'verbose_name_plural': 'Detalles Entrada/Salida',
                'db_table': 'detalle_entrada_salida',
            },
        ),
        migrations.CreateModel(
            name='ProductosVencimiento',
            fields=[
                ('fecha_vencimiento', models.DateField()),
                ('notificado', models.BooleanField(default=False)),
                ('producto_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='productos.producto')),
            ],
            options={
                'verbose_name': 'Producto Vencimiento',
                'verbose_name_plural': 'Productos Vencimiento',
                'db_table': 'productos_vencimiento',
                'unique_together': {('producto_id', 'fecha_vencimiento')},
            },
        ),
    ]
