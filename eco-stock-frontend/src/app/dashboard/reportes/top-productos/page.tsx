"use client";

import { useState } from "react";
import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Filter,
} from "lucide-react";
import DropDownEvolution from "@/components/dashboard/DropDownEvolution";
import ProgressBar from "@/components/dashboard/ProgressBar";

// data.ts
export type Producto = {
  id: number;
  nombre: string;
  categoria: string;
  rotacion: number;
  tendencia: "positiva" | "negativa";
  cambio: number;
  evolucion: { mes: string; rotacion: number }[];
};

export const PRODUCTOS_EJEMPLO: Producto[] = [
  {
    id: 1,
    nombre: "Fertilizante NPK Premium",
    categoria: "Fertilizantes",
    rotacion: 95,
    tendencia: "positiva",
    cambio: 12.5,
    evolucion: [
      { mes: "Ene", rotacion: 78 },
      { mes: "Feb", rotacion: 82 },
    ],
  },
  {
    id: 2,
    nombre: "Semillas de Maíz Híbrido",
    categoria: "Semillas",
    rotacion: 88,
    tendencia: "positiva",
    cambio: 8.3,
    evolucion: [
      { mes: "Ene", rotacion: 75 },
      { mes: "Feb", rotacion: 79 },
      { mes: "Mar", rotacion: 82 },
    ],
  },
  {
    id: 3,
    nombre: "Herbicida Selectivo Pro",
    categoria: "Herbicidas",
    rotacion: 82,
    tendencia: "negativa",
    cambio: -5.2,
    evolucion: [
      { mes: "Ene", rotacion: 90 },
      { mes: "Feb", rotacion: 88 },

    ],
  },
  {
    id: 4,
    nombre: "Fungicida Sistémico",
    categoria: "Fungicidas",
    rotacion: 75,
    tendencia: "positiva",
    cambio: 15.4,
    evolucion: [
      { mes: "Ene", rotacion: 60 },
      { mes: "Feb", rotacion: 65 },
      { mes: "Mar", rotacion: 68 },
      { mes: "Abr", rotacion: 71 },
    ],
  },
];

const CATEGORIAS = [
  "Todas",
  "Fertilizantes",
  "Semillas",
  "Herbicidas",
  "Fungicidas",
  "Insecticidas",
];
const PERIODOS = [
  "Último mes",
  "Últimos 3 meses",
  "Últimos 6 meses",
  "Este año",
];

export default function TopProducts() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [periodoSeleccionado, setPeriodoSeleccionado] =
    useState("Últimos 6 meses");
  const [desplegableAbierto, setDesplegableAbierto] = useState<number | null>(
    null
  );

  const productosFiltrados = PRODUCTOS_EJEMPLO.filter(
    (producto) =>
      categoriaSeleccionada === "Todas" ||
      producto.categoria === categoriaSeleccionada
  );

  const productosOrdenados = [...productosFiltrados].sort(
    (a, b) => b.rotacion - a.rotacion
  );

  const toggleDesplegable = (productoId: number) => {
    setDesplegableAbierto(
      desplegableAbierto === productoId ? null : productoId
    );
  };

  return (
    <div className="min-h-screen bg-primary-ecoLight">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-heading-dark mb-3">
            Top de productos con mayor rotación
          </h1>
        </div>

        {/* Filtros */}
        <div className="bg-gradient-to-r from-primary via-primary-DEFAULT to-primary-dark text-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <Filter size={20} className="text-white" />
              </div>
              <span className="font-semibold text-lg">Filtros</span>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Categoría */}
              <div className="relative">
                <select
                  aria-label="Categoría"
                  value={categoriaSeleccionada}
                  onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                  className="px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white text-sm w-40 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 appearance-none placeholder-white placeholder-opacity-70"
                >
                  {CATEGORIAS.map((categoria) => (
                    <option key={categoria} value={categoria} className="text-gray-800">
                      {categoria}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white text-opacity-80"
                  size={16}
                />
              </div>

              {/* Periodo */}
              <div className="relative">
                <select
                  aria-label="Periodo"
                  value={periodoSeleccionado}
                  onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                  className="appearance-none bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 pr-10 min-w-44 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  {PERIODOS.map((p) => (
                    <option key={p} value={p} className="text-gray-800">
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white text-opacity-80"
                  size={16}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de productos */}
        <div className="space-y-3">
          {productosOrdenados.map((producto, index) => (
            <div
              key={producto.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-dark text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-heading-dark">
                        {producto.nombre}
                      </h3>
                      <span className="text-xs text-muted-dark bg-muted-light px-2 py-1 rounded-full">
                        {producto.categoria}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-heading-dark">
                      {producto.rotacion}%
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        producto.tendencia === "positiva"
                          ? "text-success-dark"
                          : "text-danger-dark"
                      }`}
                    >
                      {producto.tendencia === "positiva" ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      <span>{Math.abs(producto.cambio)}%</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-heading-dark">
                      Nivel de rotación
                    </span>
                    <span className="text-sm text-muted-dark">
                      {producto.rotacion}% del máximo
                    </span>
                  </div>
                  <ProgressBar
                    valor={producto.rotacion}
                    color={
                      producto.rotacion >= 80
                        ? "bg-success-DEFAULT"
                        : producto.rotacion >= 60
                        ? "bg-warning-DEFAULT"
                        : "bg-danger-DEFAULT"
                    }
                  />
                </div>
              </div>

              <DropDownEvolution
                producto={producto}
                isOpen={desplegableAbierto === producto.id}
                onToggle={() => toggleDesplegable(producto.id)}
              />
            </div>
          ))}

          {/* Mensaje vacío */}
          {productosOrdenados.length === 0 && (
            <div className="text-center py-8 text-muted-dark text-base">
              No se encontraron productos para los filtros seleccionados
            </div>
          )}
        </div>
      </div>
    </div>
  );
}