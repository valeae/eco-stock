export interface ProductoInventario {
    id: number;
    codigo: string;
    nombre: string;
    categoria: string;
    stockDisponible: number;
    estadoInventario: "activo" | "inactivo" | "suspendido";
  }
  
 export type FiltroCompleto = "todos" | "activo" | "inactivo" | "suspendido";