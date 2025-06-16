export interface TopProducto {
  id: number;
  nombre: string;
  categoria: string;
  rotacion: number;
  tendencia: "positiva" | "negativa";
  cambio: number;
  evolucion: { mes: string; rotacion: number }[];
};
