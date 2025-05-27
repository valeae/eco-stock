from django.urls import path
from suppliers import views

urlpatterns = [
    path('crear-proveedor/', views.crear_proveedor, name='crear_proveedor'),
    path('actualizar-proveedor/', views.actualizar_proveedor, name='actualizar_inventario'),
    path('leer-proveedor/', views.leer_proveedor, name='leer_inventario'),
    path('eliminar-proveedor/', views.eliminar_proveedor, name='eliminar_inventario'),
]