// Detalles de Inventario: Información por producto (stock, precio, fecha actualizada).
// Mostrar la información detallada de cada producto en el inventario.
// Datos a mostrar por fila:
// 🏷️ Nombre del producto
// 🧾 Descripción
// 📦 Cantidad disponible
// 📅 Última actualización
// 📐 Unidad de medida
// 🧮 Categoría
// 👨‍🌾 Proveedores (si hay más de uno, puedes mostrarlo como un tooltip o lista)

"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

// Components
import PageLayout from "@/components/shared/PageLayout";
import SearchAndActions from "@/components/shared/SearchAndActions";
import DataTable, { type TableColumn } from "@/components/shared/DataTable";
import { exportToCSV } from "@/components/shared/ExportUtils";

type InventarioDetalle = {
  id: number;
  nombre: string;
  descripcion: string;
  cantidadDisponible: number;
  fechaActualizacion: string;
  unidadMedida: string;
  categoria: string;
  proveedores: string[];
};

const INVENTARIO_EJEMPLO: InventarioDetalle[] = [
  {
    id: 1,
    nombre: "Fertilizante Orgánico",
    descripcion: "Mejora la fertilidad del suelo",
    cantidadDisponible: 42,
    fechaActualizacion: "2023-01-01",
    unidadMedida: "Kg",
    categoria: "Alimentos",
    proveedores: ["Juan Perez", "Carlos Perez"],
  },
  {
    id: 2,
    nombre: "Pesticida Ecológico",
    descripcion: "Controla plagas de forma natural",
    cantidadDisponible: 18,
    fechaActualizacion: "2023-01-02",
    unidadMedida: "Kg",
    categoria: "Alimentos",
    proveedores: ["Ana Gómez"],
  },
  {
    id: 3,
    nombre: "Semillas de Maíz",
    descripcion: "Variedad resistente a sequías",
    cantidadDisponible: 65,
    fechaActualizacion: "2023-01-03",
    unidadMedida: "Kg",
    categoria: "Alimentos",
    proveedores: ["Carlos Perez", "Lucía Torres"],
  },
];

const columns: TableColumn<InventarioDetalle>[] = [
  { key: "nombre", title: "Producto" },
  { key: "descripcion", title: "Descripción" },
  { key: "cantidadDisponible", title: "Cantidad", align: "center" },
  { key: "fechaActualizacion", title: "Última actualización", align: "center" },
  { key: "unidadMedida", title: "Unidad", align: "center" },
  { key: "categoria", title: "Categoría" },
  {
    key: "proveedores",
    title: "Proveedores",
    render: (value, row) => (
      <div className="space-y-1">
        {row.proveedores.map((proveedor) => (
          <div key={`${row.id}-${proveedor}`} className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
            {proveedor}
          </div>
        ))}
        {row.proveedores.length === 0 && (
          <span className="text-gray-500 text-sm">Sin proveedor</span>
        )}
      </div>
    ),
  },
];

export default function DetallesInventarioPage() {
  const [inventario] = useState<InventarioDetalle[]>(INVENTARIO_EJEMPLO);
  const [busqueda, setBusqueda] = useState("");
  const [exportandoCSV, setExportandoCSV] = useState(false);

  const inventarioFiltrados = inventario.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const exportarCSV = useCallback(() => {
    setExportandoCSV(true);

    setTimeout(() => {
      const headers = [
        "Nombre",
        "Descripción",
        "Cantidad",
        "Fecha Actualización",
        "Unidad",
        "Categoría",
        "Proveedores",
      ];

      const dataToExport = inventarioFiltrados.map((item) => ({
        Nombre: item.nombre,
        Descripcion: item.descripcion,
        Cantidad: item.cantidadDisponible,
        "Fecha Actualizacion": item.fechaActualizacion,
        Unidad: item.unidadMedida,
        Categoria: item.categoria,
        Proveedores: item.proveedores.join(", "),
      }));

      const success = exportToCSV(
        dataToExport,
        headers,
        "inventario.csv"
      );

      if (success) {
        toast.success("Archivo CSV generado exitosamente");
      } else {
        toast.error("Error al generar CSV");
      }

      setExportandoCSV(false);
    }, 1000);
  }, [inventarioFiltrados]);

  return (
    <PageLayout title="Detalle de Inventario">
      <SearchAndActions
        searchValue={busqueda}
        onSearchChange={setBusqueda}
        searchPlaceholder="Buscar producto..."
        formVisible={false}
        onToggleForm={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        isEditing={false}
        showExport={true}
        onExport={exportarCSV}
        isExporting={exportandoCSV}
        showAddButton={false}
      />

      <DataTable
        data={inventarioFiltrados}
        columns={columns}
        emptyMessage="No se encontraron productos."
      />
    </PageLayout>
  );
}