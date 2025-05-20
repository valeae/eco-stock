"use client";

import { useState, useRef } from "react";
import { Toaster, toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";

interface UnidadMedida {
  id: number;
  nombre: string;
  abreviatura: string;
  descripcion: string;
}

const UNIDADES_EJEMPLO: UnidadMedida[] = [
  { id: 1, nombre: "Kilogramo", abreviatura: "kg", descripcion: "Usado para productos sólidos como fertilizantes." },
  { id: 2, nombre: "Litro", abreviatura: "L", descripcion: "Usado para líquidos como herbicidas." },
  { id: 3, nombre: "Metro", abreviatura: "m", descripcion: "Usado para medir longitudes de materiales." },
  { id: 4, nombre: "Unidad", abreviatura: "ud", descripcion: "Usado para productos individuales como herramientas." },
];

export default function UnidadesDeMedidaPage() {
  const [unidades, setUnidades] = useState<UnidadMedida[]>(UNIDADES_EJEMPLO);
  const [nombre, setNombre] = useState("");
  const [abreviatura, setAbreviatura] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const inputNombreRef = useRef<HTMLInputElement>(null);

  const handleAgregarOEditar = () => {
    if (!nombre.trim() || !abreviatura.trim() || !descripcion.trim()) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    const abreviaturaExistente = unidades.find(
      (u) => u.abreviatura.toLowerCase() === abreviatura.toLowerCase() && u.id !== editandoId
    );

    if (abreviaturaExistente) {
      toast.warning("Unidad ya existe");
      return;
    }

    if (editandoId) {
      setUnidades((prev) =>
        prev.map((unidad) =>
          unidad.id === editandoId ? { ...unidad, nombre, abreviatura, descripcion } : unidad
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

    setNombre("");
    setAbreviatura("");
    setDescripcion("");
    inputNombreRef.current?.focus();
  };

  const handleEliminar = (id: number) => {
    setUnidades((prev) => prev.filter((unidad) => unidad.id !== id));
    toast.info("Unidad eliminada");
  };

  const handleEditar = (unidad: UnidadMedida) => {
    setEditandoId(unidad.id);
    setNombre(unidad.nombre);
    setAbreviatura(unidad.abreviatura);
    setDescripcion(unidad.descripcion);
    inputNombreRef.current?.focus();
  };

  const handleExportarCSV = () => {
    const encabezados = ["Nombre", "Abreviatura", "Descripción"];
    const filas = unidades.map((u) => [u.nombre, u.abreviatura, u.descripcion]);
    const contenido = [encabezados, ...filas]
      .map((fila) => fila.map((v) => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "unidades_medida.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const unidadesFiltradas = unidades.filter((unidad) =>
    unidad.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    unidad.abreviatura.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-primary-ecoLight p-10">
      <Toaster position="top-right" richColors />
      <h2 className="text-3xl font-bold text-heading-dark mb-8">Unidades de Medida</h2>

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
          <button
            type="button"
            onClick={handleExportarCSV}
            className="bg-accent-dark text-white px-6 py-2 rounded-md hover:bg-accent-light transition"
          >
            Exportar
          </button>
        </div>
      </div>

      {/* Formulario */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">{editandoId ? "Editar unidad" : "Agregar nueva unidad"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Tabla */}
      <div className="overflow-x-auto w-full max-w-4xl bg-white shadow-md rounded-xl">
        <table className="min-w-full table-auto">
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
              <tr key={unidad.id} className="border-b border-muted-default hover:bg-muted-light transition">
                <td className="py-4 px-6">{unidad.nombre}</td>
                <td className="py-4 px-6">{unidad.abreviatura}</td>
                <td className="py-4 px-6">{unidad.descripcion}</td>
                <td className="py-4 px-6 flex justify-center gap-3">
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
