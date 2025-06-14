from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, UnidadesMedidaViewSet, ProductoViewSet, ProductoProveedorViewSet

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'unidades-medida', UnidadesMedidaViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'producto-proveedor', ProductoProveedorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]