export interface MovimientoHistorial {
  id: number;
  fecha: string;
  tipoMovimiento: "entrada" | "salida";
  producto: string;
  cantidad: number;
  usuarioRegistro: string;
  detalle: string;
}

export type FiltroCompleto = 'todos' | 'entrada' | 'salida';