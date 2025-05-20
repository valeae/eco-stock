'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Producto } from "@/types/product";

// Simulación de datos recibidos (ejemplo)
const productoInicial: Producto = {
  id: 1,
  nombre: "Abono natural",
  cantidad: "50 Kg",
  proveedor: "AgroCampo",
  descripcion: "Abono orgánico ideal para cultivos de hortalizas.",
  fechaVencimiento: "2025-10-15",
};

export default function EditarProducto() {
  const router = useRouter();
  const [producto, setProducto] = useState<Omit<Producto, "id">>({
    nombre: productoInicial.nombre,
    cantidad: productoInicial.cantidad,
    proveedor: productoInicial.proveedor,
    descripcion: productoInicial.descripcion,
    fechaVencimiento: productoInicial.fechaVencimiento,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProducto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Producto actualizado:", producto);
    // Aquí iría una llamada a la API para actualizar el producto
    router.push("/productos");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-ecoLight">
      <div className="bg-white rounded-2xl shadow-md flex w-full max-w-4xl overflow-hidden">
        {/* Formulario */}
        <div className="w-full p-10 space-y-6">
          <h2 className="text-3xl font-bold text-heading-dark mb-4">Editar Producto</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="nombre" className="block text-heading-light mb-1">Nombre del producto</label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                value={producto.nombre}
                onChange={handleChange}
                required
                className="w-full rounded-md bg-primary-dark text-white p-3 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="cantidad" className="block text-heading-light mb-1">Cantidad</label>
              <input
                id="cantidad"
                type="text"
                name="cantidad"
                value={producto.cantidad}
                onChange={handleChange}
                required
                className="w-full rounded-md bg-primary-dark text-white p-3 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="proveedor" className="block text-heading-light mb-1">Proveedor</label>
              <input
                id="proveedor"
                type="text"
                name="proveedor"
                value={producto.proveedor}
                onChange={handleChange}
                required
                className="w-full rounded-md bg-primary-dark text-white p-3 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-heading-light">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={producto.descripcion}
                onChange={handleChange}
                rows={4}
                required
                className="w-full rounded-md bg-primary-dark text-white p-3 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label htmlFor="fechaVencimiento" className="block text-heading-light mb-1">Fecha de vencimiento</label>
              <input
                id="fechaVencimiento"
                type="date"
                name="fechaVencimiento"
                value={producto.fechaVencimiento}
                onChange={handleChange}
                required
                className="w-full rounded-md bg-primary-dark text-white p-3 focus:outline-none"
              />
            </div>

            <div className="flex justify-start">
              <button
                type="submit"
                className="bg-primary text-white font-semibold py-2 px-6 rounded-md shadow hover:bg-muted-light transition"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}