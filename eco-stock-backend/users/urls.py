from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, RolViewSet

# Crear el router
router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuarios')
router.register(r'roles', RolViewSet, basename='roles')

# URLs del router + URLs adicionales si es necesario
urlpatterns = [
    path('', include(router.urls)),
]