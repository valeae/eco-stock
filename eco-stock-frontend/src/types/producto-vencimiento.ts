import { type ProductoDetalle } from "./producto";

export interface ProductoVencimiento {
    id: number;
    lote: string;
    nombre: ProductoDetalle;
    cantidad: string;
    proveedor: string;
    fechaVencimiento: string;
    notificado: boolean;
  };