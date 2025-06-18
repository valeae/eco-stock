import { type MovimientoHistorial } from "@/types/movimiento-historial";

export const MOVIMIENTOS_EJEMPLO: MovimientoHistorial[] = [
  {
    id: 1,
    fecha: "2024-06-12",
    tipoMovimiento: "entrada",
    producto: "Urea Granulada 46%",
    cantidad: 100,
    usuarioRegistro: "Carlos Mendoza",
    detalle: "Compra directa a proveedor AgroDistribuidor Central"
  },
  {
    id: 2,
    fecha: "2024-06-11",
    tipoMovimiento: "salida",
    producto: "Glifosato 48%",
    cantidad: 25,
    usuarioRegistro: "Ana García",
    detalle: "Venta a productor Juan Pérez - Finca El Paraíso"
  },
  {
    id: 3,
    fecha: "2024-06-10",
    tipoMovimiento: "entrada",
    producto: "Semilla Maíz Híbrido ICA V-305",
    cantidad: 50,
    usuarioRegistro: "Luis Rodríguez",
    detalle: "Pedido especial temporada de siembra"
  },
  {
    id: 4,
    fecha: "2024-06-09",
    tipoMovimiento: "salida",
    producto: "Urea Granulada 46%",
    cantidad: 75,
    usuarioRegistro: "Carlos Mendoza",
    detalle: "Distribución a cooperativa La Esperanza"
  }
];