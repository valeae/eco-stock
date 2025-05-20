'use client';

import { TrendingUp } from "lucide-react";
import { useState } from "react";

//components
import ProductRatingItem from "@/components/dashboard/product-rating-item";

export default function TopProducts() {
  const [raiting] = useState([
    { name: "Fertilizantes", rating: 4, sales: "$2,345,000", percent: 28 },
    { name: "Pesticidas", rating: 3, sales: "$1,876,200", percent: 22 },
    { name: "Semillas", rating: 2, sales: "$985,500", percent: 12 },
    { name: "Abonos", rating: 3, sales: "$876,300", percent: 10 },
    { name: "Herramientas", rating: 4, sales: "$654,200", percent: 8 }
  ]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-primary-ecoLight p-10">
      <h2 className="text-3xl font-bold text-heading-dark mb-8">
        Top de productos
      </h2>

    <div className="overflow-x-auto w-full max-w-6xl bg-white shadow-md rounded-xl">
      <div className="bg-primary-dark text-white p-4 flex justify-between items-center">
        <h3 className="font-semibold text-lg">Top de productos</h3>
        <TrendingUp size={18} />
      </div>
      <div className="p-0">
        {raiting.map((item) => (
          <ProductRatingItem key={item.name} {...item} />
        ))}
      </div>
    </div>
    </div>
  );
}