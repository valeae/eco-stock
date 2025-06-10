// Mostrar cuántas entradas y salidas se han hecho en un periodo (mensual, semanal o por fecha), para analizar actividad.
// Filtros: Fecha de inicio / Fecha de fin
// Datos a mostrar:
// Fecha
// Entradas realizadas
// Salidas realizadas
// Diferencia (inventario neto)
// Usuario que más movimientos hizo (opcional)

"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  User, 
  ArrowUpDown,
  Filter,
  BarChart3
} from "lucide-react";

// Components
import PageLayout from "@/components/shared/PageLayout";
import SearchAndActions from "@/components/shared/SearchAndActions";
import { exportToCSV } from "@/components/shared/ExportUtils";

// Interfaces
interface MovimientoPeriodo extends Record<string, unknown> {
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

// Datos de ejemplo simulando movimientos de inventario agrícola
const MOVIMIENTOS_EJEMPLO: MovimientoPeriodo[] = [
  {
    id: 1,
    fecha: "2024-12-01",
    entradas: 15,
    salidas: 8,
    diferencia: 7,
    usuarioMasActivo: "María González",
    totalMovimientos: 23,
    productos: {
      entrada: ["Semillas de Maíz", "Fertilizante NPK", "Herramientas"],
      salida: ["Insecticida", "Semillas de Frijol"]
    }
  },
  {
    id: 2,
    fecha: "2024-12-02",
    entradas: 12,
    salidas: 18,
    diferencia: -6,
    usuarioMasActivo: "Carlos Ruiz",
    totalMovimientos: 30,
    productos: {
      entrada: ["Urea Granulada", "Azadón"],
      salida: ["Fertilizante Orgánico", "Semillas de Arroz", "Pala"]
    }
  },
  {
    id: 3,
    fecha: "2024-12-03",
    entradas: 20,
    salidas: 5,
    diferencia: 15,
    usuarioMasActivo: "Ana López",
    totalMovimientos: 25,
    productos: {
      entrada: ["Semillas Híbridas", "Fungicida", "Fertilizante NPK"],
      salida: ["Herbicida"]
    }
  },
  {
    id: 4,
    fecha: "2024-12-04",
    entradas: 8,
    salidas: 14,
    diferencia: -6,
    usuarioMasActivo: "Pedro Martín",
    totalMovimientos: 22,
    productos: {
      entrada: ["Insecticida Orgánico"],
      salida: ["Semillas de Maíz", "Fertilizante", "Herramientas"]
    }
  },
  {
    id: 5,
    fecha: "2024-12-05",
    entradas: 25,
    salidas: 12,
    diferencia: 13,
    usuarioMasActivo: "Laura Vega",
    totalMovimientos: 37,
    productos: {
      entrada: ["Semillas Certificadas", "Fertilizantes", "Agroquímicos"],
      salida: ["Herramientas", "Semillas de Frijol"]
    }
  },
  {
    id: 6,
    fecha: "2024-12-06",
    entradas: 18,
    salidas: 22,
    diferencia: -4,
    usuarioMasActivo: "Miguel Torres",
    totalMovimientos: 40,
    productos: {
      entrada: ["Fertilizante Orgánico", "Semillas"],
      salida: ["Insecticida", "Fungicida", "Herramientas", "Fertilizante NPK"]
    }
  },
  {
    id: 7,
    fecha: "2024-12-07",
    entradas: 30,
    salidas: 15,
    diferencia: 15,
    usuarioMasActivo: "Sandra Díaz",
    totalMovimientos: 45,
    productos: {
      entrada: ["Semillas Premium", "Fertilizantes Especiales", "Agroquímicos"],
      salida: ["Herramientas Básicas", "Semillas Comunes"]
    }
  }
];

type PeriodoFiltro = "semanal" | "mensual" | "personalizado";
type VistaReporte = "timeline" | "comparativo" | "usuario";

export default function MovimientosPeriodo() {
  const [busqueda, setBusqueda] = useState("");
  const [exportandoCSV, setExportandoCSV] = useState(false);
  const [periodoFiltro, setPeriodoFiltro] = useState<PeriodoFiltro>("semanal");
  const [vistaActual, setVistaActual] = useState<VistaReporte>("timeline");
  const [fechaInicio, setFechaInicio] = useState("2024-12-01");
  const [fechaFin, setFechaFin] = useState("2024-12-07");

  // Filtrar datos según el periodo y búsqueda
  const datosFiltrados = useMemo(() => {
    let datos = MOVIMIENTOS_EJEMPLO;

    // Filtrar por rango de fechas si es personalizado
    if (periodoFiltro === "personalizado") {
      datos = datos.filter(item => 
        item.fecha >= fechaInicio && item.fecha <= fechaFin
      );
    }

    // Filtrar por búsqueda
    if (busqueda) {
      datos = datos.filter(item =>
        item.usuarioMasActivo.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.fecha.includes(busqueda)
      );
    }

    return datos.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }, [periodoFiltro, fechaInicio, fechaFin, busqueda]);

  const exportarCSV = useCallback(() => {
    setExportandoCSV(true);

    setTimeout(() => {
      const headers = ["Fecha", "Entradas", "Salidas", "Diferencia", "Usuario Más Activo", "Total Movimientos"];
      const fileName = `movimientos_periodo_${periodoFiltro}_${new Date().toISOString().split('T')[0]}.csv`;
      
      const success = exportToCSV(
        datosFiltrados as Record<string, unknown>[],
        headers,
        fileName
      );

      if (success) {
        toast.success(`Reporte CSV generado correctamente (${datosFiltrados.length} registros)`);
      } else {
        toast.error("Error al generar el reporte CSV");
      }

      setExportandoCSV(false);
    }, 100);
  }, [datosFiltrados, periodoFiltro]);

  // Calcular estadísticas generales
  const estadisticas = useMemo(() => {
    const totalEntradas = datosFiltrados.reduce((sum, item) => sum + item.entradas, 0);
    const totalSalidas = datosFiltrados.reduce((sum, item) => sum + item.salidas, 0);
    const diferenciaTotal = totalEntradas - totalSalidas;
    const promedioMovimientos = datosFiltrados.length > 0 
      ? Math.round(datosFiltrados.reduce((sum, item) => sum + item.totalMovimientos, 0) / datosFiltrados.length)
      : 0;

    return { totalEntradas, totalSalidas, diferenciaTotal, promedioMovimientos };
  }, [datosFiltrados]);

  // Obtener usuario más activo del periodo
  const usuarioMasActivoPeriodo = useMemo(() => {
    const conteoUsuarios = datosFiltrados.reduce((acc, item) => {
      acc[item.usuarioMasActivo] = (acc[item.usuarioMasActivo] || 0) + item.totalMovimientos;
      return acc;
    }, {} as Record<string, number>);

    const usuarioTop = Object.entries(conteoUsuarios)
      .sort(([,a], [,b]) => b - a)[0];

    return usuarioTop ? { nombre: usuarioTop[0], movimientos: usuarioTop[1] } : null;
  }, [datosFiltrados]);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <PageLayout title="Movimientos por Periodo">
      <SearchAndActions
        searchValue={busqueda}
        onSearchChange={setBusqueda}
        searchPlaceholder="Buscar por usuario o fecha..."
        formVisible={false}
        onToggleForm={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        isEditing={false}
        addButtonText=""
        showAddButton={false}
        showExport={true}
        onExport={exportarCSV}
        isExporting={exportandoCSV}
      />

      {/* Filtros de Periodo */}
      <div className="bg-white rounded-xl shadow-sm border border-muted p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-heading">Filtros de Periodo</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex rounded-lg border border-muted bg-muted-light p-1">
              {(["semanal", "mensual", "personalizado"] as PeriodoFiltro[]).map((periodo) => (
                <button
                  key={periodo}
                  type="button"
                  onClick={() => setPeriodoFiltro(periodo)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                    periodoFiltro === periodo
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-dark hover:text-heading hover:bg-white"
                  }`}
                >
                  {periodo}
                </button>
              ))}
            </div>

            {periodoFiltro === "personalizado" && (
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="px-3 py-2 border border-muted rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  title="Fecha de inicio"
                  placeholder="Seleccionar fecha de inicio"
                />
                <span className="text-muted-dark">hasta</span>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="px-3 py-2 border border-muted rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  title="Fecha de fin"
                  placeholder="Seleccionar fecha de fin"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-muted p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-dark">Total Entradas</p>
              <p className="text-3xl font-bold text-success">{estadisticas.totalEntradas}</p>
            </div>
            <div className="h-12 w-12 bg-success/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-success-dark" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-muted p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-dark">Total Salidas</p>
              <p className="text-3xl font-bold text-destructive">{estadisticas.totalSalidas}</p>
            </div>
            <div className="h-12 w-12 bg-destructive/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-destructive-dark" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-muted p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-dark">Diferencia Neta</p>
              <p className={`text-3xl font-bold ${estadisticas.diferenciaTotal >= 0 ? 'text-success' : 'text-destructive'}`}>
                {estadisticas.diferenciaTotal > 0 ? '+' : ''}{estadisticas.diferenciaTotal}
              </p>
            </div>
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
              estadisticas.diferenciaTotal >= 0 ? 'bg-success/20' : 'bg-destructive/20'
            }`}>
              <ArrowUpDown className={`h-6 w-6 ${
                estadisticas.diferenciaTotal >= 0 ? 'text-success-dark' : 'text-destructive-dark'
              }`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-muted p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-dark">Promedio Diario</p>
              <p className="text-3xl font-bold text-info">{estadisticas.promedioMovimientos}</p>
            </div>
            <div className="h-12 w-12 bg-info/20 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-info-dark" />
            </div>
          </div>
        </div>
      </div>

      {/* Selector de Vista */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-heading">Vista del Reporte</h3>
        </div>
        
        <div className="inline-flex rounded-lg border border-muted bg-white p-1">
          {(["timeline", "comparativo", "usuario"] as VistaReporte[]).map((vista) => (
            <button
              key={vista}
              type="button"
              onClick={() => setVistaActual(vista)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                vistaActual === vista
                  ? "bg-primary text-white"
                  : "text-muted-dark hover:text-heading"
              }`}
            >
              {vista === "timeline" && "📅 Timeline"}
              {vista === "comparativo" && "📊 Comparativo"}
              {vista === "usuario" && "👥 Por Usuario"}
            </button>
          ))}
        </div>
      </div>

      {/* Vista Timeline */}
      {vistaActual === "timeline" && (
        <div className="space-y-4">
          {datosFiltrados.map((movimiento, index) => (
            <div
              key={movimiento.id}
              className="bg-white rounded-xl shadow-sm border border-muted p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary-ecoLight rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary-dark" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-heading">{formatearFecha(movimiento.fecha)}</h3>
                    <p className="text-sm text-muted-dark">Día {index + 1} del periodo</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-dark">Usuario Activo</p>
                    <p className="font-medium text-heading text-sm">{movimiento.usuarioMasActivo}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <p className="text-2xl font-bold text-success">{movimiento.entradas}</p>
                  <p className="text-sm text-success-dark">Entradas</p>
                </div>
                <div className="text-center p-4 bg-destructive/10 rounded-lg">
                  <p className="text-2xl font-bold text-destructive">{movimiento.salidas}</p>
                  <p className="text-sm text-destructive-dark">Salidas</p>
                </div>
                <div className={`text-center p-4 rounded-lg ${
                  movimiento.diferencia >= 0 ? 'bg-success/10' : 'bg-destructive/10'
                }`}>
                  <p className={`text-2xl font-bold ${
                    movimiento.diferencia >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {movimiento.diferencia > 0 ? '+' : ''}{movimiento.diferencia}
                  </p>
                  <p className={`text-sm ${
                    movimiento.diferencia >= 0 ? 'text-success-dark' : 'text-destructive-dark'
                  }`}>
                    Diferencia
                  </p>
                </div>
                <div className="text-center p-4 bg-info/10 rounded-lg">
                  <p className="text-2xl font-bold text-info">{movimiento.totalMovimientos}</p>
                  <p className="text-sm text-info-dark">Total</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista Comparativo */}
      {vistaActual === "comparativo" && (
        <div className="bg-white rounded-xl shadow-sm border border-muted p-8">
          <h3 className="text-xl font-semibold text-heading mb-6">Comparativo de Movimientos</h3>
          <div className="space-y-6">
            {datosFiltrados.map((item) => {
              const porcentajeEntradas = (item.entradas / item.totalMovimientos) * 100;
              const porcentajeSalidas = (item.salidas / item.totalMovimientos) * 100;
              
              return (
                <div key={item.id} className="group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-heading">{formatearFecha(item.fecha)}</span>
                      <span className="text-sm text-muted-dark">por {item.usuarioMasActivo}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-success font-medium">↑ {item.entradas}</span>
                      <span className="text-destructive font-medium">↓ {item.salidas}</span>
                      <span className="font-bold text-heading">{item.totalMovimientos} total</span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-muted rounded-full h-8 overflow-hidden">
                      <div 
                        className="h-8 bg-gradient-to-r from-success to-success/70 transition-all duration-700 ease-out flex items-center justify-start pl-2"
                        style={{ width: `${porcentajeEntradas}%` }}
                      >
                        <span className="text-white font-medium text-xs">
                          {item.entradas} entradas
                        </span>
                      </div>
                      <div 
                        className="h-8 bg-gradient-to-r from-destructive to-destructive/70 transition-all duration-700 ease-out flex items-center justify-start pl-2 -mt-8 ml-auto"
                        style={{ width: `${porcentajeSalidas}%` }}
                      >
                        <span className="text-white font-medium text-xs">
                          {item.salidas} salidas
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vista Por Usuario */}
      {vistaActual === "usuario" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Usuario más activo del periodo */}
          {usuarioMasActivoPeriodo && (
            <div className="bg-gradient-to-br from-primary-ecoLight to-primary/10 rounded-xl border-2 border-primary/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary-dark">Usuario Más Activo</h3>
                    <p className="text-sm text-primary">Del periodo seleccionado</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-dark">{usuarioMasActivoPeriodo.movimientos}</p>
                  <p className="text-sm text-primary">movimientos</p>
                </div>
              </div>
              <p className="text-xl font-semibold text-heading">{usuarioMasActivoPeriodo.nombre}</p>
            </div>
          )}

          {/* Lista de usuarios por día */}
          <div className="bg-white rounded-xl shadow-sm border border-muted p-6">
            <h3 className="text-lg font-semibold text-heading mb-4">Usuarios por Día</h3>
            <div className="space-y-3">
              {datosFiltrados.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-muted-light rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-heading text-sm">{item.usuarioMasActivo}</p>
                      <p className="text-xs text-muted-dark">{formatearFecha(item.fecha)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-heading">{item.totalMovimientos}</p>
                    <p className="text-xs text-muted-dark">movimientos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mensaje si no hay datos */}
      {datosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-dark text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-heading mb-2">No hay movimientos en este periodo</h3>
          <p className="text-muted-dark">
            Ajusta los filtros para ver los datos de movimientos
          </p>
        </div>
      )}
    </PageLayout>
  );
}