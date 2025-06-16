"use client";
import { useState, useEffect } from "react";
import HeaderSection from "@/components/dashboard/header-section";
import QuickAccessCard from "@/components/dashboard/quick-access-card";
import NotificationItem from "@/components/dashboard/notification-item";
import Link from "next/link";

// Componente para métricas del inventario
interface InventoryMetricProps {
  title: string;
  value: string;
  unit: string;
}

const InventoryMetric: React.FC<InventoryMetricProps> = ({
  title,
  value,
  unit,
}) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
    <div className="flex items-baseline">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      <span className="ml-2 text-sm text-gray-500">{unit}</span>
    </div>
  </div>
);

// Componente para productos próximos a vencer
interface ExpiringProductProps {
  name: string;
  quantity: string;
  daysToExpiry: number;
  severity: "high" | "medium" | "low";
}

const ExpiringProduct: React.FC<ExpiringProductProps> = ({
  name,
  quantity,
  daysToExpiry,
  severity,
}) => {
  const severityColors = {
    high: "border-red-200 bg-red-50",
    medium: "border-yellow-200 bg-yellow-50",
    low: "border-green-200 bg-green-50",
  };

  return (
    <div className={`p-3 rounded-lg border ${severityColors[severity]} mb-2`}>
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{quantity}</p>
        </div>
        <div className="text-right">
          <span
            className={`text-sm font-medium ${
              severity === "high"
                ? "text-red-600"
                : severity === "medium"
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {daysToExpiry} días
          </span>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard(): JSX.Element {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}`;
  const dateString = currentTime.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Datos del inventario de insumos agrícolas
  const inventoryMetrics = [
    { title: "Total Productos", value: "327", unit: "items", trend: "up" },
    { title: "Total Categorías", value: "4", unit: "categorías", trend: "up" },
    { title: "Productos a Vencer", value: "8", unit: "items", trend: "down" },
    { title: "Rotación Promedio", value: "22", unit: "días", trend: "stable" },
  ];

  const expiringProducts = [
    {
      name: "Glifosato 48%",
      quantity: "25 litros",
      daysToExpiry: 3,
      severity: "high" as const,
    },
    {
      name: "Semilla Maíz Híbrido ICA V-305",
      quantity: "15 bolsas",
      daysToExpiry: 5,
      severity: "high" as const,
    },
    {
      name: "Insecticida Cipermetrina 25%",
      quantity: "40 litros",
      daysToExpiry: 12,
      severity: "medium" as const,
    },
    {
      name: "Fertilizante Triple 15",
      quantity: "80 sacos",
      daysToExpiry: 18,
      severity: "medium" as const,
    },
    {
      name: "Sulfato de Potasio",
      quantity: "60 sacos",
      daysToExpiry: 25,
      severity: "low" as const,
    },
  ];

  const notifications = [
    {
      title: "Stock Bajo",
      message: "Semilla Maíz Híbrido por debajo del mínimo establecido",
      time: "hace 30 min",
      type: "warning",
    },
    {
      title: "Nuevo Lote Recibido",
      message: "100 sacos de Urea Granulada 46% ingresados al inventario",
      time: "hace 1 hora",
      type: "success",
    },
    {
      title: "Vencimiento Próximo",
      message: "Lote de Glifosato vence en las próximas 48 horas",
      time: "hace 2 horas",
      type: "error",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <HeaderSection timeString={timeString} dateString={dateString} />

        {/* Métricas del Inventario */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Resumen del Inventario
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {inventoryMetrics.map((metric, index) => (
              <InventoryMetric key={index} {...metric} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Accesos Rápidos */}
          <section className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Accesos Rápidos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <QuickAccessCard
                title="Registrar Insumo"
                icon="package"
                href="/dashboard/productos/detalles-productos"
                color="primary"
              />
              <QuickAccessCard
                title="Nuevo Proveedor"
                icon="truck"
                href="/dashboard/entidades/proveedores"
                color="accent"
              />
              <QuickAccessCard
                title="Generar Reporte"
                icon="bar-chart"
                href="/dashboard/reportes/stock-categoria"
                color="heading"
              />
              <QuickAccessCard
                title="Inventario Actual"
                icon="clipboard"
                href="/dashboard/inventario/detalles-inventario"
                color="muted"
              />
            </div>

            {/* Productos Próximos a Vencer */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Productos Próximos a Vencer
              </h3>
              <div className="space-y-2">
                {expiringProducts.map((product, index) => (
                  <ExpiringProduct key={index} {...product} />
                ))}
              </div>
              <Link
                href="/dashboard/productos/proximos-vencimientos"
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors block text-center"
              >
                Ver Todos los Productos
              </Link>
            </div>
          </section>

          {/* Notificaciones */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Notificaciones
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                {notifications.map((notification, index) => (
                  <NotificationItem
                    key={index}
                    title={notification.title}
                    description={notification.message} // adaptado
                    date={notification.time} // adaptado
                    type={notification.type}
                  />
                ))}
              </div>
            </div>

            {/* Widget del Clima */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Condiciones Climáticas
              </h3>
              <div className="text-center">
                <div className="text-3xl mb-2">🌤️</div>
                <div className="text-2xl font-bold text-gray-900">28°C</div>
                <div className="text-sm text-gray-600">
                  Parcialmente Nublado
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  <div>Humedad: 72%</div>
                  <div>Viento: 8 km/h</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  ✅ Condiciones adecuadas para almacenamiento de insumos
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
