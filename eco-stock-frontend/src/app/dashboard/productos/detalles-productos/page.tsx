// pages/DetallesProductosPage.tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

// Components
import PageLayout from "@/components/shared/PageLayout";
import SearchAndActions from "@/components/shared/SearchAndActions";
import DataForm, { type FormField } from "@/components/shared/DataForm";
import DataTable, {
  type TableColumn,
  StatusBadge,
} from "@/components/shared/DataTable";
import { exportToCSV } from "@/components/shared/ExportUtils";

// Hooks
import { useFormValidation } from "@/hooks/useFormValidation";

// Types and mocks
import { PRODUCTOS_EJEMPLO } from "@/mocks/productos";
import { type ProductoDetalle } from "@/types/producto";

export default function DetallesProductosPage() {
  const [productos, setProductos] = useState<ProductoDetalle[]>(PRODUCTOS_EJEMPLO);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [exportandoCSV, setExportandoCSV] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    stock: 0,
    estado: "",
  });

  const inputNombreRef = useRef<HTMLInputElement>(null);
  const { validateRequired, validateUnique } = useFormValidation();

  // Alerta de stock bajo
  useEffect(() => {
    for (const producto of productos) {
      if (producto.stock <= 10) {
        toast.error(`¡Stock bajo para "${producto.nombre}"!`, {
          duration: 4000,
        });
      }
    }
  }, [productos]);

  const handleAgregarOEditar = () => {
    if (!validateRequired(formData, ["nombre", "descripcion", "estado"])) {
      return;
    }

    if (formData.stock < 0) {
      toast.error("El stock no puede ser negativo");
      return;
    }

    if (
      !validateUnique(
        productos,
        formData.nombre,
        "nombre",
        editandoId,
        "Producto ya existe"
      )
    ) {
      return;
    }

    if (editandoId) {
      setProductos((prev) =>
        prev.map((p) => (p.id === editandoId ? { ...p, ...formData } : p))
      );
      toast.success("Producto actualizado");
      setEditandoId(null);
    } else {
      const nuevoProducto: ProductoDetalle = {
        id: Date.now(),
        ...formData,
      };
      setProductos((prev) => [...prev, nuevoProducto]);
      toast.success("Producto agregado");
    }

    resetFormulario();
  };

  const resetFormulario = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      stock: 0,
      estado: "",
    });
    setFormVisible(false);
    setEditandoId(null);
  };

  const handleEditar = (producto: ProductoDetalle) => {
    setEditandoId(producto.id);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      stock: producto.stock,
      estado: producto.estado,
    });
    setFormVisible(true);
  };

  const handleEliminar = (producto: ProductoDetalle) => {
    setProductos((prev) => prev.filter((p) => p.id !== producto.id));
    toast.info(`Producto eliminado: ${producto.nombre}`);
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const exportarCSV = useCallback(() => {
    setExportandoCSV(true);

    setTimeout(() => {
      const headers = ["Nombre", "Descripción", "Stock", "Estado"];
      const success = exportToCSV(
        productosFiltrados.map((p) => ({
          ...p,
          estado: p.estado === "Disponible" ? "Disponible" : "Agotado",
        })),
        headers,
        "productos-inventario.csv"
      );

      if (success) {
        toast.success("Archivo CSV generado correctamente");
      } else {
        toast.error("Error al generar el archivo CSV");
      }

      setExportandoCSV(false);
    }, 100);
  }, [productosFiltrados]);

  const formFields: FormField[] = [
    {
      key: "nombre",
      type: "text",
      placeholder: "Nombre",
      value: formData.nombre,
      onChange: (value) =>
        setFormData((prev) => ({ ...prev, nombre: String(value) })),
    },
    {
      key: "descripcion",
      type: "text",
      placeholder: "Descripción",
      value: formData.descripcion,
      onChange: (value) =>
        setFormData((prev) => ({ ...prev, descripcion: String(value) })),
    },
    {
      key: "stock",
      type: "number",
      placeholder: "Stock",
      value: formData.stock,
      onChange: (value) =>
        setFormData((prev) => ({ ...prev, stock: Number(value) || 0 })),
      min: 0,
    },
    {
      key: "estado",
      type: "select",
      placeholder: "Selecciona un estado",
      value: formData.estado,
      onChange: (value) =>
        setFormData((prev) => ({ ...prev, estado: String(value) })),
      options: [
        { value: "Disponible", label: "Disponible" },
        { value: "Agotado", label: "Agotado" },
        { value: "Bajo stock", label: "Bajo stock" },
        { value: "Desabilitado", label: "Desabilitado" },
      ],
    },
  ];

  const columns: TableColumn<ProductoDetalle>[] = [
    { key: "nombre", title: "Nombre" },
    { key: "descripcion", title: "Descripción" },
    {
      key: "stock",
      title: "Stock",
      render: (value, item) => (
        <span
          className={`font-medium ${
            item.stock <= 10 ? "text-warning-DEFAULT" : ""
          }`}
        >
          {String(value)}
        </span>
      ),
    },
    {
      key: "estado",
      title: "Estado",
      render: (value) => (
        <StatusBadge status={String(value)} variant="inventory" />
      ),
    },
  ];

  return (
    <PageLayout title="Detalles de Productos">
      <SearchAndActions
        searchValue={busqueda}
        onSearchChange={setBusqueda}
        searchPlaceholder="Buscar producto..."
        formVisible={formVisible}
        onToggleForm={() => setFormVisible(true)}
        onSave={handleAgregarOEditar}
        onCancel={resetFormulario}
        isEditing={!!editandoId}
        addButtonText="Agregar Producto"
        showExport={true}
        onExport={exportarCSV}
        isExporting={exportandoCSV}
      />

      <DataForm
        ref={inputNombreRef}
        title="producto"
        fields={formFields}
        visible={formVisible}
        isEditing={!!editandoId}
      />

      <DataTable
        data={productosFiltrados}
        columns={columns}
        onEdit={handleEditar}
        onDelete={handleEliminar}
        emptyMessage="No se encontraron productos."
        deleteModalConfig={{
          title: "Eliminar Producto",
          message: "¿Estás seguro de que deseas eliminar este producto?",
          getItemName: (product) => product.nombre
        }}
        className="mt-6"
      />
    </PageLayout>
  );
}