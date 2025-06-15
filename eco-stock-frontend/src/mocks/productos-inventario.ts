import { type ProductoInventario } from "@/types/producto-inventario";

export const PRODUCTOS_EJEMPLO: ProductoInventario[] = [
  {
    id: 1,
    codigo: "FERT-001",
    nombre: "Urea Granulada 46%",
    categoria: "Fertilizantes",
    stockDisponible: 150,
    estadoInventario: "activo"
  },
  {
    id: 2,
    codigo: "PEST-001",
    nombre: "Glifosato 48%",
    categoria: "Pesticidas",
    stockDisponible: 75,
    estadoInventario: "activo"
  },
  {
    id: 3,
    codigo: "SEM-001",
    nombre: "Semilla Maíz Híbrido ICA V-305",
    categoria: "Semillas",
    stockDisponible: 45,
    estadoInventario: "activo"
  },
  {
    id: 4,
    codigo: "FERT-002",
    nombre: "Sulfato de Potasio",
    categoria: "Fertilizantes",
    stockDisponible: 0,
    estadoInventario: "inactivo"
  }
];