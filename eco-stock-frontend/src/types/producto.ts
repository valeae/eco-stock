import { type Categoria } from "./categoria";
import { type UnidadMedida } from "./unidad-medida";
import { type Proveedor } from "./proveedor";

export interface Producto {
  id: number;
  lote: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  stock: number;
  categoria: Categoria;
  proveedor: Proveedor[];
  unidadMedida: UnidadMedida;
  fechaVencimiento?: string;
  estado: "Disponible" | "Agotado" | "Suspendido" | "Inactivo";
}
