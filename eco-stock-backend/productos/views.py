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

def actualizar_producto(request, idproducto):
    if request.method == 'PATCH':
        nuevos_datos = json.loads(request.body)
        search = Producto.objects.get(pk=idproducto)

        for campo, valor in nuevos_datos.items():
            if hasattr(search, campo):
                setattr(search, campo, valor)
        search.save()

        return JsonResponse({'mensaje': 'Producto actualizado correctamente'})

def leer_producto():
    pass

def eliminar_producto():
    pass