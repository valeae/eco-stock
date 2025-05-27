import json
from django.http import JsonResponse
from django.shortcuts import render
from .models import Producto

# Create your views here.
def crear_producto(request):
    if request.method == 'POST':
        try:
            datos = json.loads(request.body)
            idproducto = datos.get('id')
            nombre = datos.get('nombre')
            descripcion = datos.get('descripcion')
            lote = datos.get('lote')
            idcategoria = datos.get('categoria')
            id = datos.get('unidad de medida')

            Producto.objects.create(**datos)
            return JsonResponse({'mensaje': 'Producto creado correctamente'}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'mensaje': 'Error en el formato JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'mensaje': 'Error al crear el producto'}, status=500)
    else:
        return JsonResponse({'mensaje': 'Metodo no permitido'}, status=405)

def leer_producto(request, idproducto=None):
    if request.method == 'GET':
        try:
            if idproducto:
                # Obtener un producto específico
                producto = Producto.objects.get(pk=idproducto)
                datos_producto = {
                    'id': producto.id,
                    'nombre': producto.nombre,
                    'descripcion': producto.descripcion,
                    'lote': producto.lote,
                    'categoria': producto.idcategoria,
                    'unidad_de_medida': producto.id  # Nota: revisa este campo en tu modelo
                }
                return JsonResponse({'producto': datos_producto})
            else:
                # Obtener todos los productos
                productos = Producto.objects.all()
                lista_productos = []
                for producto in productos:
                    datos_producto = {
                        'id': producto.id,
                        'nombre': producto.nombre,
                        'descripcion': producto.descripcion,
                        'lote': producto.lote,
                        'categoria': producto.idcategoria,
                        'unidad_de_medida': producto.id  # Nota: revisa este campo en tu modelo
                    }
                    lista_productos.append(datos_producto)
                return JsonResponse({'productos': lista_productos})
        except Producto.DoesNotExist:
            return JsonResponse({'mensaje': 'Producto no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'mensaje': 'Error al obtener el producto'}, status=500)
    else:
        return JsonResponse({'mensaje': 'Método no permitido'}, status=405)

def actualizar_producto(request, idproducto):
    if request.method == 'PATCH':
        try:
            datos_actualizados = json.loads(request.body)
            search = Producto.objects.get(pk=idproducto)

            for campo, valor in datos_actualizados.items():
                if hasattr(search, campo):
                    setattr(search, campo, valor)
            search.save()

            return JsonResponse({'mensaje': 'Producto actualizado correctamente'})
        except Producto.DoesNotExist:
            return JsonResponse({'mensaje': 'Producto no encontrado'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'mensaje': 'Error en el formato JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'mensaje': 'Error al actualizar el producto'}, status=500)
    else:
        return JsonResponse({'mensaje': 'Método no permitido'}, status=405)

def eliminar_producto(request, idproducto):
    if request.method == 'DELETE':
        try:
            producto = Producto.objects.get(pk=idproducto)
            producto.delete()
            return JsonResponse({'mensaje': 'Producto eliminado correctamente'})
        except Producto.DoesNotExist:
            return JsonResponse({'mensaje': 'Producto no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'mensaje': 'Error al eliminar el producto'}, status=500)
    else:
        return JsonResponse({'mensaje': 'Método no permitido'}, status=405)