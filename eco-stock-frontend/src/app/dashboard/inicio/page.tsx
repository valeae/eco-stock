import EnhancedStatsCard from "@/components/dashboard/enhanced-stats-card";
import InfoCard from "@/components/dashboard/info-card";

export default function ActivitiesSectionEnhanced() {
  const productoMasPuntuado = "Fertilizantes ⭐⭐⭐⭐";
  const stockBajo = "Kit de Análisis de Suelo (8 unidades)";
  const productoProximoAVencer = "Pesticida Ecológico";

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm space-y-8">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-3">Panel de Resumen</h2>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EnhancedStatsCard
          title="Total"
          value="100"
          type="total"
          period="Productos registrados"
        />
        <EnhancedStatsCard
          title="Stock"
          value="85"
          type="stock"
          period="Unidades disponibles"
        />
        <EnhancedStatsCard
          title="Salidas"
          value="15"
          type="salidas"
          period="Últimos 30 días"
        />
      </div>

      {/* Info cards */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Alertas y destacados</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard title="Producto más puntuado" description={productoMasPuntuado} />
          <InfoCard title="Stock bajo" description={stockBajo} />
          <InfoCard title="Próximo a vencer" description={productoProximoAVencer} />
        </div>
      </div>
    </section>
  );
}

  // // Estadísticas del inventario
  // const totalProductos = productos.length;
  // const productosActivos = productos.filter(p => p.estadoInventario === "activo").length;
  // const productosInactivos = productos.filter(p => p.estadoInventario === "inactivo").length;
  // const stockTotalGeneral = productos.reduce((acc, p) => acc + p.stockTotal, 0);
  // const stockDisponibleGeneral = productos.reduce((acc, p) => acc + p.stockDisponible, 0);

  // {/* Estadísticas generales */}
  // <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
  // <div className="bg-white p-4 rounded-lg shadow-md text-center">
  //   <p className="text-sm text-gray-600">Total Productos</p>
  //   <p className="text-2xl font-bold text-gray-800">{totalProductos}</p>
  // </div>
  // <div className="bg-white p-4 rounded-lg shadow-md text-center">
  //   <p className="text-sm text-gray-600">Productos Activos</p>
  //   <p className="text-2xl font-bold text-green-600">{productosActivos}</p>
  // </div>
  // <div className="bg-white p-4 rounded-lg shadow-md text-center">
  //   <p className="text-sm text-gray-600">Productos Inactivos</p>
  //   <p className="text-2xl font-bold text-red-600">{productosInactivos}</p>
  // </div>
  // <div className="bg-white p-4 rounded-lg shadow-md text-center">
  //   <p className="text-sm text-gray-600">Stock Total</p>
  //   <p className="text-2xl font-bold text-blue-600">{stockTotalGeneral}</p>
  // </div>
  // <div className="bg-white p-4 rounded-lg shadow-md text-center">
  //   <p className="text-sm text-gray-600">Stock Disponible</p>
  //   <p className="text-2xl font-bold text-purple-600">{stockDisponibleGeneral}</p>
  // </div>