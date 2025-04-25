'use client';

import { useState } from "react";

export default function DetallesProductos() {
  const [showAll, setShowAll] = useState(false);

  const productos = [
    { name: "Fertilizante Orgánico", stock: 42, price: "$32,500" },
    { name: "Pesticida Ecológico", stock: 18, price: "$45,200" },
    { name: "Semillas de Maíz", stock: 65, price: "$12,800" },
    { name: "Abono Mineral", stock: 27, price: "$28,900" },
    { name: "Kit de Análisis de Suelo", stock: 8, price: "$76,500" }
  ];

  const itemsToShow = showAll ? productos : productos.slice(0, 5);

  return (
    <div className="bg-white border border-muted-DEFAULT rounded-xl shadow-md h-full overflow-hidden">
      <div className="bg-gradient-to-r from-primary-DEFAULT to-primary-dark text-white px-5 flex justify-between items-center">
        <h3 className="font-semibold tracking-wide">Detalles de Producto</h3>
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="text-xs underline hover:text-muted-light transition-colors"
        >
          {showAll ? "Ver menos" : "Ver todos"}
        </button>
      </div>

      <div>
        <table className="min-w-full table-auto text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-muted-light text-heading-DEFAULT">
              <th className="py-3 px-4 text-left font-semibold uppercase rounded-l-lg">Producto</th>
              <th className="py-3 px-4 text-center font-semibold uppercase">Stock</th>
              <th className="py-3 px-4 text-right font-semibold uppercase rounded-r-lg">Precio</th>
            </tr>
          </thead>
          <tbody className="text-heading-dark">
            {itemsToShow.map((item, index) => (
              <tr
                key={item.name}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-muted bg-opacity-20"
                } hover:bg-primary-DEFAULT hover:bg-opacity-10 transition-colors`}
              >
                <td className="py-3 px-4 text-heading-DEFAULT font-medium">{item.name}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`font-semibold ${
                      item.stock > 30
                        ? "text-success-DEFAULT"
                        : item.stock > 15
                        ? "text-warning-dark"
                        : "text-danger-dark"
                    }`}
                  >
                    {item.stock}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-heading-DEFAULT font-medium">
                  {item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
