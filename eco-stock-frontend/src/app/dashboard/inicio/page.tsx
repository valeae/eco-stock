import EnhancedStatsCard from "@/components/dashboard/enhanced-stats-card";
import ProductDetails from "./detalles-productos/page";
import TopProducts from "./top-productos/page";
import SalesOrder from "./orden-ventas/page";

export default function ActivitiesSectionEnhanced() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 border border-muted-DEFAULT">
      <h2 className="text-xl font-semibold text-heading-DEFAULT mb-4 pb-2 border-b border-muted-light">Actividades</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-6">
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <EnhancedStatsCard title="Total" value="100" type="total" period="Productos registrados" />
          <EnhancedStatsCard title="Stock" value="85" type="stock" period="Unidades disponibles" />
          <EnhancedStatsCard title="Salidas" value="15" type="salidas" period="Últimos 30 días" />
        </div>

        <div className="lg:col-span-4 bg-primary-ecoLight bg-opacity-30 rounded-lg p-3">
          <h3 className="text-sm font-medium text-heading-DEFAULT mb-2 pl-1">Detalles de Productos</h3>
          <div className="bg-white rounded-lg shadow-sm">
            <ProductDetails />
          </div>
        </div>

        <div className="lg:col-span-5 bg-primary-ecoLight bg-opacity-30 rounded-lg p-3">
          <h3 className="text-sm font-medium text-heading-DEFAULT mb-2 pl-1">Productos Principales</h3>
          <div className="bg-white rounded-lg shadow-sm">
            <TopProducts />
          </div>
        </div>
      </div>

      <div className="bg-primary-ecoLight bg-opacity-30 rounded-lg p-3">
        <h3 className="text-sm font-medium text-heading-DEFAULT mb-2 pl-1">Órdenes de Venta</h3>
        <div className="bg-white rounded-lg shadow-sm">
          <SalesOrder />
        </div>
      </div>
    </div>
  );
}