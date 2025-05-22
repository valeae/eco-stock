"use client";

import { useEffect, useState, useRef } from "react";
import { toast, Toaster } from "sonner";
import { Info, Edit, Plus } from "lucide-react";

type Producto = {
  id: number;
  nombre: string;
  cantidad: string;
  proveedor: string;
  descripcion: string;
  fechaVencimiento: string; // ISO date string
  notificado: boolean;
};

// Productos de ejemplo
const PRODUCTOS_EJEMPLO: Producto[] = [
  {
    id: 1,
    nombre: "Fertilizante Líquido Premium",
    cantidad: "50 litros",
    proveedor: "AgroTech Solutions",
    descripcion: "Fertilizante concentrado para cultivos intensivos",
    fechaVencimiento: "2025-06-15",
    notificado: false,
  },
  {
    id: 2,
    nombre: "Semillas de Tomate Híbrido",
    cantidad: "2 kg",
    proveedor: "Semillas del Campo",
    descripcion: "Variedad resistente a enfermedades",
    fechaVencimiento: "2025-05-30",
    notificado: false,
  },
  {
    id: 3,
    nombre: "Pesticida Orgánico",
    cantidad: "10 litros",
    proveedor: "EcoAgricultura",
    descripcion: "Control biológico de plagas",
    fechaVencimiento: "2025-05-25",
    notificado: false,
  },
];

export default function CommingExpiration() {
  const [productos, setProductos] = useState<Producto[]>(PRODUCTOS_EJEMPLO);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  const [formulario, setFormulario] = useState<Producto>({
    id: 0,
    nombre: "",
    cantidad: "",
    proveedor: "",
    descripcion: "",
    fechaVencimiento: "",
    notificado: false,
  });

  const [proximos, setProximos] = useState<Producto[]>([]);
  const [vencidos, setVencidos] = useState<Producto[]>([]);

  const inputNombreRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const hoy = new Date();
    const umbralDias = 30;

    const aVencer: Producto[] = [];
    const yaVencidos: Producto[] = [];

    for (const producto of productos) {
      const vencimiento = new Date(producto.fechaVencimiento);
      const diffDias =
        (vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDias <= umbralDias && diffDias > 0) {
        if (!producto.notificado) {
          toast(
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-warning" />
              <span>{`Info: "${producto.nombre}" vence en ${Math.ceil(diffDias)} día(s).`}</span>
            </div>,
            {
              style: {
                backgroundColor: "#fff3cd",
                color: "#856404",
                border: "1px solid #ffeeba",
              },
              duration: 5000,
            }
          );
        }
        aVencer.push(producto);
      } else if (diffDias <= 0) {
        if (!producto.notificado) {
          toast.error(
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-danger" />
              <span>{`"${producto.nombre}" ya está vencido.`}</span>
            </div>,
            {
              style: {
                backgroundColor: "#f8d7da",
                color: "#721c24",
                border: "1px solid #f5c6cb",
              },
              duration: 5000,
            }
          );
        }
        yaVencidos.push(producto);
      }
    }

    setProximos(aVencer);
    setVencidos(yaVencidos);
  }, [productos]);

  useEffect(() => {
    if (formVisible) {
      inputNombreRef.current?.focus();
    }
  }, [formVisible]);

  const handleAgregarOEditar = () => {
    if (
      !formulario.nombre.trim() ||
      !formulario.cantidad.trim() ||
      !formulario.proveedor.trim() ||
      !formulario.descripcion.trim() ||
      !formulario.fechaVencimiento
    ) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    const nombreExistente = productos.find(
      (p) => p.nombre.toLowerCase() === formulario.nombre.toLowerCase() && p.id !== editandoId
    );

    if (nombreExistente) {
      toast.warning("Este producto ya existe");
      return;
    }

    if (editandoId) {
      setProductos((prev) =>
        prev.map((p) =>
          p.id === editandoId 
            ? { 
                ...formulario, 
                id: editandoId,
                notificado: false
              } 
            : p
        )
      );
      toast.success("Producto actualizado");
      setEditandoId(null);
    } else {
      const nuevoProducto: Producto = {
        ...formulario,
        id: Date.now(),
        notificado: false,
      };
      setProductos((prev) => [...prev, nuevoProducto]);
      toast.success("Producto agregado exitosamente");
    }

    resetFormulario();
  };

  const resetFormulario = () => {
    setFormulario({
      id: 0,
      nombre: "",
      cantidad: "",
      proveedor: "",
      descripcion: "",
      fechaVencimiento: "",
      notificado: false,
    });
    setFormVisible(false);
    setEditandoId(null);
  };

  const handleEditar = (producto: Producto) => {
    setEditandoId(producto.id);
    setFormulario({ ...producto });
    setFormVisible(true);
  };

  const getStatusColor = (fecha: string) => {
    const hoy = new Date();
    const vencimiento = new Date(fecha);
    const diffDias =
      (vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDias <= 0) return "bg-red-100 text-red-700";
    if (diffDias <= 5) return "bg-red-100 text-red-700";
    if (diffDias <= 15) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const getTooltip = (fecha: string) => {
    const hoy = new Date();
    const vencimiento = new Date(fecha);
    const diffDias = Math.ceil(
      (vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDias > 0
      ? `Vence en ${diffDias} día(s)`
      : `¡Ya vencido hace ${Math.abs(diffDias)} día(s)!`;
  };

  const proximosFiltrados = proximos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.proveedor.toLowerCase().includes(busqueda.toLowerCase())
  );

  const vencidosFiltrados = vencidos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.proveedor.toLowerCase().includes(busqueda.toLowerCase())
  );

  const renderTabla = (titulo: string, productos: Producto[]) => (
    <div className="w-full max-w-4xl mb-10">
      <h3 className="text-xl font-semibold mb-4 text-heading-dark">{titulo}</h3>
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-primary-dark text-white">
            <tr>
              <th className="py-4 px-6 text-left">Nombre</th>
              <th className="py-4 px-6 text-left">Cantidad</th>
              <th className="py-4 px-6 text-left">Proveedor</th>
              <th className="py-4 px-6 text-left">Descripción</th>
              <th className="py-4 px-6 text-center">Fecha de Vencimiento</th>
              <th className="py-4 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length > 0 ? (
              productos.map((producto) => (
                <tr
                  key={producto.id}
                  className="border-b border-muted-default hover:bg-muted-light transition"
                >
                  <td className="py-4 px-6">{producto.nombre}</td>
                  <td
                    className="py-4 px-6 font-medium"
                  >
                    {producto.cantidad}
                  </td>
                  <td className="py-4 px-6">{producto.proveedor}</td>
                  <td className="py-4 px-6">{producto.descripcion}</td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        producto.fechaVencimiento
                      )}`}
                      title={getTooltip(producto.fechaVencimiento)}
                    >
                      {new Date(producto.fechaVencimiento).toLocaleDateString()}
                      <Info className="w-4 h-4 opacity-70" />
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      type="button"
                      onClick={() => handleEditar(producto)}
                      className="bg-primary-dark text-white p-2 rounded-md hover:bg-primary-light transition"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted-dark">
                  No hay productos en esta categoría.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
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
          style: { marginBottom: '12px' },
          className: 'my-3',
        }} 
      />
      <h2 className="text-3xl font-bold text-heading-dark mb-8">
        Gestión de Vencimientos
      </h2>

      {/* Buscador y botones */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar producto o proveedor..."
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
              Agregar producto
            </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              ref={inputNombreRef}
              type="text"
              placeholder="Nombre"
              className="border p-2 rounded"
              value={formulario.nombre}
              onChange={(e) =>
                setFormulario({ ...formulario, nombre: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Cantidad"
              className="border p-2 rounded"
              value={formulario.cantidad}
              onChange={(e) =>
                setFormulario({ ...formulario, cantidad: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Proveedor"
              className="border p-2 rounded"
              value={formulario.proveedor}
              onChange={(e) =>
                setFormulario({ ...formulario, proveedor: e.target.value })
              }
            />
            <input
              id="fechaVencimiento"
              type="date"
              className="border p-2 rounded"
              value={formulario.fechaVencimiento}
              onChange={(e) =>
                setFormulario({ ...formulario, fechaVencimiento: e.target.value })
              }
            />
            <textarea
              placeholder="Descripción"
              className="border p-2 rounded col-span-full"
              rows={3}
              value={formulario.descripcion}
              onChange={(e) =>
                setFormulario({ ...formulario, descripcion: e.target.value })
              }
            />
          </div>
        </div>
      )}

      {/* Tablas */}
      {renderTabla("Productos Próximos a Vencer", proximosFiltrados)}
      {renderTabla("Productos Ya Vencidos", vencidosFiltrados)}
    </div>
  );
}