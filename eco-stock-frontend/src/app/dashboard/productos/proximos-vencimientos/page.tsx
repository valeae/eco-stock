"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner";

//Components
import PageLayout from "@/components/shared/PageLayout";
import SearchAndActions from "@/components/shared/SearchAndActions";
import DataForm, { type FormField } from "@/components/shared/DataForm";
import DataTable, {
  type TableColumn,
  ExpirationDate,
} from "@/components/shared/DataTable";
import FilterButtons from "@/components/shared/FilterButtons";
import { exportToCSV } from "@/components/shared/ExportUtils";

//Hooks
import { useFormValidation } from "@/hooks/useFormValidation";

type Producto = {
  id: number;
  lote: string;
  nombre: string;
  cantidad: string;
  proveedor: string;
  fechaVencimiento: string;
  notificado: boolean;
};

const PRODUCTOS_EJEMPLO: Producto[] = [
  {
    id: 1,
    lote: "AB1",
    nombre: "Abono orgánico compostado",
    cantidad: "5",
    proveedor: "AgroNatur",
    fechaVencimiento: "2024-09-15",
    notificado: false,
  },
  {
    id: 2,
    lote: "FN2",
    nombre: "Fertilizante nitrogenado",
    cantidad: "3",
    proveedor: "FertiPlus",
    fechaVencimiento: "2024-10-01",
    notificado: false,
  },
  {
    id: 3,
    lote: "IN3",
    nombre: "Insecticida natural",
    cantidad: "2",
    proveedor: "BioAgro",
    fechaVencimiento: "2024-08-22",
    notificado: false,
  },
];

export default function CommingExpiration() {
  const [productos, setProductos] = useState<Producto[]>(PRODUCTOS_EJEMPLO);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [exportandoCSV, setExportandoCSV] = useState(false);

  const [formData, setFormData] = useState<Omit<Producto, "id" | "notificado">>(
    {
      lote: "",
      nombre: "",
      cantidad: "",
      proveedor: "",
      fechaVencimiento: "",
    }
  );

  const inputNombreRef = useRef<HTMLInputElement>(null);
  const { validateRequired } = useFormValidation();

  // Función para calcular el estado del producto
  const calcularEstadoProducto = (fechaVencimiento: string): string => {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia =
      (vencimiento.getTime() - hoy.getTime()) / (1000 * 3600 * 24);

    if (diferencia < 0) return "Vencido";
    if (diferencia <= 30) return "Próximo a vencer";
    return "Vigente";
  };

  // Alerta si productos vencen en los próximos 30 días o ya están vencidos
  useEffect(() => {
    const hoy = new Date();
    let hayNotificaciones = false;

    const nuevosProductos = productos.map((producto) => {
      const vencimiento = new Date(producto.fechaVencimiento);
      const diferencia =
        (vencimiento.getTime() - hoy.getTime()) / (1000 * 3600 * 24);

      if (!producto.notificado) {
        if (diferencia < 0) {
          // Producto vencido
          toast.error(`¡Producto "${producto.nombre}" está VENCIDO!`);
          hayNotificaciones = true;
          return { ...producto, notificado: true };
        }
        if (diferencia <= 30) {
          // Producto próximo a vencer
          toast.warning(`¡Producto "${producto.nombre}" está por vencer!`);
          hayNotificaciones = true;
          return { ...producto, notificado: true };
        }
      }
      return producto;
    });

    if (hayNotificaciones) {
      setProductos(nuevosProductos);
    }
  }, [productos]);

  // Configuración de filtros para el componente FilterButtons
  const getFilterOptions = (data: Producto[]) => [
    {
      key: "todos",
      label: "Todos",
      count: data.length,
      color: "bg-primary-dark",
    },
    {
      key: "proximos",
      label: "Próximos a vencer",
      count: data.filter(
        (p) => calcularEstadoProducto(p.fechaVencimiento) === "Próximo a vencer"
      ).length,
      color: "bg-warning-dark",
    },
    {
      key: "vencidos",
      label: "Vencidos",
      count: data.filter(
        (p) => calcularEstadoProducto(p.fechaVencimiento) === "Vencido"
      ).length,
      color: "bg-danger-dark",
    },
  ];

  // Filtros
  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.proveedor.toLowerCase().includes(busqueda.toLowerCase());

    const estadoProducto = calcularEstadoProducto(p.fechaVencimiento);
    const coincideEstado =
      filtroEstado === "todos" ||
      (filtroEstado === "proximos" && estadoProducto === "Próximo a vencer") ||
      (filtroEstado === "vencidos" && estadoProducto === "Vencido");

    return coincideBusqueda && coincideEstado;
  });

  const handleAgregarOEditar = () => {
    if (
      !validateRequired(formData, [
        "nombre",
        "cantidad",
        "proveedor",
        "fechaVencimiento",
      ])
    ) {
      return;
    }

    if (editandoId) {
      setProductos((prev) =>
        prev.map((p) =>
          p.id === editandoId ? { ...p, ...formData, notificado: false } : p
        )
      );
      toast.success("Producto actualizado");
      setEditandoId(null);
    } else {
      const nuevoProducto: Producto = {
        id: Date.now(),
        ...formData,
        notificado: false,
      };
      setProductos((prev) => [...prev, nuevoProducto]);
      toast.success("Producto agregado");
    }

    resetFormulario();
  };

  const resetFormulario = () => {
    setFormData({
      lote: "",
      nombre: "",
      cantidad: "",
      proveedor: "",
      fechaVencimiento: "",
    });
    setEditandoId(null);
    setFormVisible(false);
  };

  const handleEditar = (producto: Producto) => {
    setEditandoId(producto.id);
    setFormData({
      lote: producto.lote,
      nombre: producto.nombre,
      cantidad: producto.cantidad,
      proveedor: producto.proveedor,
      fechaVencimiento: producto.fechaVencimiento,
    });
    setFormVisible(true);
  };

  const handleEliminar = (producto: Producto) => {
    setProductos((prev) => prev.filter((p) => p.id !== producto.id));
    toast.info(`Producto eliminado: ${producto.nombre}`);
  };

  const exportarCSV = useCallback(() => {
    setExportandoCSV(true);

    setTimeout(() => {
      const headers = [
        "Lote",
        "Nombre",
        "Cantidad",
        "Proveedor",
        "Fecha de Vencimiento",
        "Estado",
      ];
      const success = exportToCSV(
        productosFiltrados,
        headers,
        "productos-vencimiento.csv"
      );

      if (success) toast.success("CSV exportado exitosamente");
      else toast.error("Error al exportar CSV");

      setExportandoCSV(false);
    }, 100);
  }, [productosFiltrados]);

  const formFields: FormField[] = [
    {
      key: "lote",
      type: "text",
      placeholder: "Lote",
      value: formData.lote,
      onChange: (val) =>
        setFormData((prev) => ({ ...prev, lote: String(val) })),
    },
    {
      key: "nombre",
      type: "text",
      placeholder: "Nombre",
      value: formData.nombre,
      onChange: (val) =>
        setFormData((prev) => ({ ...prev, nombre: String(val) })),
    },
    {
      key: "cantidad",
      type: "text",
      placeholder: "Cantidad",
      value: formData.cantidad,
      onChange: (val) =>
        setFormData((prev) => ({ ...prev, cantidad: String(val) })),
    },
    {
      key: "proveedor",
      type: "text",
      placeholder: "Proveedor",
      value: formData.proveedor,
      onChange: (val) =>
        setFormData((prev) => ({ ...prev, proveedor: String(val) })),
    },
    {
      key: "fechaVencimiento",
      type: "date",
      placeholder: "Fecha de vencimiento",
      value: formData.fechaVencimiento,
      onChange: (val) =>
        setFormData((prev) => ({ ...prev, fechaVencimiento: String(val) })),
    },
  ];

  const columns: TableColumn<Producto>[] = [
    { key: "lote", title: "Lote" },
    { key: "nombre", title: "Nombre" },
    { key: "cantidad", title: "Cantidad" },
    { key: "proveedor", title: "Proveedor" },
    {
      key: "fechaVencimiento",
      title: "Fecha de vencimiento",
      render: (value) => <ExpirationDate date={String(value)} />,
    },
  ];

  return (
    <PageLayout title="Próximos a Vencer">
      <SearchAndActions
        searchValue={busqueda}
        onSearchChange={setBusqueda}
        searchPlaceholder="Buscar por nombre o proveedor..."
        formVisible={formVisible}
        onToggleForm={() => setFormVisible(true)}
        onSave={handleAgregarOEditar}
        onCancel={resetFormulario}
        isEditing={!!editandoId}
        showExport
        onExport={exportarCSV}
        isExporting={exportandoCSV}
        showAddButton={false}
      />

      {/* Componente de filtros */}
      <FilterButtons
        data={productos}
        currentFilter={filtroEstado}
        onFilterChange={setFiltroEstado}
        getFilterOptions={getFilterOptions}
        className="mb-4"
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
        emptyMessage="No hay productos próximos a vencer."
      />
    </PageLayout>
  );
}
