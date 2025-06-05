from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Inventario, MovimientoInventario, DetalleEntradaSalida, ProductosVencimiento
from .serializers import InventarioSerializer, MovimientoInventarioSerializer, DetalleEntradaSalidaSerializer, ProductosVencimientoSerializer

class InventarioViewSet(viewsets.ModelViewSet):
    queryset = Inventario.objects.all()
    serializer_class = InventarioSerializer
    
    def create(self, request):
        """Crear inventario"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def por_producto(self, request):
        """Obtener inventario por producto"""
        producto_id = request.query_params.get('producto_id')
        if producto_id:
            try:
                inventario = Inventario.objects.get(producto_id=producto_id)
                serializer = self.get_serializer(inventario)
                return Response(serializer.data)
            except Inventario.DoesNotExist:
                return Response({'error': 'Inventario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'ID de producto requerido'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'])
    def actualizar_cantidad(self, request, pk=None):
        """Actualizar cantidad en inventario"""
        try:
            inventario = self.get_object()
            nueva_cantidad = request.data.get('cantidad')
            
            if nueva_cantidad is not None:
                inventario.cantidad = nueva_cantidad
                inventario.fecha_actualizacion = timezone.now()
                inventario.save()
                
                serializer = self.get_serializer(inventario)
                return Response(serializer.data)
            return Response({'error': 'Cantidad requerida'}, status=status.HTTP_400_BAD_REQUEST)
        except Inventario.DoesNotExist:
            return Response({'error': 'Inventario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def stock_actual(self, request):
        """Obtener stock actual de un producto"""
        producto_id = request.query_params.get('producto_id')
        if producto_id:
            try:
                inventario = Inventario.objects.get(producto_id=producto_id)
                return Response({'producto_id': producto_id, 'stock_actual': inventario.cantidad})
            except Inventario.DoesNotExist:
                return Response({'producto_id': producto_id, 'stock_actual': 0})
        return Response({'error': 'ID de producto requerido'}, status=status.HTTP_400_BAD_REQUEST)
    
    def list(self, request):
        """Listar inventario completo"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def bajo_stock(self, request):
        """Obtener productos con bajo stock"""
        limite = request.query_params.get('limite', 10)
        try:
            limite = int(limite)
            inventarios = Inventario.objects.filter(cantidad__lte=limite)
            serializer = self.get_serializer(inventarios, many=True)
            return Response(serializer.data)
        except ValueError:
            return Response({'error': 'Límite debe ser un número'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def sin_stock(self, request):
        """Obtener productos sin stock"""
        inventarios = Inventario.objects.filter(cantidad=0)
        serializer = self.get_serializer(inventarios, many=True)
        return Response(serializer.data)

class MovimientoInventarioViewSet(viewsets.ModelViewSet):
    queryset = MovimientoInventario.objects.all()
    serializer_class = MovimientoInventarioSerializer
    
    @action(detail=False, methods=['post'])
    def registrar_entrada(self, request):
        """Registrar entrada de inventario"""
        producto_id = request.data.get('producto_id')
        cantidad = request.data.get('cantidad')
        usuario_id = request.data.get('usuario_id')
        
        if not all([producto_id, cantidad, usuario_id]):
            return Response({'error': 'Producto, cantidad y usuario son requeridos'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Obtener o crear inventario
            inventario, created = Inventario.objects.get_or_create(
                producto_id=producto_id,
                defaults={'cantidad': 0}
            )
            
            # Crear movimiento
            movimiento = MovimientoInventario.objects.create(
                tipo_movimiento='ENTRADA',
                idusuario_id=usuario_id,
                inventario_id=inventario
            )
            
            # Actualizar cantidad en inventario
            inventario.cantidad += int(cantidad)
            inventario.fecha_actualizacion = timezone.now()
            inventario.save()
            
            # Crear detalle
            DetalleEntradaSalida.objects.create(
                cantidad=cantidad,
                identradainventario=movimiento
            )
            
            serializer = self.get_serializer(movimiento)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def registrar_salida(self, request):
        """Registrar salida de inventario"""
        producto_id = request.data.get('producto_id')
        cantidad = request.data.get('cantidad')
        usuario_id = request.data.get('usuario_id')
        
        if not all([producto_id, cantidad, usuario_id]):
            return Response({'error': 'Producto, cantidad y usuario son requeridos'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Verificar inventario disponible
            inventario = Inventario.objects.get(producto_id=producto_id)
            
            if inventario.cantidad < int(cantidad):
                return Response({'error': 'Stock insuficiente'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Crear movimiento
            movimiento = MovimientoInventario.objects.create(
                tipo_movimiento='SALIDA',
                idusuario_id=usuario_id,
                inventario_id=inventario
            )
            
            # Actualizar cantidad en inventario
            inventario.cantidad -= int(cantidad)
            inventario.fecha_actualizacion = timezone.now()
            inventario.save()
            
            # Crear detalle
            DetalleEntradaSalida.objects.create(
                cantidad=cantidad,
                identradainventario=movimiento
            )
            
            serializer = self.get_serializer(movimiento)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Inventario.DoesNotExist:
            return Response({'error': 'Producto no encontrado en inventario'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def por_producto(self, request):
        """Obtener movimientos de un producto"""
        producto_id = request.query_params.get('producto_id')
        if producto_id:
            try:
                inventario = Inventario.objects.get(producto_id=producto_id)
                movimientos = MovimientoInventario.objects.filter(inventario_id=inventario)
                serializer = self.get_serializer(movimientos, many=True)
                return Response(serializer.data)
            except Inventario.DoesNotExist:
                return Response({'error': 'Producto no encontrado en inventario'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'ID de producto requerido'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def por_fecha(self, request):
        """Obtener movimientos por rango de fechas"""
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')
        
        if fecha_inicio and fecha_fin:
            try:
                fecha_inicio = datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
                fecha_fin = datetime.strptime(fecha_fin, '%Y-%m-%d').date()
                
                movimientos = MovimientoInventario.objects.filter(
                    fecha__range=[fecha_inicio, fecha_fin]
                )
                serializer = self.get_serializer(movimientos, many=True)
                return Response(serializer.data)
            except ValueError:
                return Response({'error': 'Formato de fecha inválido (YYYY-MM-DD)'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Fechas de inicio y fin requeridas'}, status=status.HTTP_400_BAD_REQUEST)
    
    def list(self, request):
        """Obtener historial de movimientos"""
        queryset = self.get_queryset().order_by('-fecha')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def por_usuario(self, request):
        """Obtener movimientos por usuario"""
        usuario_id = request.query_params.get('usuario_id')
        if usuario_id:
            movimientos = MovimientoInventario.objects.filter(idusuario_id=usuario_id)
            serializer = self.get_serializer(movimientos, many=True)
            return Response(serializer.data)
        return Response({'error': 'ID de usuario requerido'}, status=status.HTTP_400_BAD_REQUEST)

class DetalleEntradaSalidaViewSet(viewsets.ModelViewSet):
    queryset = DetalleEntradaSalida.objects.all()
    serializer_class = DetalleEntradaSalidaSerializer
    
    def create(self, request):
        """Crear detalle"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def por_movimiento(self, request):
        """Obtener detalles por movimiento"""
        movimiento_id = request.query_params.get('movimiento_id')
        if movimiento_id:
            detalles = DetalleEntradaSalida.objects.filter(identradainventario_id=movimiento_id)
            serializer = self.get_serializer(detalles, many=True)
            return Response(serializer.data)
        return Response({'error': 'ID de movimiento requerido'}, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, pk=None):
        """Actualizar detalle"""
        try:
            detalle = self.get_object()
            serializer = self.get_serializer(detalle, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except DetalleEntradaSalida.DoesNotExist:
            return Response({'error': 'Detalle no encontrado'}, status=status.HTTP_404_NOT_FOUND)

class ProductosVencimientoViewSet(viewsets.ModelViewSet):
    queryset = ProductosVencimiento.objects.all()
    serializer_class = ProductosVencimientoSerializer
    
    def create(self, request):
        """Registrar vencimiento de producto"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def por_vencer(self, request):
        """Obtener productos por vencer"""
        dias_adelante = request.query_params.get('dias', 30)
        try:
            dias_adelante = int(dias_adelante)
            fecha_limite = timezone.now().date() + timedelta(days=dias_adelante)
            
            productos = ProductosVencimiento.objects.filter(
                fecha_vencimiento__lte=fecha_limite,
                fecha_vencimiento__gte=timezone.now().date()
            ).order_by('fecha_vencimiento')
            
            serializer = self.get_serializer(productos, many=True)
            return Response(serializer.data)
        except ValueError:
            return Response({'error': 'Días debe ser un número'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def vencidos(self, request):
        """Obtener productos vencidos"""
        productos = ProductosVencimiento.objects.filter(
            fecha_vencimiento__lt=timezone.now().date()
        ).order_by('fecha_vencimiento')
        
        serializer = self.get_serializer(productos, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def marcar_notificado(self, request, pk=None):
        """Marcar producto como notificado"""
        try:
            producto = self.get_object()
            producto.notificado = True
            producto.save()
            
            serializer = self.get_serializer(producto)
            return Response(serializer.data)
        except ProductosVencimiento.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def no_notificados(self, request):
        """Obtener productos no notificados"""
        productos = ProductosVencimiento.objects.filter(notificado=False)
        serializer = self.get_serializer(productos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def por_producto(self, request):
        """Listar vencimientos por producto"""
        producto_id = request.query_params.get('producto_id')
        if producto_id:
            vencimientos = ProductosVencimiento.objects.filter(producto_id=producto_id)
            serializer = self.get_serializer(vencimientos, many=True)
            return Response(serializer.data)
        return Response({'error': 'ID de producto requerido'}, status=status.HTTP_400_BAD_REQUEST)

# Vistas para reportes y estadísticas
from rest_framework.views import APIView

class ReportesView(APIView):
    
    def get(self, request, tipo_reporte):
        """Generar diferentes tipos de reportes"""
        
        if tipo_reporte == 'stock-actual':
            inventarios = Inventario.objects.select_related('producto').all()
            data = []
            for inv in inventarios:
                data.append({
                    'producto_id': inv.producto.idproducto,
                    'producto_nombre': inv.producto.nombre,
                    'stock_actual': inv.cantidad,
                    'fecha_actualizacion': inv.fecha_actualizacion
                })
            return Response({'reporte': 'Stock Actual', 'data': data})
        
        elif tipo_reporte == 'movimientos-periodo':
            fecha_inicio = request.query_params.get('fecha_inicio')
            fecha_fin = request.query_params.get('fecha_fin')
            
            if not fecha_inicio or not fecha_fin:
                return Response({'error': 'Fechas de inicio y fin requeridas'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                fecha_inicio = datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
                fecha_fin = datetime.strptime(fecha_fin, '%Y-%m-%d').date()
                
                movimientos = MovimientoInventario.objects.filter(
                    fecha__range=[fecha_inicio, fecha_fin]
                ).select_related('idusuario', 'inventario_id__producto')
                
                data = []
                for mov in movimientos:
                    data.append({
                        'fecha': mov.fecha,
                        'tipo_movimiento': mov.tipo_movimiento,
                        'producto': mov.inventario_id.producto.nombre,
                        'usuario': mov.idusuario.nombre
                    })
                
                return Response({
                    'reporte': 'Movimientos por Período',
                    'fecha_inicio': fecha_inicio,
                    'fecha_fin': fecha_fin,
                    'data': data
                })
            except ValueError:
                return Response({'error': 'Formato de fecha inválido'}, status=status.HTTP_400_BAD_REQUEST)
        
        elif tipo_reporte == 'productos-vencimiento':
            productos = ProductosVencimiento.objects.select_related('producto_id').all()
            data = []
            for prod in productos:
                data.append({
                    'producto_nombre': prod.producto_id.nombre,
                    'fecha_vencimiento': prod.fecha_vencimiento,
                    'notificado': prod.notificado
                })
            return Response({'reporte': 'Productos Vencimiento', 'data': data})
        
        elif tipo_reporte == 'proveedores-activos':
            from suppliers.models import Proveedor
            proveedores = Proveedor.objects.filter(estado=True)
            data = []
            for prov in proveedores:
                data.append({
                    'id': prov.idproveedor,
                    'nombre': prov.nombre,
                    'tipo': prov.tipo,
                    'correo': prov.correo,
                    'telefono': prov.telefono
                })
            return Response({'reporte': 'Proveedores Activos', 'data': data})
        
        else:
            return Response({'error': 'Tipo de reporte no válido'}, status=status.HTTP_400_BAD_REQUEST)

class DashboardView(APIView):
    
    def get(self, request):
        """Obtener estadísticas para dashboard"""
        from productos.models import Producto
        from suppliers.models import Proveedor
        
        # Total productos
        total_productos = Producto.objects.count()
        
        # Valor total inventario (asumiendo precio unitario promedio)
        inventarios = Inventario.objects.all()
        valor_total = sum(inv.cantidad for inv in inventarios)  # Simplificado
        
        # Productos críticos (bajo stock)
        productos_criticos = Inventario.objects.filter(cantidad__lte=10).count()
        
        # Movimientos recientes
        movimientos_recientes = MovimientoInventario.objects.order_by('-fecha')[:10]
        movimientos_data = []
        for mov in movimientos_recientes:
            movimientos_data.append({
                'fecha': mov.fecha,
                'tipo': mov.tipo_movimiento,
                'producto': mov.inventario_id.producto.nombre,
                'usuario': mov.idusuario.nombre
            })
        
        # Productos por vencer
        fecha_limite = timezone.now().date() + timedelta(days=30)
        productos_por_vencer = ProductosVencimiento.objects.filter(
            fecha_vencimiento__lte=fecha_limite,
            fecha_vencimiento__gte=timezone.now().date()
        ).count()
        
        return Response({
            'total_productos': total_productos,
            'valor_inventario_total': valor_total,
            'productos_criticos': productos_criticos,
            'productos_por_vencer': productos_por_vencer,
            'movimientos_recientes': movimientos_data
        })