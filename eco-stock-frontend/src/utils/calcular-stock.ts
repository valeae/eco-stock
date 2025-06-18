import { type MovimientoHistorial } from "@/types/movimiento-historial";

export function calcularStockDesdeMovimientos(
  movimientos: MovimientoHistorial[]
): Record<string, number> {
  const stockPorProducto: Record<string, number> = {};

  for (const movimiento of movimientos) {
    const { producto, tipoMovimiento, cantidad } = movimiento;

    if (!stockPorProducto[producto]) {
      stockPorProducto[producto] = 0;
    }

    if (tipoMovimiento === "entrada") {
      stockPorProducto[producto] += cantidad;
    } else if (tipoMovimiento === "salida") {
      stockPorProducto[producto] -= cantidad;
    }
  }

  return stockPorProducto;
}
