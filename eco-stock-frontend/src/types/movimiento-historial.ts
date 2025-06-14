export interface MovimientoHistorial extends Record<string, unknown> {
  id: number;
  fecha: string;
  tipoMovimiento: "entrada" | "salida";
  producto: string;
  cantidad: number;
  usuarioRegistro: string;
  detalle: string;
}
