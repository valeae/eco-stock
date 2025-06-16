import { Distribuidor } from "@/types/distribuidor";

export const DISTRIBUIDORES_EJEMPLO: Distribuidor[] = [
  {
    id: 1,
    nombre: "AgroDistribuidor Central",
    telefono: 3001234567,
    correo: "ventas@agrodistcentral.com",
    estado: "Activo",
    direccion: "Calle 45 #23-67, Bogotá"
  },
  {
    id: 2,
    nombre: "Insumos del Campo Ltda",
    telefono: 3159876543,
    correo: "comercial@insumoscampo.com",
    estado: "Activo",
    direccion: "Carrera 15 #78-90, Medellín"
  },
  {
    id: 3,
    nombre: "Fertilizantes del Valle",
    telefono: 3201357924,
    correo: "info@fertivalle.com",
    estado: "Inactivo",
    direccion: "Avenida 2N #12-45, Cali"
  }
];