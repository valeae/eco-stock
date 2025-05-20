"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Producto } from "@/types/product";

export default function CrearProducto() {
  const router = useRouter();
  const [producto, setProducto] = useState<Omit<Producto, "id">>({
    nombre: "",
    cantidad: "",
    proveedor: "",
    descripcion: "",
    fechaVencimiento: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProducto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Producto registrado:", producto);
    // Aquí puedes hacer una llamada a tu API para guardar el producto
    router.push("/productos");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-ecoLight ">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-4xl p-10 space-y-6">
        <h2 className="text-3xl font-bold text-heading-dark mb-4">
          Registrar Producto
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="nombre" className="block text-heading-light mb-1">
              Nombre del producto
            </label>
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
            <label htmlFor="cantidad" className="block text-heading-light mb-1">
              Cantidad
            </label>
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
            <label
              htmlFor="proveedor"
              className="block text-heading-light mb-1"
            >
              Proveedor
            </label>
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
            <label
              htmlFor="descripcion"
              className="block text-heading-light mb-1"
            >
              Descripción
            </label>
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
            <label
              htmlFor="fechaVencimiento"
              className="block text-heading-light mb-1"
            >
              Fecha de vencimiento
            </label>
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
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
