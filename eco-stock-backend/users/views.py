from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.core.paginator import Paginator
from .models import Usuario, Rol
import json

# Función auxiliar para serializar usuario
def serialize_usuario(usuario):
    return {
        'idusuario': usuario.idusuario,
        'nombre': usuario.nombre,
        'correo_electronico': usuario.correo_electronico,
        'idrol': usuario.idrol.idrol,
        'rol_nombre': usuario.idrol.nombre
    }

# Función auxiliar para validar datos de usuario
def validar_datos_usuario(data, es_actualizacion=False):
    errores = []
    
    if not es_actualizacion or 'nombre' in data:
        if not data.get('nombre', '').strip():
            errores.append('El nombre es obligatorio')
    
    if not es_actualizacion or 'contraseña' in data:
        if not es_actualizacion and not data.get('contraseña', '').strip():
            errores.append('La contraseña es obligatoria')
    
    if not es_actualizacion or 'idrol' in data:
        idrol = data.get('idrol')
        if not es_actualizacion and not idrol:
            errores.append('El rol es obligatorio')
        elif idrol and not Rol.objects.filter(idrol=idrol).exists():
            errores.append('El rol especificado no existe')
    
    if 'correo_electronico' in data:
        correo = data.get('correo_electronico')
        if correo and '@' not in correo:
            errores.append('El formato del correo electrónico es inválido')
    
    return errores

# CREATE - Crear usuario
@csrf_exempt
@require_http_methods(["POST"])
def crear_usuario(request):
    try:
        data = json.loads(request.body)
        
        # Validar datos
        errores = validar_datos_usuario(data)
        if errores:
            return JsonResponse({
                'success': False,
                'errors': errores
            }, status=400)
        
        # Verificar si ya existe un usuario con el mismo ID (si se proporciona)
        if 'idusuario' in data:
            if Usuario.objects.filter(idusuario=data['idusuario']).exists():
                return JsonResponse({
                    'success': False,
                    'errors': ['Ya existe un usuario con este ID']
                }, status=400)
        
        # Crear usuario
        rol = get_object_or_404(Rol, idrol=data['idrol'])
        
        usuario_data = {
            'nombre': data['nombre'].strip(),
            'contraseña': data['contraseña'],  # En producción: make_password(data['contraseña'])
            'idrol': rol
        }
        
        if 'idusuario' in data:
            usuario_data['idusuario'] = data['idusuario']
        
        if data.get('correo_electronico'):
            usuario_data['correo_electronico'] = data['correo_electronico'].strip()
        
        usuario = Usuario.objects.create(**usuario_data)
        
        return JsonResponse({
            'success': True,
            'message': 'Usuario creado exitosamente',
            'data': serialize_usuario(usuario)
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'errors': ['JSON inválido']
        }, status=400)
    except IntegrityError:
        return JsonResponse({
            'success': False,
            'errors': ['Error de integridad en la base de datos']
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'errors': [f'Error interno del servidor: {str(e)}']
        }, status=500)

# READ - Listar usuarios con paginación y filtros
@require_http_methods(["GET"])
def listar_usuarios(request):
    try:
        # Parámetros de consulta
        page = int(request.GET.get('page', 1))
        per_page = min(int(request.GET.get('per_page', 10)), 100)  # Máximo 100 por página
        search = request.GET.get('search', '').strip()
        rol_filter = request.GET.get('rol')
        
        # Construir queryset
        queryset = Usuario.objects.select_related('idrol')
        
        # Aplicar filtros
        if search:
            queryset = queryset.filter(nombre__icontains=search)
        
        if rol_filter:
            queryset = queryset.filter(idrol=rol_filter)
        
        # Paginación
        paginator = Paginator(queryset, per_page)
        usuarios_page = paginator.get_page(page)
        
        # Serializar datos
        usuarios_data = [serialize_usuario(usuario) for usuario in usuarios_page]
        
        return JsonResponse({
            'success': True,
            'data': usuarios_data,
            'pagination': {
                'current_page': page,
                'per_page': per_page,
                'total_pages': paginator.num_pages,
                'total_count': paginator.count,
                'has_next': usuarios_page.has_next(),
                'has_previous': usuarios_page.has_previous()
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'errors': [f'Error al obtener usuarios: {str(e)}']
        }, status=500)

# READ - Obtener usuario específico
@require_http_methods(["GET"])
def obtener_usuario(request, idusuario):
    try:
        usuario = get_object_or_404(Usuario.objects.select_related('idrol'), idusuario=idusuario)
        
        return JsonResponse({
            'success': True,
            'data': serialize_usuario(usuario)
        })
        
    except Usuario.DoesNotExist:
        return JsonResponse({
            'success': False,
            'errors': ['Usuario no encontrado']
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'errors': [f'Error al obtener usuario: {str(e)}']
        }, status=500)

# UPDATE - Actualizar usuario
@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
def actualizar_usuario(request, idusuario):
    try:
        usuario = get_object_or_404(Usuario, idusuario=idusuario)
        data = json.loads(request.body)
        
        # Validar datos
        errores = validar_datos_usuario(data, es_actualizacion=True)
        if errores:
            return JsonResponse({
                'success': False,
                'errors': errores
            }, status=400)
        
        # Actualizar campos
        if 'nombre' in data:
            usuario.nombre = data['nombre'].strip()
        
        if 'correo_electronico' in data:
            usuario.correo_electronico = data['correo_electronico'].strip() if data['correo_electronico'] else None
        
        if 'contraseña' in data and data['contraseña']:
            usuario.contraseña = data['contraseña']  # En producción: make_password(data['contraseña'])
        
        if 'idrol' in data:
            rol = get_object_or_404(Rol, idrol=data['idrol'])
            usuario.idrol = rol
        
        # Validar y guardar
        usuario.full_clean()
        usuario.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Usuario actualizado exitosamente',
            'data': serialize_usuario(usuario)
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'errors': ['JSON inválido']
        }, status=400)
    except ValidationError as e:
        return JsonResponse({
            'success': False,
            'errors': [str(e)]
        }, status=400)
    except Usuario.DoesNotExist:
        return JsonResponse({
            'success': False,
            'errors': ['Usuario no encontrado']
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'errors': [f'Error al actualizar usuario: {str(e)}']
        }, status=500)

# DELETE - Eliminar usuario
@csrf_exempt
@require_http_methods(["DELETE"])
def eliminar_usuario(request, idusuario):
    try:
        usuario = get_object_or_404(Usuario, idusuario=idusuario)
        nombre_usuario = usuario.nombre
        usuario.delete()
        
        return JsonResponse({
            'success': True,
            'message': f'Usuario {nombre_usuario} eliminado exitosamente'
        })
        
    except Usuario.DoesNotExist:
        return JsonResponse({
            'success': False,
            'errors': ['Usuario no encontrado']
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'errors': [f'Error al eliminar usuario: {str(e)}']
        }, status=500)

# BULK OPERATIONS - Operaciones en lote
@csrf_exempt
@require_http_methods(["POST"])
def eliminar_usuarios_bulk(request):
    try:
        data = json.loads(request.body)
        ids_usuarios = data.get('ids', [])
        
        if not ids_usuarios:
            return JsonResponse({
                'success': False,
                'errors': ['No se proporcionaron IDs de usuarios']
            }, status=400)
        
        usuarios_eliminados = Usuario.objects.filter(idusuario__in=ids_usuarios)
        count = usuarios_eliminados.count()
        usuarios_eliminados.delete()
        
        return JsonResponse({
            'success': True,
            'message': f'{count} usuarios eliminados exitosamente'
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'errors': [f'Error al eliminar usuarios: {str(e)}']
        }, status=500)

# UTILITY - Obtener roles disponibles
@require_http_methods(["GET"])
def obtener_roles(request):
    try:
        roles = Rol.objects.all()
        roles_data = [{'idrol': rol.idrol, 'nombre': rol.nombre} for rol in roles]
        
        return JsonResponse({
            'success': True,
            'data': roles_data
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'errors': [f'Error al obtener roles: {str(e)}']
        }, status=500)