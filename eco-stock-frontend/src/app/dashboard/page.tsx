"use client";

import { useState, useEffect } from "react";
import HeaderSection from "@/components/dashboard/header-section";
import QuickAccessCard from "@/components/dashboard/quick-access-card";
import NotificationItem from "@/components/dashboard/notification-item";

export default function Dashboard() {
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

  return (
    <div title="Dashboard - EcoStock">
      <HeaderSection timeString={timeString} dateString={dateString} />

      <div className="bg-white p-6 rounded-lg shadow-sm border border-muted-light mb-6">
        <h3 className="text-lg font-medium text-heading-DEFAULT mb-4">
          Accesos Rápidos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAccessCard
            title="Registrar Producto"
            icon="package"
            href="/registro/nuevo-producto"
            color="primary"
          />
          <QuickAccessCard
            title="Nuevo Proveedor"
            icon="truck"
            href="/proveedores/nuevo"
            color="accent"
          />
          <QuickAccessCard
            title="Generar Reporte"
            icon="bar-chart"
            href="/reportes/generar"
            color="heading"
          />
          <QuickAccessCard
            title="Inventario Actual"
            icon="clipboard"
            href="/inventario"
            color="muted"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-muted-light">
        <h3 className="text-lg font-medium text-heading-DEFAULT mb-4">
          Notificaciones
        </h3>
        <div className="space-y-4">
          <NotificationItem
            title="Stock bajo de Fertilizante Orgánico"
            description="El producto ha alcanzado su nivel mínimo de inventario"
            date="Hoy, 15:30"
            type="warning"
          />
          <NotificationItem
            title="Nueva actualización disponible"
            description="Se han agregado nuevas funcionalidades al sistema"
            date="Ayer"
            type="info"
          />
          <NotificationItem
            title="Pago recibido de Agropecuaria El Futuro"
            description="Pago completado por $1,250,000"
            date="22/04/2025"
            type="success"
          />
        </div>
      </div>
    </div>
  );
}
