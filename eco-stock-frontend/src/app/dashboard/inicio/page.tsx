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