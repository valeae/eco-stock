import { TrendingUp } from "lucide-react";

//components
import ProductRatingItem from "@/components/dashboard/product-rating-item";

export default function TopProductos() {
  return (
    <div className="bg-white border border-muted-DEFAULT rounded-lg shadow-sm h-full overflow-hidden">
      <div className="bg-gradient-to-r from-primary-DEFAULT to-primary-dark text-white px-4 flex justify-between items-center">
        <h3 className="font-medium">Top de productos</h3>
        <TrendingUp size={18} />
      </div>
      <div className="p-0">
        {[
          { name: "Fertilizantes", rating: 4, sales: "$2,345,000", percent: 28 },
          { name: "Pesticidas", rating: 3, sales: "$1,876,200", percent: 22 },
          { name: "Semillas", rating: 2, sales: "$985,500", percent: 12 },
          { name: "Abonos", rating: 3, sales: "$876,300", percent: 10 },
          { name: "Herramientas", rating: 4, sales: "$654,200", percent: 8 }
        ].map((item) => (
          <ProductRatingItem key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}