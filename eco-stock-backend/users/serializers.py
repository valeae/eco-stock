from rest_framework import serializers
from .models import Rol, Usuario

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    rol_nombre = serializers.CharField(source='idrol.nombre', read_only=True)
    
    class Meta:
        model = Usuario
        fields = ['idusuario', 'nombre', 'correo_electronico', 'idrol', 'rol_nombre']
        extra_kwargs = {'contraseña': {'write_only': True}}

class UsuarioCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'
        extra_kwargs = {'contraseña': {'write_only': True}}