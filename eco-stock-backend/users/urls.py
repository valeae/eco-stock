from django.urls import path
from users import views

urlpatterns = [
    # CRUD Usuarios
    path('api/usuarios/', views.listar_usuarios, name='api_listar_usuarios'),
    path('api/usuarios/crear/', views.crear_usuario, name='api_crear_usuario'),
    path('api/usuarios/<int:idusuario>/', views.obtener_usuario, name='api_obtener_usuario'),
    path('api/usuarios/<int:idusuario>/actualizar/', views.actualizar_usuario, name='api_actualizar_usuario'),
    path('api/usuarios/<int:idusuario>/eliminar/', views.eliminar_usuario, name='api_eliminar_usuario'),
    
    # Operaciones adicionales
    path('api/usuarios/eliminar-bulk/', views.eliminar_usuarios_bulk, name='api_eliminar_usuarios_bulk'),
    path('api/roles/', views.obtener_roles, name='api_obtener_roles'),
]