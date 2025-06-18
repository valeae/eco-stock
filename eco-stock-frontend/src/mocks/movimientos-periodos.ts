import { type MovimientoPeriodo } from "@/types/movimiento-periodo";

export const MOVIMIENTOS_EJEMPLO: MovimientoPeriodo[] = [
  {
    id: 1,
    fecha: "2024-06-01",
    entradas: 450,
    salidas: 320,
    diferencia: 130,
    usuarioMasActivo: "Carlos Mendoza",
    totalMovimientos: 15,
    productos: {
      entrada: [
        "Urea Granulada 46%",
        "Semilla Maíz Híbrido ICA V-305",
        "Sulfato de Potasio",
      ],
      salida: [
        "Glifosato 48%",
        "Urea Granulada 46%",
        "Semilla Arroz Fedearroz 67",
      ],
    },
  },
  {
    id: 2,
    fecha: "2024-05-01",
    entradas: 380,
    salidas: 410,
    diferencia: -30,
    usuarioMasActivo: "Ana García",
    totalMovimientos: 18,
    productos: {
      entrada: ["Fertilizante Triple 15", "Insecticida Cipermetrina"],
      salida: [
        "Urea Granulada 46%",
        "Glifosato 48%",
        "Semilla Maíz Híbrido ICA V-305",
      ],
    },
  },
];
