# users/views.py - Vista corregida para usar modelo Usuario personalizado
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Rol, Usuario
from .serializers import RolSerializer, UsuarioSerializer, UsuarioCreateSerializer
import logging

logger = logging.getLogger(__name__)

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    
    def create(self, request):
        """Crear rol"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def list(self, request):
        """Listar roles"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Obtener rol por ID"""
        try:
            rol = self.get_object()
            serializer = self.get_serializer(rol)
            return Response(serializer.data)
        except Rol.DoesNotExist:
            return Response({'error': 'Rol no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, pk=None):
        """Actualizar rol"""
        try:
            rol = self.get_object()
            serializer = self.get_serializer(rol, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Rol.DoesNotExist:
            return Response({'error': 'Rol no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    def destroy(self, request, pk=None):
        """Eliminar rol"""
        try:
            rol = self.get_object()
            rol.delete()
            return Response({'mensaje': 'Rol eliminado correctamente'}, status=status.HTTP_204_NO_CONTENT)
        except Rol.DoesNotExist:
            return Response({'error': 'Rol no encontrado'}, status=status.HTTP_404_NOT_FOUND)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'register':
            return UsuarioCreateSerializer
        return UsuarioSerializer
    
    def create(self, request):
        """Crear usuario"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Hash de la contraseña antes de guardar
            serializer.validated_data['contraseña'] = make_password(serializer.validated_data['contraseña'])
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def list(self, request):
        """Listar usuarios"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Obtener usuario por ID"""
        try:
            usuario = self.get_object()
            serializer = self.get_serializer(usuario)
            return Response(serializer.data)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, pk=None):
        """Actualizar usuario"""
        try:
            usuario = self.get_object()
            serializer = self.get_serializer(usuario, data=request.data, partial=True)
            if serializer.is_valid():
                if 'contraseña' in serializer.validated_data:
                    serializer.validated_data['contraseña'] = make_password(serializer.validated_data['contraseña'])
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    def destroy(self, request, pk=None):
        """Eliminar usuario"""
        try:
            usuario = self.get_object()
            usuario.delete()
            return Response({'mensaje': 'Usuario eliminado correctamente'}, status=status.HTTP_204_NO_CONTENT)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'], url_path='register')
    def register(self, request):
        """Registro de usuario con JWT - CORREGIDO"""
        try:
            logger.info(f"Datos recibidos para registro: {request.data}")
            
            # Validar que se enviaron datos
            if not request.data:
                return Response({
                    'error': 'No se enviaron datos'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # ✅ CORREGIDO: Usar directamente los datos del request
            # Ya no necesitamos mapear porque el frontend ya envía los nombres correctos
            data = request.data.copy()
            
            # Agregar rol por defecto si no viene en los datos
            if 'idrol' not in data:
                data['idrol'] = 2  # Rol por defecto
                
            logger.info(f"Datos procesados: {data}")
            
            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                try:
                    # Verificar si el email ya existe
                    if Usuario.objects.filter(correo_electronico=serializer.validated_data['correo_electronico']).exists():
                        return Response({
                            'error': 'Ya existe un usuario con este correo electrónico'
                        }, status=status.HTTP_400_BAD_REQUEST)
                    
                    # Hash de la contraseña
                    serializer.validated_data['contraseña'] = make_password(
                        serializer.validated_data['contraseña']
                    )
                    
                    # Crear usuario
                    usuario = serializer.save()
                    logger.info(f"Usuario creado: {usuario}")
                    
                    # ✅ Crear token JWT personalizado
                    class MockUser:
                        def __init__(self, user_id):
                            self.id = user_id
                            self.pk = user_id
                    
                    mock_user = MockUser(usuario.id)
                    refresh = RefreshToken.for_user(mock_user)
                    
                    # Serializar datos del usuario para la respuesta
                    user_serializer = UsuarioSerializer(usuario)
                    
                    response_data = {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                        'user': user_serializer.data,
                        'message': 'Usuario registrado exitosamente'
                    }
                    
                    logger.info(f"Respuesta enviada: {response_data}")
                    
                    return Response(response_data, status=status.HTTP_201_CREATED)
                    
                except Exception as e:
                    logger.error(f"Error al crear usuario: {str(e)}")
                    return Response({
                        'error': f'Error al crear usuario: {str(e)}'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                logger.error(f"Errores de validación: {serializer.errors}")
                return Response({
                    'error': 'Datos de validación incorrectos',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Error inesperado en registro: {str(e)}")
            return Response({
                'error': f'Error inesperado: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def autenticar(self, request):
        """Autenticar usuario - CORREGIDO"""
        try:
            # Permitir tanto email como correo_electronico
            correo = request.data.get('correo_electronico') or request.data.get('email')
            contraseña = request.data.get('contraseña') or request.data.get('password')
            
            if not correo or not contraseña:
                return Response({
                    'error': 'Email y contraseña son requeridos'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            usuario = Usuario.objects.get(correo_electronico=correo)
            if check_password(contraseña, usuario.contraseña):
                # Usar el mismo método de token que en register
                class MockUser:
                    def __init__(self, user_id):
                        self.id = user_id
                        self.pk = user_id
                
                mock_user = MockUser(usuario.id)
                refresh = RefreshToken.for_user(mock_user)
                serializer = self.get_serializer(usuario)
                
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': serializer.data,
                    'message': 'Autenticación exitosa'
                })
            else:
                return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
                
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'Error en autenticación: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['patch'])
    def cambiar_contraseña(self, request, pk=None):
        """Cambiar contraseña de usuario"""
        try:
            usuario = self.get_object()
            nueva_contraseña = request.data.get('nueva_contraseña')
            
            if not nueva_contraseña:
                return Response({'error': 'Nueva contraseña requerida'}, status=status.HTTP_400_BAD_REQUEST)
            
            usuario.contraseña = make_password(nueva_contraseña)
            usuario.save()
            return Response({'mensaje': 'Contraseña actualizada correctamente'})
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def por_rol(self, request):
        """Obtener usuarios por rol"""
        rol_id = request.query_params.get('rol_id')
        if rol_id:
            usuarios = Usuario.objects.filter(idrol=rol_id)
            serializer = self.get_serializer(usuarios, many=True)
            return Response(serializer.data)
        return Response({'error': 'ID de rol requerido'}, status=status.HTTP_400_BAD_REQUEST)