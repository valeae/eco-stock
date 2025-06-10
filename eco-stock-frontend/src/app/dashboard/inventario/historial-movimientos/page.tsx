// Mostrar el flujo de inventario con fechas y usuarios responsables.
// Datos a mostrar:
// 📅 Fecha
// ↔️ Tipo de movimiento (Entrada / Salida)
// 📦 Producto
// 🔢 Cantidad
// 💰 Precio unitario
// 👤 Usuario que lo registró
// 🗒️ Detalle (tooltip con info adicional, como el motivo)
// Te ayuda a auditar y entender cómo se está moviendo el inventario a lo largo del tiempo.

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

interface MovimientoHistorial extends Record<string, unknown> {
  id: number;
  fecha: string;
  tipoMovimiento: "entrada" | "salida";
  producto: string;
  cantidad: number;
  usuarioRegistro: string;
  detalle: string;
}

type FiltroCompleto = 'todos' | 'entrada' | 'salida';

const MOVIMIENTOS_EJEMPLO: MovimientoHistorial[] = [
  {
    id: 1,
    fecha: "2024-12-01",
    tipoMovimiento: "entrada",
    producto: "Producto Alpha",
    cantidad: 100,
    usuarioRegistro: "Juan Pérez",
    detalle: "Compra inicial de inventario - Proveedor ABC",
  },
  {
    id: 2,
    fecha: "2024-12-02",
    tipoMovimiento: "salida",
    producto: "Producto Beta",
    cantidad: 15,
    usuarioRegistro: "María García",
    detalle: "Venta a cliente - Pedido #12345",
  },
  {
    id: 3,
    fecha: "2024-12-03",
    tipoMovimiento: "entrada",
    producto: "Producto Gamma",
    cantidad: 50,
    usuarioRegistro: "Carlos López",
    detalle: "Reposición de stock - Proveedor XYZ",
  },
  {
    id: 4,
    fecha: "2024-12-04",
    tipoMovimiento: "salida",
    producto: "Producto Alpha",
    cantidad: 25,
    usuarioRegistro: "Ana Rodríguez",
    detalle: "Transferencia a sucursal norte - Requisición #789",
  },
];

export default function MovimientosHistorial() {
    const [movimientos, setMovimientos] = useState<MovimientoHistorial[]>(MOVIMIENTOS_EJEMPLO);
    const [busqueda, setBusqueda] = useState("");
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [formVisible, setFormVisible] = useState(false);
    const [exportandoCSV, setExportandoCSV] = useState(false);
    
    const [filtroActivo, setFiltroActivo] = useState<FiltroCompleto>('todos');

    const [formData, setFormData] = useState({
        fecha: "",
        tipoMovimiento: "",
        producto: "",
        cantidad: 0,
        usuarioRegistro: "",
        detalle: "",
    });

    const inputFechaRef = useRef<HTMLInputElement>(null);
    const { validateRequired } = useFormValidation();

    const getFilterOptions = useCallback((data: MovimientoHistorial[]) => {
        const total = data.length;
        const totalEntradas = data.filter(m => m.tipoMovimiento === "entrada").length;
        const totalSalidas = data.filter(m => m.tipoMovimiento === "salida").length;
    
        return [
            { key: 'todos', label: 'Todos', count: total, color: 'bg-primary' },
            { key: 'entrada', label: 'Entradas', count: totalEntradas, color: 'bg-info-dark' },
            { key: 'salida', label: 'Salidas', count: totalSalidas, color: 'bg-danger-dark' },
        ];
    }, []);

    const movimientosFiltrados = useMemo(() => {
        return movimientos.filter((m) => {
            const coincideBusqueda = m.producto.toLowerCase().includes(busqueda.toLowerCase()) ||
                                    m.usuarioRegistro.toLowerCase().includes(busqueda.toLowerCase()) ||
                                    m.detalle.toLowerCase().includes(busqueda.toLowerCase()) ||
                                    m.fecha.includes(busqueda);
    
            let coincideFiltro = true;
            switch (filtroActivo) {
                case 'entrada':
                    coincideFiltro = m.tipoMovimiento === 'entrada';
                    break;
                case 'salida':
                    coincideFiltro = m.tipoMovimiento === 'salida';
                    break;
                default:
                    coincideFiltro = true;
            }
    
            return coincideBusqueda && coincideFiltro;
        });
    }, [movimientos, busqueda, filtroActivo]);

    const handleAgregarOEditar = () => {
        if (!validateRequired(formData, ["fecha", "tipoMovimiento", "producto", "cantidad", "precioUnitario", "usuarioRegistro", "detalle"])) {
            return;
        }

        if (formData.cantidad <= 0) {
            toast.error("La cantidad debe ser mayor a 0");
            return;
        }

        const fechaSeleccionada = new Date(formData.fecha);
        const fechaActual = new Date();
        if (fechaSeleccionada > fechaActual) {
            toast.error("La fecha no puede ser futura");
            return;
        }

        if (editandoId) {
            setMovimientos((prev) =>
                prev.map((m) => (m.id === editandoId ? { ...m, ...formData, tipoMovimiento: formData.tipoMovimiento as "entrada" | "salida" } : m))
            );
            toast.success("Movimiento actualizado correctamente");
            setEditandoId(null);
        } else {
            const nuevoMovimiento: MovimientoHistorial = {
                id: Date.now(),
                ...formData,
                tipoMovimiento: formData.tipoMovimiento as "entrada" | "salida",
            };
            setMovimientos((prev) => [...prev, nuevoMovimiento]);
            toast.success("Movimiento registrado correctamente");
        }

        resetFormulario();
    };

    const resetFormulario = () => {
        setFormData({
            fecha: "",
            tipoMovimiento: "",
            producto: "",
            cantidad: 0,
            usuarioRegistro: "",
            detalle: "",
        });
        setFormVisible(false);
        setEditandoId(null);
    };

    const handleEditar = (movimiento: MovimientoHistorial) => {
        setEditandoId(movimiento.id);
        setFormData({
            fecha: movimiento.fecha,
            tipoMovimiento: movimiento.tipoMovimiento,
            producto: movimiento.producto,
            cantidad: movimiento.cantidad,
            usuarioRegistro: movimiento.usuarioRegistro,
            detalle: movimiento.detalle,
        });
        setFormVisible(true);
    };

    const handleEliminar = (movimiento: MovimientoHistorial) => {
        setMovimientos((prev) => prev.filter((m) => m.id !== movimiento.id));
        toast.info(`Movimiento eliminado: ${movimiento.producto} - ${movimiento.fecha}`);
    };

    const exportarCSV = useCallback(() => {
        setExportandoCSV(true);

        setTimeout(() => {
            const headers = ["Fecha", "Tipo Movimiento", "Producto", "Cantidad", "Precio Unitario", "Usuario Registro", "Detalle"];
            const fileName = `movimientos_historial_${filtroActivo}_${new Date().toISOString().split('T')[0]}.csv`;
            
            const success = exportToCSV(
                movimientosFiltrados,
                headers,
                fileName
            );

            if (success) {
                toast.success(`Archivo CSV generado correctamente (${movimientosFiltrados.length} registros)`);
            } else {
                toast.error("Error al generar el archivo CSV");
            }

            setExportandoCSV(false);
        }, 100);
    }, [movimientosFiltrados, filtroActivo]);

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // const calcularTotal = (cantidad: number, precioUnitario: number) => {
    //     return formatearPrecio(cantidad * precioUnitario);
    // };

    const formFields: FormField[] = [
        {
            key: "fecha",
            type: "date",
            placeholder: "Fecha del movimiento",
            value: formData.fecha,
            onChange: (value) =>
                setFormData((prev) => ({ ...prev, fecha: String(value) })),
        },
        {
            key: "tipoMovimiento",
            type: "select",
            placeholder: "Selecciona el tipo de movimiento",
            value: formData.tipoMovimiento,
            onChange: (value) =>
                setFormData((prev) => ({ ...prev, tipoMovimiento: String(value) })),
            options: [
                { value: "entrada", label: "Entrada" },
                { value: "salida", label: "Salida" },
            ],
        },
        {
            key: "producto",
            type: "text",
            placeholder: "Nombre del producto",
            value: formData.producto,
            onChange: (value) =>
                setFormData((prev) => ({ ...prev, producto: String(value) })),
        },
        {
            key: "cantidad",
            type: "number",
            placeholder: "Cantidad",
            value: formData.cantidad,
            onChange: (value) =>
                setFormData((prev) => ({ ...prev, cantidad: Number(value) || 0 })),
            min: 1,
        },
        {
            key: "usuarioRegistro",
            type: "text",
            placeholder: "Usuario que registra",
            value: formData.usuarioRegistro,
            onChange: (value) =>
                setFormData((prev) => ({ ...prev, usuarioRegistro: String(value) })),
        },
        {
            key: "detalle",
            type: "textarea",
            placeholder: "Detalle del movimiento (motivo, proveedor, etc.)",
            value: formData.detalle,
            onChange: (value) =>
                setFormData((prev) => ({ ...prev, detalle: String(value) })),
        },
    ];

    const columns: TableColumn<MovimientoHistorial>[] = [
        { 
            key: "fecha", 
            title: "Fecha",
            render: (value) => formatearFecha(String(value))
        },
        {
            key: "tipoMovimiento",
            title: "Tipo",
            render: (value) => (
                <StatusBadge 
                    status={String(value)} 
                    variant="inventory"
                />
            ),
        },
        { key: "producto", title: "Producto" },
        { key: "cantidad", title: "Cantidad" },
        { key: "usuarioRegistro", title: "Usuario" },
        {
            key: "detalle",
            title: "Detalle",
            render: (value) => (
                <div className="relative group">
                    <span className="cursor-help text-primary-dark hover:text-primary-light">
                        {String(value).length > 30 ? `${String(value).substring(0, 30)}...` : String(value)}
                    </span>
                    <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        {String(value)}
                        <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <PageLayout title="Historial de Movimientos">
            <SearchAndActions
                searchValue={busqueda}
                onSearchChange={setBusqueda}
                searchPlaceholder="Buscar por producto, usuario, detalle o fecha..."
                formVisible={formVisible}
                onToggleForm={() => setFormVisible(true)}
                onSave={handleAgregarOEditar}
                onCancel={resetFormulario}
                isEditing={!!editandoId}
                addButtonText={editandoId ? "Actualizar" : "Registrar Movimiento"}
                showExport={true}
                onExport={exportarCSV}
                isExporting={exportandoCSV}
            />

            <DataForm
                ref={inputFechaRef}
                title={editandoId ? "Editar movimiento" : "Nuevo movimiento"}
                fields={formFields}
                visible={formVisible}
                isEditing={!!editandoId}
            />

            <div className="mb-6">                
                <FilterButtons
                    data={movimientos}
                    currentFilter={filtroActivo}
                    onFilterChange={(filter) => setFiltroActivo(filter as FiltroCompleto)}
                    getFilterOptions={getFilterOptions}
                    className="mb-4"
                />
            </div>

            <DataTable
                data={movimientosFiltrados}
                columns={columns}
                onEdit={handleEditar}
                onDelete={handleEliminar}
                emptyMessage="No se encontraron movimientos que coincidan con los criterios de búsqueda."
            />
        </PageLayout>
    );
}