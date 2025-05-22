from productos import views
from django.urls import path


urlpatterns = [
    path('crear-producto/', views.crear_producto, name='crear_producto'),
    path('actualizar-producto/', views.actualizar_producto, name='actualizar_inventario'),
    path('leer-producto/', views.leer_producto, name='leer_inventario'),
    path('eliminar-producto/', views.eliminar_producto, name='eliminar_inventario'),
]