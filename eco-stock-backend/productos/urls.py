from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categorias', views.CategoriaViewSet)
router.register(r'unidades-medida', views.UnidadesMedidaViewSet)
router.register(r'productos', views.ProductoViewSet)
router.register(r'producto-proveedor', views.ProductoProveedorViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]

# Ejemplos de uso de los endpoints:

"""
GET /api/productos/ - Listar todos los productos
GET /api/productos/?search=fertilizante - Buscar productos
GET /api/productos/detalles/ - Productos con detalles de stock
GET /api/productos/detalles/?search=abono - Buscar en detalles
GET /api/productos/proximos_vencer/ - Productos próximos a vencer
GET /api/productos/proximos_vencer/?estado=proximos - Filtrar por estado
GET /api/productos/proximos_vencer/?search=proveedor - Buscar por proveedor
POST /api/productos/{id}/actualizar_stock/ - Actualizar stock

GET /api/categorias/ - Listar categorías
POST /api/categorias/ - Crear categoría
PUT /api/categorias/{id}/ - Actualizar categoría
DELETE /api/categorias/{id}/ - Eliminar categoría

GET /api/unidades-medida/ - Listar unidades de medida
POST /api/unidades-medida/ - Crear unidad de medida

GET /api/producto-proveedor/ - Relaciones producto-proveedor
GET /api/producto-proveedor/?producto_id=1 - Proveedores de un producto
"""