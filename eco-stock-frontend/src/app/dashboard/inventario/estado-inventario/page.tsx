"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";

//Components
import PageLayout from "@/components/shared/PageLayout";
import SearchAndActions from "@/components/shared/SearchAndActions";
import DataForm, { type FormField } from "@/components/shared/DataForm";
import DataTable, {
  type TableColumn,
  StatusBadge,
} from "@/components/shared/DataTable";
import { exportToCSV } from "@/components/shared/ExportUtils";
import FilterButtons from "@/components/shared/FilterButtons";

//Hooks
import { useFormValidation } from "@/hooks/useFormValidation";

interface ProductoInventario extends Record<string, unknown> {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  stockDisponible: number;
  estadoInventario: "activo" | "inactivo" | "suspendido";
}

type FiltroCompleto = "todos" | "activo" | "inactivo" | "suspendido";

const PRODUCTOS_EJEMPLO: ProductoInventario[] = [
  {
    id: 1,
    codigo: "PROD001",
    nombre: "Producto Alpha",
    categoria: "Electrónicos",
    stockDisponible: 150,
    estadoInventario: "activo",
  },
  {
    id: 2,
    codigo: "PROD002",
    nombre: "Producto Beta",
    categoria: "Hogar",
    stockDisponible: 75,
    estadoInventario: "activo",
  },
  {
    id: 3,
    codigo: "PROD003",
    nombre: "Producto Gamma",
    categoria: "Deportes",
    stockDisponible: 0,
    estadoInventario: "inactivo",
  },
  {
    id: 4,
    codigo: "PROD004",
    nombre: "Producto Delta",
    categoria: "Ropa",
    stockDisponible: 25,
    estadoInventario: "suspendido",
  },
];

export default function ListadoInventario() {
  const [productos, setProductos] =
    useState<ProductoInventario[]>(PRODUCTOS_EJEMPLO);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [exportandoCSV, setExportandoCSV] = useState(false);

  const [filtroActivo, setFiltroActivo] = useState<FiltroCompleto>("todos");

  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    categoria: "",
    stockDisponible: 0,
    estadoInventario: "",
  });

  const inputCodigoRef = useRef<HTMLInputElement>(null);
  const { validateRequired, validateUnique } = useFormValidation();

  const getFilterOptions = useCallback((data: ProductoInventario[]) => {
    const total = data.length;
    const totalActivos = data.filter(
      (p) => p.estadoInventario === "activo"
    ).length;
    const totalInactivos = data.filter(
      (p) => p.estadoInventario === "inactivo"
    ).length;
    const totalSuspendidos = data.filter(
      (p) => p.estadoInventario === "suspendido"
    ).length;

    return [
      { key: "todos", label: "Todos", count: total, color: "bg-primary" },
      {
        key: "activo",
        label: "Activos",
        count: totalActivos,
        color: "bg-info-dark",
      },
      {
        key: "inactivo",
        label: "Inactivos",
        count: totalInactivos,
        color: "bg-danger-dark",
      },
      {
        key: "suspendido",
        label: "Suspendidos",
        count: totalSuspendidos,
        color: "bg-warning-dark",
      },
    ];
  }, []);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const coincideBusqueda =
        p.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.categoria.toLowerCase().includes(busqueda.toLowerCase());

      let coincideFiltro = true;
      switch (filtroActivo) {
        case "activo":
          coincideFiltro = p.estadoInventario === "activo";
          break;
        case "inactivo":
          coincideFiltro = p.estadoInventario === "inactivo";
          break;
        case "suspendido":
          coincideFiltro = p.estadoInventario === "suspendido";
          break;
        default:
          coincideFiltro = true;
      }

      return coincideBusqueda && coincideFiltro;
    });
  }, [productos, busqueda, filtroActivo]);

  const handleAgregarOEditar = () => {
    if (
      !validateRequired(formData, [
        "codigo",
        "nombre",
        "categoria",
        "stockDisponible",
        "estadoInventario",
      ])
    ) {
      return;
    }

    if (formData.stockDisponible < 0) {
      toast.error("El stock no puede ser negativo");
      return;
    }

    if (
      !validateUnique(
        productos,
        formData.codigo,
        "codigo",
        editandoId,
        "Ya existe un producto con este código"
      )
    ) {
      return;
    }

    if (
      !validateUnique(
        productos,
        formData.nombre,
        "nombre",
        editandoId,
        "Ya existe un producto con este nombre"
      )
    ) {
      return;
    }

    if (editandoId) {
      setProductos((prev) =>
        prev.map((p) =>
          p.id === editandoId
            ? {
                ...p,
                ...formData,
                estadoInventario: formData.estadoInventario as
                  | "activo"
                  | "inactivo"
                  | "suspendido",
              }
            : p
        )
      );
      toast.success("Producto actualizado correctamente");
      setEditandoId(null);
    } else {
      const nuevoProducto: ProductoInventario = {
        id: Date.now(),
        ...formData,
        estadoInventario: formData.estadoInventario as
          | "activo"
          | "inactivo"
          | "suspendido",
      };
      setProductos((prev) => [...prev, nuevoProducto]);
      toast.success("Producto agregado correctamente");
    }

    resetFormulario();
  };

  const resetFormulario = () => {
    setFormData({
      codigo: "",
      nombre: "",
      categoria: "",
      stockDisponible: 0,
      estadoInventario: "",
    });
    setFormVisible(false);
    setEditandoId(null);
  };

  const handleEditar = (producto: ProductoInventario) => {
    setEditandoId(producto.id);
    setFormData({
      codigo: producto.codigo,
      nombre: producto.nombre,
      categoria: producto.categoria,
      stockDisponible: producto.stockDisponible,
      estadoInventario: producto.estadoInventario,
    });
    setFormVisible(true);
  };

  const handleEliminar = (producto: ProductoInventario) => {
    setProductos((prev) => prev.filter((p) => p.id !== producto.id));
    toast.info(`Producto eliminado: ${producto.nombre}`);
  };

  const handleCambiarEstado = (producto: ProductoInventario) => {
    let nuevoEstado: "activo" | "inactivo" | "suspendido";

    switch (producto.estadoInventario) {
      case "activo":
        nuevoEstado = "inactivo";
        break;
      case "inactivo":
        nuevoEstado = "suspendido";
        break;
      case "suspendido":
        nuevoEstado = "activo";
        break;
      default:
        nuevoEstado = "activo";
    }

    setProductos((prev) =>
      prev.map((p) =>
        p.id === producto.id ? { ...p, estadoInventario: nuevoEstado } : p
      )
    );
    toast.success(`Producto ${producto.nombre} marcado como ${nuevoEstado}`);
  };

  const exportarCSV = useCallback(() => {
    setExportandoCSV(true);

    setTimeout(() => {
      const headers = [
        "Código",
        "Nombre",
        "Categoría",
        "Stock Disponible",
        "Estado Inventario",
      ];
      const fileName = `inventario_${filtroActivo}_${
        new Date().toISOString().split("T")[0]
      }.csv`;

      const success = exportToCSV(productosFiltrados, headers, fileName);

      if (success) {
        toast.success(
          `Archivo CSV generado correctamente (${productosFiltrados.length} registros)`
        );
      } else {
        toast.error("Error al generar el archivo CSV");
      }

      setExportandoCSV(false);
    }, 100);
  }, [productosFiltrados, filtroActivo]);

  const formFields: FormField[] = [
    {
      key: "codigo",
      type: "text",
      placeholder: "Código del producto",
      value: formData.codigo,
      onChange: (value) =>
        setFormData((prev) => ({ ...prev, codigo: String(value) })),
    },
    {
      key: "nombre",
      type: "text",
      placeholder: "Nombre del producto",
      value: formData.nombre,
      onChange: (value) =>
        setFormData((prev) => ({ ...prev, nombre: String(value) })),
    },
    {
      key: "categoria",
      type: "text",
      placeholder: "Categoría del producto",
      value: formData.categoria,
      onChange: (value) =>
        setFormData((prev) => ({ ...prev, categoria: String(value) })),
    },
    {
      key: "stockDisponible",
      type: "number",
      placeholder: "Stock disponible",
      value: formData.stockDisponible,
      onChange: (value) =>
        setFormData((prev) => ({
          ...prev,
          stockDisponible: Number(value) || 0,
        })),
      min: 0,
    },
    {
      key: "estadoInventario",
      type: "select",
      placeholder: "Selecciona el estado",
      value: formData.estadoInventario,
      onChange: (value) =>
        setFormData((prev) => ({ ...prev, estadoInventario: String(value) })),
      options: [
        { value: "activo", label: "Activo" },
        { value: "inactivo", label: "Inactivo" },
        { value: "suspendido", label: "Suspendido" },
      ],
    },
  ];

  const columns: TableColumn<ProductoInventario>[] = [
    { key: "codigo", title: "Código" },
    { key: "nombre", title: "Nombre" },
    { key: "categoria", title: "Categoría" },
    { key: "stockDisponible", title: "Stock" },
    {
      key: "estadoInventario",
      title: "Estado",
      render: (value) => (
        <StatusBadge status={String(value)} variant="inventory" />
      ),
    },
  ];

  return (
    <PageLayout title="Inventario">
      <SearchAndActions
        searchValue={busqueda}
        onSearchChange={setBusqueda}
        searchPlaceholder="Buscar por código, nombre o categoría..."
        formVisible={formVisible}
        onToggleForm={() => setFormVisible(true)}
        onSave={handleAgregarOEditar}
        onCancel={resetFormulario}
        isEditing={!!editandoId}
        addButtonText={editandoId ? "Actualizar" : "Agregar Producto"}
        showExport={true}
        onExport={exportarCSV}
        isExporting={exportandoCSV}
      />

      <DataForm
        ref={inputCodigoRef}
        title={editandoId ? "Editar producto" : "Nuevo producto"}
        fields={formFields}
        visible={formVisible}
        isEditing={!!editandoId}
      />

      <div className="mb-6">
        <FilterButtons
          data={productos}
          currentFilter={filtroActivo}
          onFilterChange={(filter) => setFiltroActivo(filter as FiltroCompleto)}
          getFilterOptions={getFilterOptions}
          className="mb-4"
        />
      </div>

      <DataTable
        data={productosFiltrados}
        columns={columns}
        onEdit={handleEditar}
        onDelete={handleEliminar}
        emptyMessage="No se encontraron productos que coincidan con los criterios de búsqueda."
        customActions={(producto) => (
          <button
            type="button"
            onClick={() => handleCambiarEstado(producto)}
            className={`px-3 py-1 rounded-md transition-colors text-sm font-medium ${
              producto.estadoInventario === "activo"
                ? "bg-accent text-white"
                : producto.estadoInventario === "inactivo"
                ? "bg-info text-white"
                : "bg-warning text-white"
            }`}
            title={`Cambiar de ${producto.estadoInventario} a ${
              producto.estadoInventario === "activo"
                ? "inactivo"
                : producto.estadoInventario === "inactivo"
                ? "suspendido"
                : "activo"
            }`}
          >
            {producto.estadoInventario === "activo"
              ? "Desactivar"
              : producto.estadoInventario === "inactivo"
              ? "Suspender"
              : "Activar"}
          </button>
        )}
      />
    </PageLayout>
  );
}
