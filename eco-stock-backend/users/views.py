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
            
            if not request.data:
                return Response({
                    'error': 'No se enviaron datos'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            data = request.data.copy()
            
            # ✅ CORREGIR: Convertir idrol de entero a instancia de Rol
            if 'idrol' in data:
                try:
                    rol_id = data['idrol']
                    rol_instance = Rol.objects.get(idrol=rol_id)
                    data['idrol'] = rol_instance
                except Rol.DoesNotExist:
                    return Response({
                        'error': f'No existe el rol con ID {rol_id}'
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                # Rol por defecto
                try:
                    rol_instance = Rol.objects.get(idrol=2)
                    data['idrol'] = rol_instance
                except Rol.DoesNotExist:
                    return Response({
                        'error': 'No existe el rol por defecto'
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
            logger.info(f"Datos procesados: {data}")
            
            # ✅ CORREGIR: Verificar email solo si no es null/vacío
            email = data.get('correo_electronico')
            if email and Usuario.objects.filter(correo_electronico=email).exists():
                return Response({
                    'error': 'Ya existe un usuario con este correo electrónico'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # ✅ CORREGIR: Hash de contraseña antes de usar el serializer
            if 'contraseña' in data:
                data['contraseña'] = make_password(data['contraseña'])
            
            # ✅ CORREGIR: Crear usuario directamente (sin serializer para evitar problemas)
            try:
                usuario = Usuario.objects.create(
                    nombre=data['nombre'],
                    correo_electronico=data.get('correo_electronico'),
                    contraseña=data['contraseña'],
                    idrol=data['idrol']
                )
                logger.info(f"Usuario creado: {usuario}")
                
                # ✅ CORREGIR: Generar JWT correctamente
                refresh = RefreshToken()
                refresh['user_id'] = usuario.idusuario  # ✅ Usar idusuario, no id
                
                # Serializar datos del usuario para la respuesta
                user_data = {
                    'idusuario': usuario.idusuario,
                    'nombre': usuario.nombre,
                    'correo_electronico': usuario.correo_electronico,
                    'idrol': usuario.idrol.idrol,
                    'rol_nombre': usuario.idrol.nombre
                }
                
                response_data = {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': user_data,
                    'message': 'Usuario registrado exitosamente'
                }
                
                logger.info(f"Respuesta enviada: {response_data}")
                
                return Response(response_data, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                logger.error(f"Error al crear usuario: {str(e)}")
                return Response({
                    'error': f'Error al crear usuario: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Exception as e:
            logger.error(f"Error inesperado en registro: {str(e)}")
            import traceback
            logger.error(f"Traceback completo: {traceback.format_exc()}")
            return Response({
                'error': f'Error inesperado: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'], url_path='autenticar')
    def autenticar(self, request):
        """Autenticar usuario - CORREGIDO"""
        try:
            logger.info(f"Datos recibidos para autenticación: {request.data}")
            
            # Permitir tanto email como correo_electronico
            correo = request.data.get('correo_electronico') or request.data.get('email')
            contraseña = request.data.get('contraseña') or request.data.get('password')
            
            if not correo or not contraseña:
                return Response({
                    'error': 'Email y contraseña son requeridos'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                usuario = Usuario.objects.get(correo_electronico=correo)
                logger.info(f"Usuario encontrado: {usuario.nombre}")
            except Usuario.DoesNotExist:
                return Response({
                    'error': 'Credenciales inválidas'  # No revelar si el usuario existe o no
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Verificar contraseña
            if check_password(contraseña, usuario.contraseña):
                logger.info("Contraseña correcta, generando tokens...")
                
                # ✅ CORREGIR: Generar JWT correctamente
                refresh = RefreshToken()
                refresh['user_id'] = usuario.idusuario  # Usar idusuario como clave
                
                # Datos del usuario para la respuesta
                user_data = {
                    'idusuario': usuario.idusuario,
                    'nombre': usuario.nombre,
                    'correo_electronico': usuario.correo_electronico,
                    'idrol': usuario.idrol.idrol,
                    'rol_nombre': usuario.idrol.nombre
                }
                
                response_data = {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': user_data,
                    'message': 'Autenticación exitosa'
                }
                
                logger.info("Autenticación exitosa")
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                logger.warning("Contraseña incorrecta")
                return Response({
                    'error': 'Credenciales inválidas'
                }, status=status.HTTP_401_UNAUTHORIZED)
                
        except Exception as e:
            logger.error(f"Error inesperado en autenticación: {str(e)}")
            import traceback
            logger.error(f"Traceback completo: {traceback.format_exc()}")
            return Response({
                'error': 'Error interno del servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
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