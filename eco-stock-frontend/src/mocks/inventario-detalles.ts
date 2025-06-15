import { type InventarioDetalle } from "@/types/inventario-detalle";

export const INVENTARIO_EJEMPLO: InventarioDetalle[] = [
  {
    id: 1,
    nombre: "Urea Granulada 46%",
    descripcion: "Fertilizante nitrogenado de alta concentración para cultivos de maíz y arroz",
    cantidadDisponible: 150,
    fechaActualizacion: "2024-06-10",
    unidadMedida: "sacos de 50kg",
    categoria: "Fertilizantes",
    proveedores: ["AgroDistribuidor Central", "Fertilizantes del Valle"]
  },
  {
    id: 2,
    nombre: "Glifosato 48%",
    descripcion: "Herbicida sistémico de amplio espectro para control de malezas",
    cantidadDisponible: 75,
    fechaActualizacion: "2024-06-12",
    unidadMedida: "litros",
    categoria: "Pesticidas",
    proveedores: ["Insumos del Campo Ltda"]
  },
  {
    id: 3,
    nombre: "Semilla Maíz Híbrido ICA V-305",
    descripcion: "Semilla certificada de maíz amarillo para zona cálida",
    cantidadDisponible: 45,
    fechaActualizacion: "2024-06-08",
    unidadMedida: "bolsas de 25kg",
    categoria: "Semillas",
    proveedores: ["AgroDistribuidor Central"]
  }
];