"use client";

import { useRef, useState, useCallback } from "react";
import { toast } from "sonner";

//Components
import PageLayout from "@/components/shared/PageLayout";
import SearchAndActions from "@/components/shared/SearchAndActions";
import DataForm, { type FormField } from "@/components/shared/DataForm";
import DataTable, { type TableColumn } from "@/components/shared/DataTable";
import { exportToCSV } from "@/components/shared/ExportUtils";

//Hooks
import { useFormValidation } from "@/hooks/useFormValidation";

// Types and mocks
import { type Categoria } from "@/types/categoria";
import { CATEGORIAS_EJEMPLO } from "@/mocks/categorias";


export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>(CATEGORIAS_EJEMPLO);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [exportandoCSV, setExportandoCSV] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    vidaUtil: "",
    presentación: "",
  });

  const inputNombreRef = useRef<HTMLInputElement>(null);
  const { validateRequired, validateUnique } = useFormValidation();

  const handleAgregarOEditar = () => {
    if (
      !validateRequired(formData, [
        "nombre",
        "descripcion",
        "tipo",
        "vidaUtil",
        "presentación",
      ])
    ) {
      return;
    }

    if (
      !validateUnique(
        categorias,
        formData.nombre,
        "nombre",
        editandoId,
        "Categoría ya existe"
      )
    ) {
      return;
    }

    if (editandoId) {
      setCategorias((prev) =>
        prev.map((c) => (c.id === editandoId ? { ...c, ...formData } : c))
      );
      toast.success("Categoría actualizada");
      setEditandoId(null);
    } else {
      const nuevaCategoria: Categoria = {
        id: Date.now(),
        ...formData,
      };
      setCategorias((prev) => [...prev, nuevaCategoria]);
      toast.success("Categoría agregada");
    }

    resetFormulario();
  };

  const resetFormulario = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      tipo: "",
      vidaUtil: "",
      presentación: "",
    });
    setFormVisible(false);
    setEditandoId(null);
  };

  const handleEditar = (categoria: Categoria) => {
    setEditandoId(categoria.id);
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      tipo: categoria.tipo,
      vidaUtil: categoria.vidaUtil,
      presentación: categoria.presentación,
    });
    setFormVisible(true);
  };

  const handleEliminar = (categoria: Categoria) => {
    setCategorias((prev) => prev.filter((c) => c.id !== categoria.id));
    toast.info(`Categoría eliminada: ${categoria.nombre}`);
  };

  const categoriasFiltradas = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const exportarCSV = useCallback(() => {
    setExportandoCSV(true);

    // Usar setTimeout para dar tiempo a que se actualice el estado
    setTimeout(() => {
      const headers = ["Nombre", "Descripción", "Tipo", "Vida útil", "Modo"];
      const success = exportToCSV(
        categoriasFiltradas.map((c) => ({
          ...c,
          tipo: c.tipo,
          vidaUtil: c.vidaUtil,
          presentación: c.presentación,
        })),
        headers,
        "categorias-inventario.csv"
      );

      if (success) {
        toast.success("Archivo CSV generado correctamente");
      } else {
        toast.error("Error al generar el archivo CSV");
      }

      setExportandoCSV(false);
    }, 100);
  }, [categoriasFiltradas]);

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
      key: "tipo",
      type: "text",
      placeholder: "Tipo",
      value: formData.tipo,
      onChange: (value) =>
        setFormData((prev) => ({ ...prev, tipo: String(value) })),
    },
    {
      key: "vidaUtil",
      type: "text",
      placeholder: "Vida útil",
      value: formData.vidaUtil,
      onChange: (value) =>
        setFormData((prev) => ({ ...prev, vidaUtil: String(value) })),
    },
    {
      key: "presentación",
      type: "text",
      placeholder: "Presentación",
      value: formData.presentación,
      onChange: (value) =>
        setFormData((prev) => ({ ...prev, modo: String(value) })),
    },
  ];

  const columns: TableColumn<Categoria>[] = [
    { key: "nombre", title: "Nombre" },
    { key: "descripcion", title: "Descripción" },
    { key: "tipo", title: "Tipo" },
    { key: "vidaUtil", title: "Vida útil" },
    { key: "presentación", title: "Presentación" },
  ];

  return (
    <PageLayout title="Categorías">
      <SearchAndActions
        searchValue={busqueda}
        onSearchChange={setBusqueda}
        searchPlaceholder="Buscar categoría..."
        formVisible={formVisible}
        onToggleForm={() => setFormVisible(true)}
        onSave={handleAgregarOEditar}
        onCancel={resetFormulario}
        isEditing={!!editandoId}
        addButtonText="Agregar Categoría"
        showExport={true}
        onExport={exportarCSV}
        isExporting={exportandoCSV}
      />

      <DataForm
        ref={inputNombreRef}
        title="categoría"
        fields={formFields}
        visible={formVisible}
        isEditing={!!editandoId}
      />

      <DataTable
        data={categoriasFiltradas}
        columns={columns}
        onEdit={handleEditar}
        onDelete={handleEliminar}
        emptyMessage="No se encontraron categorías."
      />
    </PageLayout>
  );
}
