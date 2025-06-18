import { Proveedor } from "@/types/proveedor";

export const PROVEEDORES_EJEMPLO: Proveedor[] = [
  {
    id: 1,
    nombre: "Fertilizantes Colombianos S.A.",
    telefono: 3001234567,
    correo: "ventas@fertilcol.com",
    estado: "Activo",
    direccion: "Zona Industrial, Cartagena"
  },
  {
    id: 2,
    nombre: "Agroquímicos del Oriente",
    telefono: 3159876543,
    correo: "comercial@agroori.com",
    estado: "Activo",
    direccion: "Parque Industrial, Bucaramanga"
  },
  {
    id: 3,
    nombre: "Semillas Premium Ltda",
    telefono: 3201357924,
    correo: "info@semillaspremium.com",
    estado: "Inactivo",
    direccion: "Centro Empresarial, Palmira"
  }
];
