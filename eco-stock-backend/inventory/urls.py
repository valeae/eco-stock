from inventory import views
from django.urls import path


urlpatterns = [
    path('actualizar-inventario/', views.actualizar, name='actualizar_inventario')
]