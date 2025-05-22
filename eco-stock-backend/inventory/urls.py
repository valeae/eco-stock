from inventory import views
from django.urls import path


urlpatterns = [
    path('crear-inventario/', views.crear_inventario, name='crear_inventario'),
    path('actualizar-inventario/', views.actualizar_inventario, name='actualizar_inventario'),
]