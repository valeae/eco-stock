export interface InventarioDetalle {
  id: number;
  nombre: string;
  descripcion: string;
  cantidadDisponible: number;
  fechaActualizacion: string;
  unidadMedida: string;
  categoria: string;
  proveedores: string[];
};