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
    
    # Endpoints específicos para el dashboard
    path('api/productos/dashboard/', views.ProductoViewSet.as_view({'get': 'dashboard'}), name='productos-dashboard'),
    path('api/productos/proximos-vencer/', views.ProductoViewSet.as_view({'get': 'proximos_vencer'}), name='productos-proximos-vencer'),
    path('api/productos/estadisticas/', views.ProductoViewSet.as_view({'get': 'estadisticas'}), name='productos-estadisticas'),
]