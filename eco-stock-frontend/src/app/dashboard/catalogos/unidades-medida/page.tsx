"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";

//Components
import PageLayout from "@/components/shared/PageLayout";
import SearchAndActions from "@/components/shared/SearchAndActions";
import DataForm, { type FormField } from "@/components/shared/DataForm";
import DataTable, { type TableColumn } from "@/components/shared/DataTable";

//Hooks
import { useFormValidation } from "@/hooks/useFormValidation";

// Types and mocks
import { type UnidadMedida } from "@/types/unidad-medida";
import { UNIDADES_EJEMPLO } from "@/mocks/unidades-medida";

export default function UnidadesDeMedidaPage() {
  const [unidades, setUnidades] = useState<UnidadMedida[]>(UNIDADES_EJEMPLO);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    abreviatura: "",
    descripcion: "",
  });

  const inputNombreRef = useRef<HTMLInputElement>(null);
  const { validateRequired, validateUnique } = useFormValidation();

  const handleAgregarOEditar = () => {
    if (!validateRequired(formData, ["nombre", "abreviatura", "descripcion"])) {
      return;
    }

    if (
      !validateUnique(
        unidades,
        formData.nombre,
        "nombre",
        editandoId,
        "Unidad ya existe"
      )
    ) {
      return;
    }

    if (editandoId) {
      setUnidades((prev) =>
        prev.map((unidad) =>
          unidad.id === editandoId ? { ...unidad, ...formData } : unidad
        )
      );
      toast.success("Unidad actualizada");
      setEditandoId(null);
    } else {
      const nuevaUnidad: UnidadMedida = {
        id: Date.now(),
        ...formData,
      };
      setUnidades((prev) => [...prev, nuevaUnidad]);
      toast.success("Unidad agregada");
    }

    resetFormulario();
  };

  const resetFormulario = () => {
    setFormData({
      nombre: "",
      abreviatura: "",
      descripcion: "",
    });
    setFormVisible(false);
    setEditandoId(null);
  };

  const handleEditar = (unidad: UnidadMedida) => {
    setEditandoId(unidad.id);
    setFormData({
      nombre: unidad.nombre,
      abreviatura: unidad.abreviatura,
      descripcion: unidad.descripcion,
    });
    setFormVisible(true);
  };

  const handleEliminar = (unidad: UnidadMedida) => {
    setUnidades((prev) => prev.filter((u) => u.id !== unidad.id));
    toast.info(`Unidad eliminada: ${unidad.nombre}`);
  };

  const unidadesFiltradas = unidades.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.abreviatura.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formsFields: FormField[] = [
    {
      key: "nombre",
      type: "text",
      placeholder: "Nombre",
      value: formData.nombre,
      onChange: (value) =>
        setFormData((prev) => ({ ...prev, nombre: String(value) })),
    },
    {
      key: "abreviatura",
      type: "text",
      placeholder: "Abreviatura",
      value: formData.abreviatura,
      onChange: (value) =>
        setFormData((prev) => ({ ...prev, abreviatura: String(value) })),
    },
    {
      key: "descripcion",
      type: "text",
      placeholder: "Descripción",
      value: formData.descripcion,
      onChange: (value) =>
        setFormData((prev) => ({ ...prev, descripcion: String(value) })),
    },
  ];

  const columns: TableColumn<UnidadMedida>[] = [
    { key: "nombre", title: "Nombre" },
    { key: "abreviatura", title: "Abreviatura" },
    { key: "descripcion", title: "Descripción" },
  ];

  return (
    <PageLayout title="Unidades de Medida">
      <SearchAndActions
        searchValue={busqueda}
        onSearchChange={setBusqueda}
        searchPlaceholder="Buscar unidad..."
        formVisible={formVisible}
        onToggleForm={() => setFormVisible(true)}
        onSave={handleAgregarOEditar}
        onCancel={resetFormulario}
        isEditing={!!editandoId}
        addButtonText="Agregar Unidad"
        showExport={true}
      />

      <DataForm
        ref={inputNombreRef}
        title="unidad"
        fields={formsFields}
        visible={formVisible}
        isEditing={!!editandoId}
      />

      <DataTable
        data={unidadesFiltradas}
        columns={columns}
        onEdit={handleEditar}
        onDelete={handleEliminar}
        emptyMessage="No se encontraron unidades."
      />
    </PageLayout>
  );
}
