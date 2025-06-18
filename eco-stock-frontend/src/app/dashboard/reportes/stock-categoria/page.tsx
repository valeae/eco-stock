"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { BarChart3, TrendingUp, Package, Percent } from "lucide-react";

// Components
import PageLayout from "@/components/shared/PageLayout";
import SearchAndActions from "@/components/shared/SearchAndActions";
import { exportToCSV } from "@/components/shared/ExportUtils";

// Types and mocks
import { PRODUCTOS_EJEMPLO } from "@/mocks/productos-inventario";
import { type ProductoInventario } from "@/types/producto-inventario";
import { type StockCategoria } from "@/types/stock-categoria";

// Iconos y colores por categoría usando la paleta personalizada
const CATEGORIA_CONFIG = {
  Semillas: { icon: "🌱", color: "bg-success", bgLight: "bg-primary-ecoLight", textColor: "text-success-dark" },
  Fertilizantes: { icon: "🧪", color: "bg-info", bgLight: "bg-muted-light", textColor: "text-info-dark" },
  Herramientas: { icon: "🔧", color: "bg-warning", bgLight: "bg-primary-ecoLight", textColor: "text-warning-dark" },
  Agroquímicos: { icon: "⚗️", color: "bg-primary", bgLight: "bg-muted-light", textColor: "text-primary-dark" },
};

export default function StockCategoria() {
  const [busqueda, setBusqueda] = useState("");
  const [exportandoCSV, setExportandoCSV] = useState(false);
  const [vistaActual, setVistaActual] = useState<"tarjetas" | "grafico">("tarjetas");

  // Generar datos del reporte agrupando por categoría
  const datosReporte = useMemo(() => {
    // Filtrar solo productos activos para el reporte
    const productosActivos = PRODUCTOS_EJEMPLO.filter(p => p.estadoInventario === "activo");
    
    // Agrupar por categoría
    const agrupados = productosActivos.reduce((acc, producto) => {
      if (!acc[producto.categoria]) {
        acc[producto.categoria] = {
          productos: [],
          stockTotal: 0
        };
      }
      acc[producto.categoria].productos.push(producto);
      acc[producto.categoria].stockTotal += producto.stockDisponible;
      return acc;
    }, {} as Record<string, { productos: ProductoInventario[], stockTotal: number }>);

    // Calcular stock total general
    const stockTotalGeneral = Object.values(agrupados).reduce((total, grupo) => total + grupo.stockTotal, 0);

    // Convertir a formato de reporte
    return Object.entries(agrupados).map(([categoria, datos], index) => ({
      id: index + 1,
      categoria,
      totalProductos: datos.productos.length,
      stockTotal: datos.stockTotal,
      porcentajeTotal: stockTotalGeneral > 0 ? (datos.stockTotal / stockTotalGeneral) * 100 : 0,
      promedioPorProducto: Math.round(datos.stockTotal / datos.productos.length)
    }));
  }, []);

  // Filtrar datos por búsqueda
  const datosFiltrados = useMemo(() => {
    return datosReporte.filter((item) =>
      item.categoria.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [datosReporte, busqueda]);

  const exportarCSV = useCallback(() => {
    setExportandoCSV(true);

    setTimeout(() => {
      const headers = ["Categoría", "Total Productos", "Stock Total", "Porcentaje del Total", "Promedio por Producto"];
      const fileName = `stock_por_categoria_${new Date().toISOString().split('T')[0]}.csv`;
      
      const success = exportToCSV(
        datosFiltrados,
        headers,
        fileName
      );

      if (success) {
        toast.success(`Reporte CSV generado correctamente (${datosFiltrados.length} categorías)`);
      } else {
        toast.error("Error al generar el reporte CSV");
      }

      setExportandoCSV(false);
    }, 100);
  }, [datosFiltrados]);

  const calcularTotales = () => {
    const totalCategorias = datosFiltrados.length;
    const totalProductos = datosFiltrados.reduce((sum, item) => sum + item.totalProductos, 0);
    const totalStock = datosFiltrados.reduce((sum, item) => sum + item.stockTotal, 0);
    
    return { totalCategorias, totalProductos, totalStock };
  };

  const { totalCategorias, totalProductos, totalStock } = calcularTotales();

  const obtenerConfigCategoria = (categoria: string) => {
    return CATEGORIA_CONFIG[categoria as keyof typeof CATEGORIA_CONFIG] || {
      icon: "📦",
      color: "bg-accent",
      bgLight: "bg-muted-light",
      textColor: "text-accent-dark"
    };
  };

  return (
    <PageLayout title="Stock por Categoría Agrícola">
      <SearchAndActions
        searchValue={busqueda}
        onSearchChange={setBusqueda}
        searchPlaceholder="Buscar categoría..."
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

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-muted p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-dark">Total Categorías</p>
              <p className="text-3xl font-bold text-heading">{totalCategorias}</p>
            </div>
            <div className="h-12 w-12 bg-primary-ecoLight rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary-dark" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-muted p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-dark">Total Productos</p>
              <p className="text-3xl font-bold text-heading">{totalProductos}</p>
            </div>
            <div className="h-12 w-12 bg-success/20 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-success-dark" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-muted p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-dark">Stock Total</p>
              <p className="text-3xl font-bold text-heading">{totalStock.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-info/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-info-dark" />
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Vista */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-lg border border-muted bg-white p-1">
          <button
            type="button"
            onClick={() => setVistaActual("tarjetas")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              vistaActual === "tarjetas"
                ? "bg-primary text-white"
                : "text-muted-dark hover:text-heading"
            }`}
          >
            📋 Tarjetas
          </button>
          <button
            type="button"
            onClick={() => setVistaActual("grafico")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              vistaActual === "grafico"
                ? "bg-primary text-white"
                : "text-muted-dark hover:text-heading"
            }`}
          >
            📈 Gráfico
          </button>
        </div>
      </div>

      {/* Vista de Tarjetas */}
      {vistaActual === "tarjetas" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datosFiltrados
            .sort((a, b) => b.stockTotal - a.stockTotal)
            .map((categoria) => {
              const config = obtenerConfigCategoria(categoria.categoria);
              return (
                <div
                  key={categoria.id}
                  className={`${config.bgLight} rounded-xl border-2 border-muted hover:border-primary/50 p-6 hover:shadow-md transition-all duration-300 hover:scale-105`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`${config.color} rounded-lg p-2 text-white text-xl`}>
                        {config.icon}
                      </div>
                      <h3 className={`text-lg font-semibold ${config.textColor}`}>
                        {categoria.categoria}
                      </h3>
                    </div>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} text-white`}>
                      {categoria.porcentajeTotal.toFixed(1)}%
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-dark">Total Productos</span>
                      <span className="font-semibold text-heading">{categoria.totalProductos}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-dark">Stock Total</span>
                      <span className="font-bold text-lg text-heading">{categoria.stockTotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-dark">Promedio/Producto</span>
                      <span className="font-medium text-heading-light">{categoria.promedioPorProducto}</span>
                    </div>

                    {/* Barra de progreso */}
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className={`${config.color} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(categoria.porcentajeTotal, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Vista de Gráfico */}
      {vistaActual === "grafico" && (
        <div className="bg-white rounded-xl shadow-sm border border-muted p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-heading">Distribución de Stock por Categoría</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-dark">
              <Percent className="h-4 w-4" />
              <span>Porcentaje del total</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {datosFiltrados
              .sort((a, b) => b.stockTotal - a.stockTotal)
              .map((item) => {
                const config = obtenerConfigCategoria(item.categoria);
                const maxStock = Math.max(...datosFiltrados.map(d => d.stockTotal));
                const barWidth = (item.stockTotal / maxStock) * 100;
                
                return (
                  <div key={item.id} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{config.icon}</span>
                        <span className="font-medium text-heading">{item.categoria}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-muted-dark">{item.totalProductos} productos</span>
                        <span className="font-semibold text-heading">{item.stockTotal.toLocaleString()} unidades</span>
                        <span className={`font-bold ${config.textColor}`}>
                          {item.porcentajeTotal.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="w-full bg-muted rounded-full h-8">
                        <div 
                          className={`${config.color} h-8 rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-4 group-hover:opacity-85`}
                          style={{ width: `${barWidth}%` }}
                        >
                          <span className="text-white font-semibold text-sm">
                            {item.stockTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Leyenda */}
          <div className="mt-8 pt-6 border-t border-muted">
            <h4 className="text-sm font-medium text-heading-light mb-3">Leyenda de Categorías</h4>
            <div className="flex flex-wrap gap-4">
              {Object.entries(CATEGORIA_CONFIG).map(([categoria, config]) => (
                <div key={categoria} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${config.color}`} />
                  <span className="text-sm text-muted-dark">{categoria}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mensaje si no hay datos */}
      {datosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-dark text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-heading mb-2">No se encontraron categorías</h3>
          <p className="text-muted-dark">
            No hay categorías que coincidan con la búsqueda
          </p>
        </div>
      )}
    </PageLayout>
  );
}