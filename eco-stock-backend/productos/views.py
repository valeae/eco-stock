import json
from django.http import JsonResponse
from django.shortcuts import render
from .models import Producto

# Create your views here.
def crear_producto(request):
    if request.method == 'POST':
        datos = json.loads(request.body)
        idproducto = datos.get('id')
        nombre = datos.get('nombre')
        descripcion = datos.get('nombre')
        lote = datos.get('lote')
        idcategoria = datos.get('categoria')
        id = datos.get('unidad de medida')

        Producto.objects.create(**datos)
        return JsonResponse({'mensaje':'Producto creado correctamente'})
    else:
        return JsonResponse({'mensaje':'Metodo no permitido'})

def actualizar_producto():
    pass

def leer_producto():
    pass

def eliminar_producto():
    pass