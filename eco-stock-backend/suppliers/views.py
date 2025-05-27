import json
from django.http import JsonResponse
from .models import Proveedor

#create your views here

def crear_proveedor(request):
    if request.method == 'POST':
        try:
            datos = json.loads(request.body)
            idproveedor = datos.get('idproveedor')
            tipo = datos.get('tipo')
            nombre = datos.get('nombre')
            direccion = datos.get('direccion')
            estado = datos.get('estado', True)
            correo = datos.get('correo')
            telefono = datos.get('telefono')

            Proveedor.objects.create(**datos)
            return JsonResponse({'mensaje': 'Proveedor creado correctamente'}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'mensaje': 'Error en el formato JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'mensaje': 'Error al crear el proveedor'}, status=500)
    else:
        return JsonResponse({'mensaje': 'Metodo no permitido'}, status=405)

def leer_proveedor(request, idproveedor=None):
    if request.method == 'GET':
        try:
            if idproveedor:
                # Obtener un proveedor específico
                proveedor = Proveedor.objects.get(pk=idproveedor)
                datos_proveedor = {
                    'idproveedor': proveedor.idproveedor,
                    'tipo': proveedor.tipo,
                    'nombre': proveedor.nombre,
                    'direccion': proveedor.direccion,
                    'estado': proveedor.estado,
                    'correo': proveedor.correo,
                    'telefono': proveedor.telefono
                }
                return JsonResponse({'proveedor': datos_proveedor})
            else:
                # Obtener todos los proveedores
                proveedores = Proveedor.objects.all()
                lista_proveedores = []
                for proveedor in proveedores:
                    datos_proveedor = {
                        'idproveedor': proveedor.idproveedor,
                        'tipo': proveedor.tipo,
                        'nombre': proveedor.nombre,
                        'direccion': proveedor.direccion,
                        'estado': proveedor.estado,
                        'correo': proveedor.correo,
                        'telefono': proveedor.telefono
                    }
                    lista_proveedores.append(datos_proveedor)
                return JsonResponse({'proveedores': lista_proveedores})
        except Proveedor.DoesNotExist:
            return JsonResponse({'mensaje': 'Proveedor no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'mensaje': 'Error al obtener el proveedor'}, status=500)
    else:
        return JsonResponse({'mensaje': 'Método no permitido'}, status=405)

def actualizar_proveedor(request, idproveedor):
    if request.method == 'PATCH':
        try:
            datos_actualizados = json.loads(request.body)
            search = Proveedor.objects.get(pk=idproveedor)

            for campo, valor in datos_actualizados.items():
                if hasattr(search, campo):
                    setattr(search, campo, valor)
            search.save()

            return JsonResponse({'mensaje': 'Proveedor actualizado correctamente'})
        except Proveedor.DoesNotExist:
            return JsonResponse({'mensaje': 'Proveedor no encontrado'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'mensaje': 'Error en el formato JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'mensaje': 'Error al actualizar el proveedor'}, status=500)
    else:
        return JsonResponse({'mensaje': 'Método no permitido'}, status=405)

def eliminar_proveedor(request, idproveedor):
    if request.method == 'DELETE':
        try:
            proveedor = Proveedor.objects.get(pk=idproveedor)
            proveedor.delete()
            return JsonResponse({'mensaje': 'Proveedor eliminado correctamente'})
        except Proveedor.DoesNotExist:
            return JsonResponse({'mensaje': 'Proveedor no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'mensaje': 'Error al eliminar el proveedor'}, status=500)
    else:
        return JsonResponse({'mensaje': 'Método no permitido'}, status=405)
