"use client";

import { useState } from "react";
import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Filter,
} from "lucide-react";
import DropDownEvolution from "@/components/dashboard/DropDownEvolution";

// Types and mocks
import { PRODUCTOS_EJEMPLO } from "@/mocks/top-productos";

const CATEGORIAS = [
  "Todas",
  "Fertilizantes",
  "Semillas",
  "Herbicidas",
  "Fungicidas",
  "Insecticidas",
];

export default function TopProducts() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [desplegableAbierto, setDesplegableAbierto] = useState<number | null>(
    null
  );

  // Filtrar productos por categoría únicamente
  const productosFiltrados = PRODUCTOS_EJEMPLO.filter((producto) => {
    return categoriaSeleccionada === "Todas" || 
           producto.categoria === categoriaSeleccionada;
  });

  // Ordenar productos por rotación (mayor a menor)
  const productosOrdenados = [...productosFiltrados].sort(
    (a, b) => b.rotacion - a.rotacion
  );

  const toggleDesplegable = (productoId: number) => {
    setDesplegableAbierto(
      desplegableAbierto === productoId ? null : productoId
    );
  };

  // Handler para cambio de categoría
  const handleCategoriaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Categoria cambiada a:', event.target.value); // Debug
    setCategoriaSeleccionada(event.target.value);
    setDesplegableAbierto(null); // Cerrar desplegables al cambiar filtro
  };

  // Debug info
  console.log('Productos totales:', PRODUCTOS_EJEMPLO.length);
  console.log('Productos filtrados:', productosFiltrados.length);
  console.log('Categoria seleccionada:', categoriaSeleccionada);

  return (
    <div className="min-h-screen bg-primary-ecoLight">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-heading-dark mb-3">
            Top de productos con mayor rotación
          </h1>
          {/* Debug info visible */}
          <p className="text-sm text-gray-600">
            Mostrando {productosOrdenados.length} productos 
            {categoriaSeleccionada !== "Todas" && ` de la categoría "${categoriaSeleccionada}"`}
          </p>
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
                  onChange={handleCategoriaChange}
                  className="px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white text-sm w-48 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 appearance-none cursor-pointer"
                >
                  {CATEGORIAS.map((categoria) => (
                    <option 
                      key={categoria} 
                      value={categoria} 
                      className="text-gray-800 bg-white"
                    >
                      {categoria}
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