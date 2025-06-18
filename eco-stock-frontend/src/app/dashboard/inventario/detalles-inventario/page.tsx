"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

// Components
import PageLayout from "@/components/shared/PageLayout";
import SearchAndActions from "@/components/shared/SearchAndActions";
import DataTable, { type TableColumn } from "@/components/shared/DataTable";
import { exportToCSV } from "@/components/shared/ExportUtils";

// Types and mocks
import { INVENTARIO_EJEMPLO } from "@/mocks/inventario-detalles";
import { type InventarioDetalle } from "@/types/inventario-detalle";

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