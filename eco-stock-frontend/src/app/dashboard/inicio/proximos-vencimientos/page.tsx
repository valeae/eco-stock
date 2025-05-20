'use client';

import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import type { Producto } from "@/types/product";

export default function CommingExpiration() {
  const [productos] = useState<Producto[]>([
    {
      id: 1,
      nombre: "Fertilizante Orgánico",
      cantidad: "100 litros",
      proveedor: "Cultivos Verdes S.A.S.",
      descripcion: "Ideal para cultivos de hortalizas, mejora la fertilidad del suelo.",
      fechaVencimiento: "2025-05-20",
    },
    {
      id: 2,
      nombre: "Abono Nitrogenado",
      cantidad: "50 kg",
      proveedor: "AgroColombia",
      descripcion: "Aumenta el crecimiento de las plantas.",
      fechaVencimiento: "2025-06-30",
    },
  ]);

  useEffect(() => {
    const hoy = new Date();
    const umbralDias = 15;

    for (const producto of productos) {
      const vencimiento = new Date(producto.fechaVencimiento);
      const diffTiempo = vencimiento.getTime() - hoy.getTime();
      const diffDias = diffTiempo / (1000 * 60 * 60 * 24);

      if (diffDias > 0 && diffDias <= umbralDias) {
        toast.error(
          `¡"${producto.nombre}" vence en ${Math.ceil(diffDias)} día(s)!`,
          { duration: 5000 }
        );
      }
    }
  }, [productos]);


  return (
    <div className="min-h-screen flex flex-col items-center bg-primary-ecoLight p-10">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold text-heading-dark mb-8">Próximos Vencimientos</h2>

      <div className="overflow-x-auto w-full max-w-6xl bg-white shadow-md rounded-xl">
        <table className="min-w-full table-auto">
          <thead className="bg-primary-dark text-white">
            <tr>
              <th className="py-4 px-6 text-left">Nombre</th>
              <th className="py-4 px-6 text-left">Cantidad</th>
              <th className="py-4 px-6 text-left">Proveedor</th>
              <th className="py-4 px-6 text-left">Descripción</th>
              <th className="py-4 px-6 text-center">Fecha de Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr
                key={producto.id}
                className="border-b border-muted-default hover:bg-muted-light transition"
              >
                <td className="py-4 px-6">{producto.nombre}</td>
                <td className="py-4 px-6">{producto.cantidad}</td>
                <td className="py-4 px-6">{producto.proveedor}</td>
                <td className="py-4 px-6">{producto.descripcion}</td>
                <td className="py-4 px-6 text-center font-medium">
                  {new Date(producto.fechaVencimiento).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}