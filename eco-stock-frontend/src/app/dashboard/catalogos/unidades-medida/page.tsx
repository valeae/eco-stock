"use client";

import { useState, useRef, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { Edit, Trash2, Plus } from "lucide-react";

interface UnidadMedida {
  id: number;
  nombre: string;
  abreviatura: string;
  descripcion: string;
}

const UNIDADES_EJEMPLO: UnidadMedida[] = [
  {
    id: 1,
    nombre: "Kilogramo",
    abreviatura: "kg",
    descripcion: "Usado para productos sólidos como fertilizantes.",
  },
  {
    id: 2,
    nombre: "Litro",
    abreviatura: "L",
    descripcion: "Usado para líquidos como herbicidas.",
  },
  {
    id: 3,
    nombre: "Metro",
    abreviatura: "m",
    descripcion: "Usado para medir longitudes de materiales.",
  },
  {
    id: 4,
    nombre: "Unidad",
    abreviatura: "ud",
    descripcion: "Usado para productos individuales como herramientas.",
  },
];

export default function UnidadesDeMedidaPage() {
  const [unidades, setUnidades] = useState<UnidadMedida[]>(UNIDADES_EJEMPLO);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  const [nombre, setNombre] = useState("");
  const [abreviatura, setAbreviatura] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const inputNombreRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formVisible) {
      inputNombreRef.current?.focus();
    }
  }, [formVisible]);

  const handleAgregarOEditar = () => {
    if (!nombre.trim() || !abreviatura.trim() || !descripcion.trim()) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    const abreviaturaExistente = unidades.find(
      (u) =>
        u.abreviatura.toLowerCase() === abreviatura.toLowerCase() &&
        u.id !== editandoId
    );

    if (abreviaturaExistente) {
      toast.warning("Unidad ya existe");
      return;
    }

    if (editandoId) {
      setUnidades((prev) =>
        prev.map((unidad) =>
          unidad.id === editandoId
            ? { ...unidad, nombre, abreviatura, descripcion }
            : unidad
        )
      );
      toast.success("Unidad actualizada");
      setEditandoId(null);
    } else {
      const nuevaUnidad: UnidadMedida = {
        id: Date.now(),
        nombre,
        abreviatura,
        descripcion,
      };
      setUnidades((prev) => [...prev, nuevaUnidad]);
      toast.success("Unidad agregada");
    }

    resetFormulario();
  };

  const resetFormulario = () => {
    setNombre("");
    setAbreviatura("");
    setDescripcion("");
    setFormVisible(false);
    setEditandoId(null);
  };

  const handleEditar = (unidad: UnidadMedida) => {
    setEditandoId(unidad.id);
    setNombre(unidad.nombre);
    setAbreviatura(unidad.abreviatura);
    setDescripcion(unidad.descripcion);
    setFormVisible(true);
  };

  const handleEliminar = (id: number) => {
    const eliminada = unidades.find((u) => u.id === id);
    setUnidades((prev) => prev.filter((unidad) => unidad.id !== id));
    if (eliminada) toast.info(`Unidad eliminada: ${eliminada.nombre}`);
  };

  const unidadesFiltradas = unidades.filter(
    (unidad) =>
      unidad.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      unidad.abreviatura.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-primary-ecoLight p-10">
      <Toaster
        position="top-right"
        richColors
        expand={true}
        gap={12}
        offset={16}
        toastOptions={{
          style: { marginBottom: "12px" },
          className: "my-3",
        }}
      />
      <h2 className="text-3xl font-bold text-heading-dark mb-8">
        Unidades de Medida
      </h2>

      {/* Buscador y botones */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar unidad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="p-3 border rounded-md w-full md:w-1/2"
        />
        <div className="flex flex-wrap gap-2 md:ml-auto">
          {!formVisible && (
            <button
              type="button"
              onClick={() => setFormVisible(true)}
              className="bg-primary-dark text-white px-6 py-2 rounded-md hover:bg-primary-light transition flex items-center gap-2"
            >
              <Plus size={18} />
              Agregar Unidad
            </button>
          )}
          {formVisible && (
            <>
              <button
                type="button"
                onClick={handleAgregarOEditar}
                className="bg-primary-dark text-white px-6 py-2 rounded-md hover:bg-primary-light transition"
              >
                {editandoId ? "Guardar cambios" : "Guardar Unidad"}
              </button>
              <button
                type="button"
                onClick={resetFormulario}
                className="bg-muted-dark text-white px-6 py-2 rounded-md hover:bg-muted-light transition"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
        </div>

        {/* <div className="flex flex-wrap gap-2 md:ml-auto">
          <button
            type="button"
            onClick={handleAgregarOEditar}
            className="bg-primary-dark text-white px-6 py-2 rounded-md hover:bg-primary-light transition"
          >
            {editandoId ? "Guardar cambios" : "Agregar unidad"}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={() => {
                setEditandoId(null);
                setNombre("");
                setAbreviatura("");
                setDescripcion("");
                inputNombreRef.current?.focus();
              }}
              className="bg-muted-dark text-white px-6 py-2 rounded-md hover:bg-muted-light transition"
            >
              Cancelar
            </button>
          )}
        </div> */}
      

      {/* Formulario */}
      {formVisible && (
        <div className="w-full max-w-4xl bg-white shadow-md rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {editandoId ? "Editar Unidad" : "Agregar nueva Unidad"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              ref={inputNombreRef}
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="p-2 border rounded-md"
            />
            <input
            type="text"
            placeholder="Abreviatura"
            value={abreviatura}
            onChange={(e) => setAbreviatura(e.target.value)}
            className="p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="p-2 border rounded-md"
            />
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto w-full max-w-4xl bg-white shadow-md rounded-xl">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-primary-dark text-white">
            <tr>
              <th className="py-4 px-6 text-left">Nombre</th>
              <th className="py-4 px-6 text-left">Abreviatura</th>
              <th className="py-4 px-6 text-left">Descripción</th>
              <th className="py-4 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {unidadesFiltradas.map((unidad) => (
              <tr
                key={unidad.id}
                className="border-b border-muted-default hover:bg-muted-light transition"
              >
                <td className="py-4 px-6">{unidad.nombre}</td>
                <td className="py-4 px-6">{unidad.abreviatura}</td>
                <td className="py-4 px-6">{unidad.descripcion}</td>
                <td className="py-4 px-6 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditar(unidad)}
                    className="bg-primary-dark text-white p-2 rounded-md hover:bg-primary-light transition"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEliminar(unidad.id)}
                    className="bg-primary-dark text-white p-2 rounded-md hover:bg-primary-light transition"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {unidadesFiltradas.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-muted-dark">
                  No se encontraron unidades.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
