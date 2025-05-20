'use client';

import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

interface ProductoDetalle {
  id: number;
  nombre: string;
  stock: number;
  precio: string;
}

export default function ProdctsDetails() {
  const [productos, setProductos] = useState<ProductoDetalle[]>([
    { id: 1, nombre: "Fertilizante Orgánico", stock: 42, precio: "$32,500" },
    { id: 2, nombre: "Pesticida Ecológico", stock: 18, precio: "$45,200" },
    { id: 3, nombre: "Semillas de Maíz", stock: 65, precio: "$12,800" },
    { id: 4, nombre: "Abono Mineral", stock: 27, precio: "$28,900" },
    { id: 5, nombre: "Kit de Análisis de Suelo", stock: 8, precio: "$76,500" },
  ]);

  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    for (const producto of productos) {
      if (producto.stock <= 10) {
        toast.error(`¡Stock bajo para "${producto.nombre}"!`, { duration: 4000 });
      }
    }
  }, [productos]);

  const handleEditar = (id: number) => {
    console.log("Editar producto detalle ID:", id);
  };

  const handleEliminar = (id: number) => {
    setProductos((prev) => prev.filter((producto) => producto.id !== id));
  };

  // Filtrar productos por nombre
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-primary-ecoLight p-10">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold text-heading-dark mb-8">Detalles de Productos</h2>

      <input
        type="text"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="mb-6 px-4 py-2 border border-gray-300 rounded-lg shadow-sm w-full max-w-md"
      />

      <div className="overflow-x-auto w-full max-w-6xl bg-white shadow-md rounded-xl">
        <table className="min-w-full table-auto">
          <thead className="bg-primary-dark text-white">
            <tr>
              <th className="py-4 px-6 text-left">Nombre</th>
              <th className="py-4 px-6 text-center">Stock</th>
              <th className="py-4 px-6 text-right">Precio</th>
              <th className="py-4 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => (
                <tr key={producto.id} className="border-b border-muted-default hover:bg-muted-light transition">
                  <td className="py-4 px-6">{producto.nombre}</td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`font-semibold ${
                        producto.stock > 30
                          ? "text-success-default"
                          : producto.stock > 15
                          ? "text-warning-dark"
                          : "text-danger-dark"
                      }`}
                    >
                      {producto.stock}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-medium">{producto.precio}</td>
                  <td className="py-4 px-6 flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleEditar(producto.id)}
                      className="bg-accent-default text-white px-4 py-2 rounded-md hover:bg-accent-dark transition"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEliminar(producto.id)}
                      className="bg-danger-default text-white px-4 py-2 rounded-md hover:bg-danger-dark transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}