export interface Producto {
    id: number;
    nombre: string;
    cantidad: string;
    proveedor: string;
    descripcion: string;
    fechaVencimiento: string;
  };
  
  export interface ProductoDetalle {
    id: number;
    nombre: string;
    stock: number;
    proveedor: string;
    descripcion: string;
  }