import { TopProducto } from "@/types/top-productos";

export const PRODUCTOS_EJEMPLO: TopProducto[] = [
  {
    id: 1,
    nombre: "Urea Granulada 46%",
    categoria: "Fertilizantes",
    rotacion: 85,
    tendencia: "positiva",
    cambio: 12.5,
    evolucion: [
      { mes: "enero", rotacion: 70 },
      { mes: "febrero", rotacion: 75 },
      { mes: "marzo", rotacion: 80 },
      { mes: "abril", rotacion: 78 },
      { mes: "mayo", rotacion: 82 },
      { mes: "junio", rotacion: 85 },
    ],
  },
  {
    id: 2,
    nombre: "Glifosato 48%",
    categoria: "Pesticidas",
    rotacion: 72,
    tendencia: "negativa",
    cambio: -8.3,
    evolucion: [
      { mes: "enero", rotacion: 85 },
      { mes: "febrero", rotacion: 80 },
      { mes: "marzo", rotacion: 78 },
      { mes: "abril", rotacion: 75 },
      { mes: "mayo", rotacion: 74 },
      { mes: "junio", rotacion: 72 },
    ],
  },
  {
    id: 3,
    nombre: "Semilla Maíz Híbrido ICA V-305",
    categoria: "Semillas",
    rotacion: 65,
    tendencia: "positiva",
    cambio: 15.8,
    evolucion: [
      { mes: "enero", rotacion: 45 },
      { mes: "febrero", rotacion: 50 },
      { mes: "marzo", rotacion: 55 },
      { mes: "abril", rotacion: 58 },
      { mes: "mayo", rotacion: 62 },
      { mes: "junio", rotacion: 65 },
    ],
  },
];
