import json
from django.http import JsonResponse
from django.shortcuts import render
from .models import Producto, Categoria, UnidadesMedida

# Create your views here.
def crear_producto(request):
    if request.method == 'POST':
        try:
            datos = json.loads(request.body)
            
            # Extraer los datos correctamente
            idproducto = datos.get('idproducto')
            nombre = datos.get('nombre')
            descripcion = datos.get('descripcion')
            lote = datos.get('lote')
            stock = datos.get('stock', 0)  # Default 0 si no se proporciona
            idcategoria = datos.get('idcategoria')
            unidad_medida_id = datos.get('unidad_medida_id')
            
            # Validar que existan la categoría y unidad de medida
            try:
                categoria = Categoria.objects.get(idcategoria=idcategoria)
                unidad_medida = UnidadesMedida.objects.get(id=unidad_medida_id)
            except Categoria.DoesNotExist:
                return JsonResponse({'mensaje': 'Categoría no encontrada'}, status=400)
            except UnidadesMedida.DoesNotExist:
                return JsonResponse({'mensaje': 'Unidad de medida no encontrada'}, status=400)
            
            # Crear el producto
            producto = Producto.objects.create(
                idproducto=idproducto,
                nombre=nombre,
                descripcion=descripcion,
                lote=lote,
                stock=stock,
                idcategoria=categoria,
                unidad_medida_id=unidad_medida
            )
            
            return JsonResponse({
                'mensaje': 'Producto creado correctamente',
                'producto_id': producto.idproducto
            }, status=201)
            
        except json.JSONDecodeError:
            return JsonResponse({'mensaje': 'Error en el formato JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'mensaje': f'Error al crear el producto: {str(e)}'}, status=500)
    else:
        return JsonResponse({'mensaje': 'Método no permitido'}, status=405)


def leer_producto(request, idproducto=None):
    if request.method == 'GET':
        try:
            if idproducto:
                # Obtener un producto específico
                producto = Producto.objects.select_related('idcategoria', 'unidad_medida_id').get(idproducto=idproducto)
                datos_producto = {
                    'idproducto': producto.idproducto,
                    'nombre': producto.nombre,
                    'descripcion': producto.descripcion,
                    'lote': producto.lote,
                    'stock': producto.stock,
                    'categoria': {
                        'id': producto.idcategoria.idcategoria,
                        'nombre': producto.idcategoria.nombre,
                        'descripcion': producto.idcategoria.descripcion,
                        'tipo': producto.idcategoria.tipo,
                        'vida_util': producto.idcategoria.vida_util,
                        'presentacion': producto.idcategoria.presentacion
                    },
                    'unidad_medida': {
                        'id': producto.unidad_medida_id.id,
                        'nombre': producto.unidad_medida_id.nombre,
                        'abreviatura': producto.unidad_medida_id.abreviatura
                    }
                }
                return JsonResponse({'producto': datos_producto})
            else:
                # Obtener todos los productos
                productos = Producto.objects.select_related('idcategoria', 'unidad_medida_id').all()
                lista_productos = []
                for producto in productos:
                    datos_producto = {
                        'idproducto': producto.idproducto,
                        'nombre': producto.nombre,
                        'descripcion': producto.descripcion,
                        'lote': producto.lote,
                        'stock': producto.stock,
                        'categoria': {
                            'id': producto.idcategoria.idcategoria,
                            'nombre': producto.idcategoria.nombre,
                            'descripcion': producto.idcategoria.descripcion,
                            'tipo': producto.idcategoria.tipo,
                            'vida_util': producto.idcategoria.vida_util,
                            'presentacion': producto.idcategoria.presentacion
                        },
                        'unidad_medida': {
                            'id': producto.unidad_medida_id.id,
                            'nombre': producto.unidad_medida_id.nombre,
                            'abreviatura': producto.unidad_medida_id.abreviatura
                        }
                    }
                    lista_productos.append(datos_producto)
                return JsonResponse({'productos': lista_productos})
                
        except Producto.DoesNotExist:
            return JsonResponse({'mensaje': 'Producto no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'mensaje': f'Error al obtener el producto: {str(e)}'}, status=500)
    else:
        return JsonResponse({'mensaje': 'Método no permitido'}, status=405)


def actualizar_producto(request, idproducto):
    if request.method == 'PATCH':
        try:
            datos_actualizados = json.loads(request.body)
            producto = Producto.objects.get(idproducto=idproducto)
            
            # Campos que se pueden actualizar directamente
            campos_directos = ['nombre', 'descripcion', 'lote', 'stock']
            
            for campo in campos_directos:
                if campo in datos_actualizados:
                    setattr(producto, campo, datos_actualizados[campo])
            
            # Manejar relaciones especiales
            if 'idcategoria' in datos_actualizados:
                try:
                    categoria = Categoria.objects.get(idcategoria=datos_actualizados['idcategoria'])
                    producto.idcategoria = categoria
                except Categoria.DoesNotExist:
                    return JsonResponse({'mensaje': 'Categoría no encontrada'}, status=400)
            
            if 'unidad_medida_id' in datos_actualizados:
                try:
                    unidad_medida = UnidadesMedida.objects.get(id=datos_actualizados['unidad_medida_id'])
                    producto.unidad_medida_id = unidad_medida
                except UnidadesMedida.DoesNotExist:
                    return JsonResponse({'mensaje': 'Unidad de medida no encontrada'}, status=400)
            
            producto.save()
            
            return JsonResponse({'mensaje': 'Producto actualizado correctamente'})
            
        except Producto.DoesNotExist:
            return JsonResponse({'mensaje': 'Producto no encontrado'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'mensaje': 'Error en el formato JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'mensaje': f'Error al actualizar el producto: {str(e)}'}, status=500)
    else:
        return JsonResponse({'mensaje': 'Método no permitido'}, status=405)


def eliminar_producto(request, idproducto):
    if request.method == 'DELETE':
        try:
            producto = Producto.objects.get(idproducto=idproducto)
            producto.delete()
            return JsonResponse({'mensaje': 'Producto eliminado correctamente'})
        except Producto.DoesNotExist:
            return JsonResponse({'mensaje': 'Producto no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'mensaje': f'Error al eliminar el producto: {str(e)}'}, status=500)
    else:
        return JsonResponse({'mensaje': 'Método no permitido'}, status=405)