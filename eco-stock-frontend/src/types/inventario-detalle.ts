import { type Categoria } from "./categoria";
import { type ProductoDetalle } from "./producto";

export interface InventarioDetalle {
    id: number;
    nombre: ProductoDetalle;
    descripcion: Categoria;
    cantidadDisponible: ProductoDetalle;
    fechaActualizacion: string;
    unidadMedida: string;
    categoria: string;
    proveedores: string[];
  };