import { type ProximoVencimiento } from "@/types/proximo-vencimiento";

export const VENCIMIENTOS_EJEMPLO: ProximoVencimiento[] = [
  {
    id: 1,
    lote: "GLIFO-2024-A15",
    nombre: "Glifosato 48%",
    cantidad: "25 litros",
    proveedor: "Agroquímicos del Oriente",
    fechaVencimiento: "2024-08-15",
    notificado: true
  },
  {
    id: 2,
    lote: "SEM-MAIZ-2024-B03",
    nombre: "Semilla Maíz Híbrido ICA V-305",
    cantidad: "15 bolsas",
    proveedor: "Semillas Premium Ltda",
    fechaVencimiento: "2024-07-30",
    notificado: false
  },
  {
    id: 3,
    lote: "INSECT-2024-C08",
    nombre: "Insecticida Cipermetrina 25%",
    cantidad: "40 litros",
    proveedor: "Agroquímicos del Oriente",
    fechaVencimiento: "2024-09-20",
    notificado: false
  }
];