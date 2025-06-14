from django.contrib import admin
from .models import TipoReporte, Reporte, DetalleReporteInventario, DetalleReporteProveedor, ConfiguracionReporte

@admin.register(TipoReporte)
class TipoReporteAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'descripcion', 'activo', 'fecha_creacion']
    list_filter = ['activo', 'nombre']
    search_fields = ['nombre', 'descripcion']
    readonly_fields = ['fecha_creacion']

class DetalleReporteInventarioInline(admin.TabularInline):
    model = DetalleReporteInventario
    extra = 0
    readonly_fields = ['producto', 'categoria', 'stock_actual', 'valor_total_stock']

class DetalleReporteProveedorInline(admin.TabularInline):
    model = DetalleReporteProveedor
    extra = 0
    readonly_fields = ['proveedor', 'total_productos', 'valor_total_productos']

@admin.register(Reporte)
class ReporteAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'tipo_reporte', 'usuario', 'estado', 'fecha_generacion']
    list_filter = ['estado', 'tipo_reporte', 'fecha_generacion']
    search_fields = ['nombre', 'descripcion', 'usuario__username']
    readonly_fields = ['fecha_generacion', 'fecha_actualizacion']
    date_hierarchy = 'fecha_generacion'
    
    inlines = [DetalleReporteInventarioInline, DetalleReporteProveedorInline]
    
    fieldsets = (
        ('Información General', {
            'fields': ('nombre', 'descripcion', 'tipo_reporte', 'usuario')
        }),
        ('Período del Reporte', {
            'fields': ('fecha_inicio', 'fecha_fin')
        }),
        ('Estado y Parámetros', {
            'fields': ('estado', 'parametros')
        }),
        ('Fechas', {
            'fields': ('fecha_generacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        })
    )

@admin.register(DetalleReporteInventario)
class DetalleReporteInventarioAdmin(admin.ModelAdmin):
    list_display = ['reporte', 'producto', 'categoria', 'stock_actual', 'estado_stock', 'valor_total_stock']
    list_filter = ['estado_stock', 'categoria', 'reporte__tipo_reporte']
    search_fields = ['producto__nombre', 'categoria__nombre', 'reporte__nombre']

@admin.register(DetalleReporteProveedor)
class DetalleReporteProveedorAdmin(admin.ModelAdmin):
    list_display = ['reporte', 'proveedor', 'total_productos', 'valor_total_productos']
    list_filter = ['reporte__tipo_reporte']
    search_fields = ['proveedor__nombre', 'reporte__nombre']

@admin.register(ConfiguracionReporte)
class ConfiguracionReporteAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'tipo_reporte', 'es_favorito', 'fecha_creacion']
    list_filter = ['tipo_reporte', 'es_favorito']
    search_fields = ['usuario__username',