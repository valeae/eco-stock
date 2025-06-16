export interface MovimientoPeriodo {
  id: number;
  fecha: string;
  entradas: number;
  salidas: number;
  diferencia: number;
  usuarioMasActivo: string;
  totalMovimientos: number;
  productos: {
    entrada: string[];
    salida: string[];
  };
}

export type PeriodoFiltro = "semanal" | "mensual" | "personalizado";
export type VistaReporte = "timeline" | "comparativo" | "usuario";
