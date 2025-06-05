from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    InventarioViewSet, 
    MovimientoInventarioViewSet, 
    DetalleEntradaSalidaViewSet,
    ProductosVencimientoViewSet,
    ReportesView,
    DashboardView
)

router = DefaultRouter()
router.register(r'inventario', InventarioViewSet)
router.register(r'movimientos', MovimientoInventarioViewSet)
router.register(r'detalles', DetalleEntradaSalidaViewSet)
router.register(r'vencimientos', ProductosVencimientoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('reportes/<str:tipo_reporte>/', ReportesView.as_view(), name='reportes'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]