"use client";

import { useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";

type Categoria = {
  id: number;
  nombre: string;
  descripcion: string;
};

const CATEGORIAS_EJEMPLO: Categoria[] = [
  { id: 1, nombre: "Fertilizantes", descripcion: "Productos para mejorar el crecimiento de las plantas." },
  { id: 2, nombre: "Herramientas", descripcion: "Herramientas agrícolas y de jardinería." },
  { id: 3, nombre: "Semillas", descripcion: "Variedad de semillas para cultivos." },
];

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>(CATEGORIAS_EJEMPLO);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const inputNombreRef = useRef<HTMLInputElement>(null);

  const handleAgregarOEditar = () => {
    if (!nombre.trim() || !descripcion.trim()) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    const nombreExistente = categorias.find(
      (c) => c.nombre.toLowerCase() === nombre.toLowerCase() && c.id !== editandoId
    );

    if (nombreExistente) {
      toast.warning("Categoría ya existe");
      return;
    }

    if (editandoId) {
      setCategorias((prev) =>
        prev.map((c) =>
          c.id === editandoId ? { ...c, nombre, descripcion } : c
        )
      );
      toast.success("Categoría actualizada");
      setEditandoId(null);
    } else {
      const nuevaCategoria: Categoria = {
        id: Date.now(),
        nombre,
        descripcion,
      };
      setCategorias((prev) => [...prev, nuevaCategoria]);
      toast.success("Categoría agregada");
    }

    setNombre("");
    setDescripcion("");
    inputNombreRef.current?.focus();
  };

  const handleEditar = (categoria: Categoria) => {
    setEditandoId(categoria.id);
    setNombre(categoria.nombre);
    setDescripcion(categoria.descripcion);
    inputNombreRef.current?.focus();
  };

  const handleEliminar = (id: number) => {
    const eliminada = categorias.find((c) => c.id === id);
    setCategorias((prev) => prev.filter((c) => c.id !== id));
    if (eliminada) toast.info(`Categoría eliminada: ${eliminada.nombre}`);
  };

  const handleExportarCSV = () => {
    const encabezados = ["Nombre", "Descripción"];
    const filas = categorias.map((c) => [c.nombre, c.descripcion]);
    const contenido = [encabezados, ...filas]
      .map((fila) => fila.map((v) => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "categorias.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categoriasFiltradas = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-primary-ecoLight p-10">
      <Toaster position="top-right" richColors />
      <h2 className="text-3xl font-bold text-heading-dark mb-8">Categorías</h2>

      {/* Buscador y botones */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar categoría..."
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
            {editandoId ? "Guardar cambios" : "Agregar categoría"}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={() => {
                setEditandoId(null);
                setNombre("");
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
        <h3 className="text-xl font-semibold mb-4">{editandoId ? "Editar categoría" : "Agregar nueva categoría"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <th className="py-4 px-6 text-left">Descripción</th>
              <th className="py-4 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriasFiltradas.map((categoria) => (
              <tr key={categoria.id} className="border-b border-muted-default hover:bg-muted-light transition">
                <td className="py-4 px-6">{categoria.nombre}</td>
                <td className="py-4 px-6">{categoria.descripcion}</td>
                <td className="py-4 px-6 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleEditar(categoria)}
                    className="bg-primary-dark text-white p-2 rounded-md hover:bg-primary-light transition"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEliminar(categoria.id)}
                    className="bg-primary-dark text-white p-2 rounded-md hover:bg-primary-light transition"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {categoriasFiltradas.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-muted-dark">
                  No se encontraron categorías.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
