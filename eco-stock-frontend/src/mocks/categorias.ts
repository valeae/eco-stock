import { Categoria } from "@/types/categoria";

export const CATEGORIAS_EJEMPLO: Categoria[] = [
  {
    id: 1,
    nombre: "Fertilizantes",
    descripcion: "Productos para nutrición vegetal y mejoramiento del suelo",
    tipo: "Insumo químico",
    vidaUtil: "24 meses",
    presentación: "Sacos de 50kg"
  },
  {
    id: 2,
    nombre: "Pesticidas",
    descripcion: "Productos fitosanitarios para control de plagas y enfermedades",
    tipo: "Agroquímico",
    vidaUtil: "36 meses",
    presentación: "Botellas de 1L"
  },
  {
    id: 3,
    nombre: "Semillas",
    descripcion: "Material vegetal para siembra",
    tipo: "Material biológico",
    vidaUtil: "12 meses",
    presentación: "Bolsas de 25kg"
  },
  {
    id: 4,
    nombre: "Herramientas",
    descripcion: "Implementos manuales para labores agrícolas",
    tipo: "Equipamiento",
    vidaUtil: "60 meses",
    presentación: "Unidades individuales"
  }
];
