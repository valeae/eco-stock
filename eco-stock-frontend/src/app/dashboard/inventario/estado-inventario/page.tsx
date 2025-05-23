//Estado de Inventario: Activo/inactivo, filtros rápidos, resumen general.
// Permitir filtrar y visualizar fácilmente los productos según su estado.
// 🔘 Filtros o pestañas:
// Activos ✅
// Inactivos ❌
// Todos
// Qué mostrar:
// Producto
// Cantidad
// Estado (activo/inactivo)
// Botón para cambiar el estado (toggle)
// Ideal para la administración rápida de la disponibilidad en el sistema, sin entrar a editar detalles del producto.

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Toaster, toast } from "sonner";
import { Edit, Trash2, Download, Loader2, Plus, RotateCcw } from "lucide-react";

// Interfaces
interface ProductoInventario {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  stockTotal: number;
  stockDisponible: number;
  stockReservado: number;
  estadoInventario: "activo" | "inactivo";
  fechaUltimaActualizacion: string;
  observaciones: string;
}

const PRODUCTOS_INVENTARIO: ProductoInventario[] = [
  {
    id: 1,
    codigo: "FER-001",
    nombre: "Fertilizante Orgánico Premium",
    categoria: "Fertilizantes",
    stockTotal: 150,
    stockDisponible: 42,
    stockReservado: 8,
    estadoInventario: "activo",
    fechaUltimaActualizacion: "2024-03-15",
    observaciones: "Stock normal"
  },
  {
    id: 2,
    codigo: "PES-002",
    nombre: "Pesticida Ecológico Natural",
    categoria: "Pesticidas",
    stockTotal: 80,
    stockDisponible: 18,
    stockReservado: 5,
    estadoInventario: "activo",
    fechaUltimaActualizacion: "2024-03-14",
    observaciones: "Stock bajo - reabastecer"
  },
  {
    id: 3,
    codigo: "SEM-003",
    nombre: "Semillas de Maíz Híbrido",
    categoria: "Semillas",
    stockTotal: 200,
    stockDisponible: 65,
    stockReservado: 15,
    estadoInventario: "activo",
    fechaUltimaActualizacion: "2024-03-16",
    observaciones: "Stock óptimo"
  },
  {
    id: 4,
    codigo: "ABO-004",
    nombre: "Abono Mineral Completo",
    categoria: "Abonos",
    stockTotal: 120,
    stockDisponible: 27,
    stockReservado: 3,
    estadoInventario: "activo",
    fechaUltimaActualizacion: "2024-03-13",
    observaciones: "Reposición programada"
  },
  {
    id: 5,
    codigo: "KIT-005",
    nombre: "Kit de Análisis de Suelo v1.0",
    categoria: "Herramientas",
    stockTotal: 50,
    stockDisponible: 0,
    stockReservado: 0,
    estadoInventario: "inactivo",
    fechaUltimaActualizacion: "2024-02-28",
    observaciones: "Producto descontinuado"
  },
  {
    id: 6,
    codigo: "HER-006",
    nombre: "Herbicida Selectivo Antiguo",
    categoria: "Herbicidas",
    stockTotal: 30,
    stockDisponible: 0,
    stockReservado: 0,
    estadoInventario: "inactivo",
    fechaUltimaActualizacion: "2024-01-20",
    observaciones: "Eliminado por regulaciones"
  }
];

export default function EstadoInventarioPage() {
  const [productos, setProductos] = useState<ProductoInventario[]>(PRODUCTOS_INVENTARIO);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "activo" | "inactivo">("todos");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [exportandoCSV, setExportandoCSV] = useState(false);

  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [stockTotal, setStockTotal] = useState<number>(0);
  const [stockDisponible, setStockDisponible] = useState<number>(0);
  const [stockReservado, setStockReservado] = useState<number>(0);
  const [estadoInventario, setEstadoInventario] = useState<"activo" | "inactivo">("activo");
  const [observaciones, setObservaciones] = useState("");

  const inputCodigoRef = useRef<HTMLInputElement>(null);

  // Alertas automáticas para stock bajo y productos inactivos
  useEffect(() => {
    const productosStockBajo = productos.filter(p =>
      p.estadoInventario === "activo" && p.stockDisponible <= 10
    );
  
    for (const producto of productosStockBajo) {
      toast.warning(`Stock bajo: "${producto.nombre}" (${producto.stockDisponible} unidades)`, {
        duration: 4000,
      });
    }
  
    const productosInactivos = productos.filter(p => p.estadoInventario === "inactivo");
    if (productosInactivos.length > 0) {
      toast.info(`${productosInactivos.length} producto(s) inactivo(s) en inventario`, {
        duration: 3000,
      });
    }
  }, [productos]); 

  useEffect(() => {
    if (formVisible) {
      inputCodigoRef.current?.focus();
    }
  }, [formVisible]);

  const handleAgregarOEditar = () => {
    if (!codigo.trim() || !nombre.trim() || !categoria.trim() || stockTotal < 0 || stockDisponible < 0 || stockReservado < 0) {
      toast.error("Todos los campos son obligatorios y los stocks deben ser positivos");
      return;
    }

    if (stockDisponible + stockReservado > stockTotal) {
      toast.error("El stock disponible + reservado no puede exceder el stock total");
      return;
    }

    const codigoExistente = productos.find(
      (p) => p.codigo.toLowerCase() === codigo.toLowerCase() && p.id !== editandoId
    );

    if (codigoExistente) {
      toast.warning("El código del producto ya existe");
      return;
    }

    const fechaActual = new Date().toISOString().split('T')[0];

    if (editandoId) {
      setProductos((prev) =>
        prev.map((p) =>
          p.id === editandoId
            ? {
              ...p,
              codigo,
              nombre,
              categoria,
              stockTotal,
              stockDisponible,
              stockReservado,
              estadoInventario,
              observaciones,
              fechaUltimaActualizacion: fechaActual
            }
            : p
        )
      );
      toast.success("Producto actualizado en inventario");
      setEditandoId(null);
    } else {
      const nuevoProducto: ProductoInventario = {
        id: Date.now(),
        codigo,
        nombre,
        categoria,
        stockTotal,
        stockDisponible,
        stockReservado,
        estadoInventario,
        fechaUltimaActualizacion: fechaActual,
        observaciones,
      };
      setProductos((prev) => [...prev, nuevoProducto]);
      toast.success("Producto agregado al inventario");
    }

    resetFormulario();
  };

  const resetFormulario = () => {
    setCodigo("");
    setNombre("");
    setCategoria("");
    setStockTotal(0);
    setStockDisponible(0);
    setStockReservado(0);
    setEstadoInventario("activo");
    setObservaciones("");
    setFormVisible(false);
    setEditandoId(null);
  };

  const handleEditar = (producto: ProductoInventario) => {
    setEditandoId(producto.id);
    setCodigo(producto.codigo);
    setNombre(producto.nombre);
    setCategoria(producto.categoria);
    setStockTotal(producto.stockTotal);
    setStockDisponible(producto.stockDisponible);
    setStockReservado(producto.stockReservado);
    setEstadoInventario(producto.estadoInventario);
    setObservaciones(producto.observaciones);
    setFormVisible(true);
  };

  const handleCambiarEstado = (id: number) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    const nuevoEstado = producto.estadoInventario === "activo" ? "inactivo" : "activo";
    const fechaActual = new Date().toISOString().split('T')[0];

    setProductos((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
            ...p,
            estadoInventario: nuevoEstado,
            fechaUltimaActualizacion: fechaActual,
            // Si se activa, limpiar observaciones de eliminación
            observaciones: nuevoEstado === "activo" ? "Producto reactivado" : "Producto desactivado"
          }
          : p
      )
    );

    toast.success(`Producto ${nuevoEstado === "activo" ? "activado" : "desactivado"}: ${producto.nombre}`);
  };

  const handleEliminarDefinitivo = (id: number) => {
    const eliminado = productos.find((p) => p.id === id);
    setProductos((prev) => prev.filter((p) => p.id !== id));
    if (eliminado) toast.info(`Producto eliminado permanentemente: ${eliminado.nombre}`);
  };

  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === "todos" ? true : p.estadoInventario === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  const exportarCSV = useCallback(() => {
    setExportandoCSV(true);
    try {
      const encabezados = [
        "ID", "Código", "Nombre", "Categoría",
        "Stock Total", "Stock Disponible", "Stock Reservado",
        "Estado", "Fecha Última Actualización", "Observaciones"
      ];

      const filas = productosFiltrados.map((p) =>
        [
          p.id,
          p.codigo,
          p.nombre,
          p.categoria,
          p.stockTotal,
          p.stockDisponible,
          p.stockReservado,
          p.estadoInventario,
          p.fechaUltimaActualizacion,
          p.observaciones
        ].join(",")
      );

      const csvContent = [encabezados.join(","), ...filas].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `inventario_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Exportación CSV completada");
    } catch {
      toast.error("Error exportando CSV");
    } finally {
      setExportandoCSV(false);
    }
  }, [productosFiltrados]);

  return (
    <>
      <Toaster position="top-right" />
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Estado de Inventario</h1>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre, código o categoría"
            className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select
            aria-label="Filtrar por estado"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as any)}
          >
            <option value="todos">Todos</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>

          <button
            type="button"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2"
            onClick={() => {
              resetFormulario();
              setFormVisible(true);
            }}
            aria-label="Agregar nuevo producto"
          >
            <Plus size={18} /> Agregar
          </button>

          <button
            type="button"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
            onClick={exportarCSV}
            disabled={exportandoCSV}
            aria-label="Exportar inventario a CSV"
          >
            {exportandoCSV ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            Exportar CSV
          </button>
        </div>

        {formVisible && (
          <section className="mb-6 p-4 border border-gray-300 rounded bg-gray-50 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">{editandoId ? "Editar Producto" : "Agregar Producto"}</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAgregarOEditar();
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label htmlFor="codigo" className="block font-medium mb-1">Código</label>
                <input
                  id="codigo"
                  ref={inputCodigoRef}
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                  maxLength={20}
                />
              </div>

              <div>
                <label htmlFor="nombre" className="block font-medium mb-1">Nombre</label>
                <input
                  id="nombre"
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="categoria" className="block font-medium mb-1">Categoría</label>
                <input
                  id="categoria"
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="estado" className="block font-medium mb-1">Estado</label>
                <select
                  id="estado"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={estadoInventario}
                  onChange={(e) => setEstadoInventario(e.target.value as "activo" | "inactivo")}
                  required
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div>
                <label htmlFor="stockTotal" className="block font-medium mb-1">Stock Total</label>
                <input
                  id="stockTotal"
                  type="number"
                  min={0}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={stockTotal}
                  onChange={(e) => setStockTotal(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label htmlFor="stockDisponible" className="block font-medium mb-1">Stock Disponible</label>
                <input
                  id="stockDisponible"
                  type="number"
                  min={0}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={stockDisponible}
                  onChange={(e) => setStockDisponible(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label htmlFor="stockReservado" className="block font-medium mb-1">Stock Reservado</label>
                <input
                  id="stockReservado"
                  type="number"
                  min={0}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={stockReservado}
                  onChange={(e) => setStockReservado(Number(e.target.value))}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="observaciones" className="block font-medium mb-1">Observaciones</label>
                <textarea
                  id="observaciones"
                  rows={2}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 rounded px-4 py-2"
                  onClick={resetFormulario}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2"
                >
                  {editandoId ? "Guardar Cambios" : "Agregar Producto"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2">Código</th>
                <th className="border border-gray-300 p-2">Nombre</th>
                <th className="border border-gray-300 p-2">Categoría</th>
                <th className="border border-gray-300 p-2">Stock Total</th>
                <th className="border border-gray-300 p-2">Disponible</th>
                <th className="border border-gray-300 p-2">Reservado</th>
                <th className="border border-gray-300 p-2">Estado</th>
                <th className="border border-gray-300 p-2">Última Actualización</th>
                <th className="border border-gray-300 p-2">Observaciones</th>
                <th className="border border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-500">No se encontraron productos</td>
                </tr>
              ) : (
                productosFiltrados.map((producto) => (
                  <tr
                    key={producto.id}
                    className={`hover:bg-gray-50 ${
                      producto.estadoInventario === "inactivo" ? "bg-red-50 text-red-700" : ""
                    }`}
                  >
                    <td className="border border-gray-300 p-2">{producto.codigo}</td>
                    <td className="border border-gray-300 p-2">{producto.nombre}</td>
                    <td className="border border-gray-300 p-2">{producto.categoria}</td>
                    <td className="border border-gray-300 p-2 text-center">{producto.stockTotal}</td>
                    <td
                      className={`border border-gray-300 p-2 text-center ${
                        producto.stockDisponible <= 10 && producto.estadoInventario === "activo" ? "text-red-600 font-semibold" : ""
                      }`}
                    >
                      {producto.stockDisponible}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">{producto.stockReservado}</td>
                    <td className="border border-gray-300 p-2 text-center capitalize">{producto.estadoInventario}</td>
                    <td className="border border-gray-300 p-2 text-center">{producto.fechaUltimaActualizacion}</td>
                    <td className="border border-gray-300 p-2">{producto.observaciones}</td>
                    <td className="border border-gray-300 p-2 text-center flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() => handleEditar(producto)}
                        aria-label={`Editar producto ${producto.nombre}`}
                        className="p-1 rounded hover:bg-blue-100 text-blue-600"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCambiarEstado(producto.id)}
                        aria-label={`Cambiar estado de producto ${producto.nombre}`}
                        className={`p-1 rounded hover:bg-yellow-100 ${
                          producto.estadoInventario === "activo" ? "text-yellow-700" : "text-green-700"
                        }`}
                        title={producto.estadoInventario === "activo" ? "Desactivar" : "Activar"}
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEliminarDefinitivo(producto.id)}
                        aria-label={`Eliminar producto ${producto.nombre}`}
                        className="p-1 rounded hover:bg-red-100 text-red-600"
                        title="Eliminar permanentemente"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}
