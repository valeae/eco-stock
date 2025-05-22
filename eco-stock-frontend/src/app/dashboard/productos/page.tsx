"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Toaster, toast } from "sonner";
import { Edit, Trash2, Download, Loader2, Plus } from "lucide-react";

// Interfaces
interface ProductoDetalle {
  id: number;
  nombre: string;
  descripcion: string;
  stock: number;
  estado: string;
}

const PRODUCTOS_EJEMPLO: ProductoDetalle[] = [
  {
    id: 1,
    nombre: "Fertilizante Orgánico",
    descripcion: "Mejora la fertilidad del suelo",
    stock: 42,
    estado: "Disponible",
  },
  {
    id: 2,
    nombre: "Pesticida Ecológico",
    descripcion: "Controla plagas de forma natural",
    stock: 18,
    estado: "Disponible",
  },
  {
    id: 3,
    nombre: "Semillas de Maíz",
    descripcion: "Variedad resistente a sequías",
    stock: 65,
    estado: "Disponible",
  },
  {
    id: 4,
    nombre: "Abono Mineral",
    descripcion: "Rico en nutrientes esenciales",
    stock: 27,
    estado: "Disponible",
  },
  {
    id: 5,
    nombre: "Kit de Análisis de Suelo",
    descripcion: "Herramienta para análisis básico",
    stock: 8,
    estado: "Agotado",
  },
];

export default function DetallesProductosPage() {
  const [productos, setProductos] =
    useState<ProductoDetalle[]>(PRODUCTOS_EJEMPLO);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [exportandoCSV, setExportandoCSV] = useState(false);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stock, setStock] = useState<number>(0);
  const [estado, setEstado] = useState("");

  const inputNombreRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    for (const producto of productos) {
      if (producto.stock <= 10) {
        toast.error(`¡Stock bajo para "${producto.nombre}"!`, {
          duration: 4000,
        });
      }
    }
  }, [productos]);

  useEffect(() => {
    if (formVisible) {
      inputNombreRef.current?.focus();
    }
  }, [formVisible]);

  const handleAgregarOEditar = () => {
    if (!nombre.trim() || !descripcion.trim() || !estado.trim() || stock < 0) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    const nombreExistente = productos.find(
      (c) => c.nombre.toLowerCase() === nombre.toLowerCase() && c.id !== editandoId
    );

    if (nombreExistente) {
      toast.warning("producto ya existe");
      return;
    }

    if (editandoId) {
      setProductos((prev) =>
        prev.map((p) =>
          p.id === editandoId ? { ...p, nombre, descripcion, stock, estado } : p
        )
      );
      toast.success("Producto actualizado");
      setEditandoId(null);
    } else {
      const nuevoProducto: ProductoDetalle = {
        id: Date.now(),
        nombre,
        descripcion,
        stock,
        estado,
      };
      setProductos((prev) => [...prev, nuevoProducto]);
      toast.success("Producto agregado");
    }

    resetFormulario();
  };

  const resetFormulario = () => {
    setNombre("");
    setDescripcion("");
    setStock(0);
    setEstado("");
    setFormVisible(false);
    setEditandoId(null);
  };

  const handleEditar = (producto: ProductoDetalle) => {
    setEditandoId(producto.id);
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setStock(producto.stock);
    setEstado(producto.estado);
    setFormVisible(true);
  };

  const handleEliminar = (id: number) => {
    const eliminado = productos.find((p) => p.id === id);
    setProductos((prev) => prev.filter((p) => p.id !== id));
    if (eliminado) toast.info(`Producto eliminado: ${eliminado.nombre}`);
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const exportarCSV = useCallback(() => {
    try {
      setExportandoCSV(true);

      const headers = ["Nombre", "Descripción", "Stock", "Estado"];

      const csvData = productosFiltrados.map(
        (item) =>
          `"${item.nombre}","${item.descripcion}",${item.stock},"${item.estado}"`
      );

      const csvContent = [headers.join(","), ...csvData].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "inventario-agricola.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Archivo CSV generado correctamente");
    } catch (error) {
      console.error("Error al generar CSV:", error);
      toast.error("Error al generar el archivo CSV");
    } finally {
      setExportandoCSV(false);
    }
  }, [productosFiltrados]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-primary-ecoLight p-10">
      <Toaster 
        position="top-right" 
        richColors 
        expand={true}
        gap={12}
        offset={16}
        toastOptions={{
          style: { marginBottom: '12px' },
          className: 'my-3',
        }} />
      <h2 className="text-3xl font-bold text-heading-dark mb-8">
        Detalles de Productos
      </h2>

      {/* Buscador y botones */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="p-3 border rounded-md w-full md:w-1/2"
        />
        <div className="flex flex-wrap gap-2 md:ml-auto">
          {!formVisible && (
            <>
              <button
                type="button"
                onClick={() => setFormVisible(true)}
                className="bg-primary-dark text-white px-6 py-2 rounded-md hover:bg-primary-light transition flex items-center gap-2"
              >
                <Plus size={18} />
                Agregar producto
              </button>

              <button
                type="button"
                onClick={exportarCSV}
                disabled={exportandoCSV}
                className="bg-primary-dark text-white px-6 py-2 rounded-md transition flex items-center gap-2"
              >
                {exportandoCSV ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Exportar
                  </>
                )}
              </button>
            </>
          )}
          {formVisible && (
            <>
              <button
                type="button"
                onClick={handleAgregarOEditar}
                className="bg-primary-dark text-white px-6 py-2 rounded-md hover:bg-primary-light transition"
              >
                {editandoId ? "Guardar cambios" : "Guardar producto"}
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

      {/* Formulario */}
      {formVisible && (
        <div className="w-full max-w-4xl bg-white shadow-md rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {editandoId ? "Editar producto" : "Agregar nuevo producto"}
          </h3>
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
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="p-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(Number.parseInt(e.target.value) || 0)}
              className="p-2 border rounded-md"
              min={0}
            />
            <select
              aria-label="Selecciona un estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="">Selecciona un estado</option>
              <option value="Disponible">Disponible</option>
              <option value="Agotado">Agotado</option>
              <option value="Bajo stock">Bajo stock</option>
              <option value="Desabilitado">Desabilitado</option>
            </select>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div
        id="tabla-productos"
        className="overflow-x-auto w-full max-w-4xl bg-white shadow-md rounded-xl"
      >
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-primary-dark text-white">
            <tr>
              <th className="py-4 px-6 text-left">Nombre</th>
              <th className="py-4 px-6 text-left">Descripción</th>
              <th className="py-4 px-6 text-left">Stock</th>
              <th className="py-4 px-6 text-left">Estado</th>
              <th className="py-4 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <tr
                key={producto.id}
                className={`border-b border-muted-default hover:bg-muted-light transition ${
                  producto.stock <= 10 ? "bg-red-50" : ""
                }`}
              >
                <td className="py-4 px-6">{producto.nombre}</td>
                <td className="py-4 px-6">{producto.descripcion}</td>
                <td
                  className={`py-4 px-6 font-medium ${
                    producto.stock <= 10 ? "text-red-600" : ""
                  }`}
                >
                  {producto.stock}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      producto.estado === "Disponible"
                        ? "bg-green-100 text-green-800"
                        : producto.estado === "Agotado"
                        ? "bg-red-100 text-red-800"
                        : producto.estado === "Bajo stock"
                        ? "bg-yellow-100 text-yellow-800"
                        : producto.estado === "Por ingresar"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {producto.estado}
                  </span>
                </td>
                <td className="py-4 px-6 text-center space-x-3">
                <button
                    type="button"
                    onClick={() => handleEditar(producto)}
                    className="bg-primary-dark text-white p-2 rounded-md hover:bg-primary-light transition"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEliminar(producto.id)}
                    className="bg-primary-dark text-white p-2 rounded-md hover:bg-primary-light transition"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {productosFiltrados.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted-dark">
                  No se encontraron productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
