from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tipos-reporte', views.TipoReporteViewSet)
router.register(r'reportes', views.ReporteViewSet)
router.register(r'configuraciones', views.ConfiguracionReporteViewSet, basename='configuracion')

urlpatterns = [
    path('api/', include(router.urls)),
]

# URLs disponibles:
# GET  /reports/api/tipos-reporte/              - Lista tipos de reportes
# GET  /reports/api/tipos-reporte/{id}/         - Detalle tipo de reporte

# GET  /reports/api/reportes/                   - Lista reportes
# POST /reports/api/reportes/                   - Crear reporte
# GET  /reports/api/reportes/{id}/              - Detalle reporte
# PUT  /reports/api/reportes/{id}/              - Actualizar reporte
# DELETE /reports/api/reportes/{id}/            - Eliminar reporte
# GET  /reports/api/reportes/dashboard/         - Dashboard de reportes
# POST /reports/api/reportes/generar_reporte_rapido/ - Generar reporte rápido

# GET  /reports/api/configuraciones/           - Lista configuraciones del usuario
# POST /reports/api/configuraciones/           - Crear configuración
# GET  /reports/api/configuraciones/{id}/      - Detalle configuración
# PUT  /reports/api/configuraciones/{id}/      - Actualizar configuración
# DELETE /reports/api/configuraciones/{id}/    - Eliminar configuración