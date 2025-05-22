// src/types/index.ts

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  tipo?: string;
  vidaUtil?: number; // en días, meses, etc.
  modo?: string;
}

export interface UnidadMedida {
  id: number;
  nombre: string;
  abreviatura: string;
  descripcion?: string;
}

export interface Proveedor {
  id: number;
  tipo?: string;
  nombre: string;
  contacto?: string;
  direccion?: string;
  estado: 'Activo' | 'Inactivo';
}

export interface Distribuidor {
  id: number;
  proveedorId: number; // Relación con proveedor
  nombre: string;
  rutaEntrega?: string; // opcional, info de región o rutas
  estado: 'Activo' | 'Inactivo';
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  stock: number;
  estado: 'Activo' | 'Inactivo';
  categoriaId: number;
  proveedorId?: number;
  precioUnitario?: number;
  unidadMedidaId?: number;
}

export interface ProductoVencimiento {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  proveedor: string;
  descripcion?: string;
  fechaVencimiento: string; // ISO date string
  notificado: boolean;
}

export interface InventarioEstado {
  codigoProducto: number;
  nombreProducto: string;
  categoria: string;
  stockTotal: number;
  disponible: number;
  reservado: number;
  estado: 'Activo' | 'Inactivo';
  ultimaActualizacion: string; // ISO date string
  observaciones?: string;
}

export interface DetalleInventario {
  id: number;
  productoId: number;
  fecha: string; // ISO date string
  precioUnitario: number;
  cantidad: number;
  tipoMovimiento: 'entrada' | 'salida';
  usuarioId?: number;
  observaciones?: string;
}

export interface ReporteProductoCategoria {
  productoId: number;
  nombreProducto: string;
  categoria: string;
  precioUnitario: number;
  unidadesIniciales: number;
  unidadesActuales: number;
  unidadesVendidas: number;
}

export interface ReportePeriodoTiempo {
  fechaInicio: string; // ISO date string
  fechaFin: string; // ISO date string
  totalEntradas: number;
  totalSalidas: number;
  productosConMasMovimiento: Array<{
    productoId: number;
    nombreProducto: string;
    cantidadMovimiento: number;
  }>;
}

// Para paginación común
export interface Paginacion<T> {
  items: T[];
  paginaActual: number;
  totalPaginas: number;
  totalItems: number;
}
