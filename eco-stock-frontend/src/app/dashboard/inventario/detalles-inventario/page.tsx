// eco-stock-frontend/src/components/dashboard/MovimientosHistorialConnected.tsx
"use client";

import { useRef, useState, useCallback, useMemo, useEffect } from "react";
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

//Services
import { inventoryService, MovimientoInventario } from "@/services/inventoryService";
import { formatDate, formatDateTime } from "@/utils/formatters";

//Hooks
import { useFormValidation } from "@/hooks/useFormValidation";

type FiltroCompleto = 'todos' | 'entrada' | 'salida';

export default function MovimientosHistorialConnected() {
    const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [formVisible, setFormVisible] = useState(false);
    const [exportandoCSV, setExportandoCSV] = useState(false);
    
    const [filtroActivo, setFiltroActivo] = useState<FiltroCompleto>('todos');

    const [formData, setFormData] = useState({
        fecha: "",
        tipoMovimiento: "",
        producto: 0,
        cantidad: 0,
        observaciones: "",
    });

    const inputFechaRef = useRef<HTMLInputElement>(null);
    const { validateRequired } = useFormValidation();

    // Cargar movimientos al montar el componente
    useEffect(() => {
        loadMovimientos();
    }, []);

    const loadMovimientos = async () => {
        try {
            setIsLoading(true);
            const data = await inventoryService.getMovimientos();
            setMovimientos(data);
        } catch (error) {
            console.error('Error loading movimientos:', error);
            toast.error('Error al cargar los movimientos');
        } finally {
            setIsLoading(false);
        }
    };

    const getFilterOptions = useCallback((data: MovimientoInventario[]) => {
        const total = data.length;
        const totalEntradas = data.filter(m => m.tipo_movimiento === "entrada").length;
        const totalSalidas = data.filter(m => m.tipo_movimiento === "salida").length;
    
        return [
            { key: 'todos', label: 'Todos', count: total, color: 'bg-primary' },
            { key: 'entrada', label: 'Entradas', count: totalEntradas, color: 'bg-info-dark' },
            { key: 'salida', label: 'Salidas', count: totalSalidas, color: 'bg-danger-dark' },
        ];
    }, []);

    const movimientosFiltrados = useMemo(() => {
        return movimientos.filter((m) => {
            const coincideBusqueda = m.producto_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
                                    m.observaciones?.toLowerCase().includes(busqueda.toLowerCase()) ||
                                    m.fecha.includes(busqueda);
    
            let coincideFiltro = true;
            switch (filtroActivo) {
                case 'entrada':
                    coincideFiltro = m.tipo_movimiento === 'entrada';
                    break;
                case 'salida':
                    coincideFiltro = m.tipo_movimiento === 'salida';
                    break;
                default:
                    coincideFiltro = true;
            }
    
            return coincideBusqueda && coincideFiltro;
        });
    }, [movimientos, busqueda, filtroActivo]);

    const handleAgregarOEditar = async () => {
        if (!validateRequired(formData, ["fecha", "tipoMovimiento", "producto", "cantidad"])) {
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

        try {
            if (editandoId) {
                await inventoryService.updateMovimiento(editandoId, {
                    ...formData,
                    tipo_movimiento: formData.tipoMovimiento as "entrada" | "salida"
                });
                toast.success("Movimiento actualizado correctamente");
                setEditandoId(null);
            } else {
                await inventoryService.createMovimiento({
                    ...formData,
                    tipo_movimiento: formData.tipoMovimiento as "entrada" | "salida"
                });
                toast.success("Movimiento registrado correctamente");
            }
            
            await loadMovimientos(); // Recargar datos
            resetFormulario();
        } catch (error) {
            console.error('Error saving movimiento:', error);
            toast.error('Error al guardar el movimiento');
        }
    };

    const resetFormulario = () => {
        setFormData({
            fecha: "",
            tipoMovimiento: "",
            producto: 0,
            cantidad: 0,
            observaciones: "",
        });
        setFormVisible(false);
        setEditandoId(null);
    };

    const handleEditar = (movimiento: MovimientoInventario) => {
        setEditandoId(movimiento.id);
        setFormData({
            fecha: movimiento.fecha,
            tipoMovimiento: movimiento.tipo_movimiento,
            producto: movimiento.producto,
            cantidad: movimiento.cantidad,
            observaciones: movimiento.observaciones || "",
        });
        setFormVisible(true);
    };

    const handleEliminar = async (movimiento: MovimientoInventario) => {
        try {
            await inventoryService.deleteMovimiento(movimiento.id);
            toast.info(`Movimiento eliminado: ${movimiento.producto_nombre} - ${formatDate(movimiento.fecha)}`);
            await loadMovimientos(); // Recargar datos
        } catch (error) {
            console.error('Error deleting movimiento:', error);
            toast.error('Error al eliminar el movimiento');
        }
    };

    const exportarCSV = useCallback(() => {
        setExportandoCSV(true);

        setTimeout(() => {
            const headers = ["Fecha", "Tipo Movimiento", "Producto", "Cantidad", "Observaciones"];
            const fileName = `movimientos_historial_${filtroActivo}_${new Date().toISOString().split('T')[0]}.csv`;
            
            const dataForExport = movimientosFiltrados.map(m => ({
                Fecha: formatDate(m.fecha),
                "Tipo Movimiento": m.tipo_movimiento,
                Producto: m.producto_nombre || `ID: ${m.producto}`,
                Cantidad: m.cantidad,
                Observaciones: m.observaciones || '',
            }));
            
            const success = exportToCSV(
                dataForExport,
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
            type: "number",
            placeholder: "ID del producto",
            value: formData.producto,
            onChange: (value) =>
                setFormData((prev) => ({ ...prev, producto: Number(value) || 0 })),
            min: 1,
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
            key: "observaciones",
            type: "textarea",
            placeholder: "Observaciones del movimiento",
            value: formData.observaciones,
            onChange: (value) =>
                setFormData((prev) => ({ ...prev, observaciones: String(value) })),
        },
    ];

    const columns: TableColumn<MovimientoInventario>[] = [
        { 
            key: "fecha", 
            title: "Fecha",
            render: (value) => formatDate(String(value))
        },
        {
            key: "tipo_movimiento",
            title: "Tipo",
            render: (value) => (
                <StatusBadge 
                    status={String(value)} 
                    variant="inventory"
                />
            ),
        },
        { 
            key: "producto_nombre", 
            title: "Producto",
            render: (value, row) => value || `ID: ${row.producto}`
        },
        { key: "cantidad", title: "Cantidad" },
        {
            key: "observaciones",
            title: "Observaciones",
            render: (value) => {
                const observaciones = String(value || '');
                return (
                    <div className="relative group">
                        <span className="cursor-help text-primary-dark hover:text-primary-light">
                            {observaciones.length > 30 ? `${observaciones.substring(0, 30)}...` : observaciones || 'Sin observaciones'}
                        </span>
                        {observaciones && observaciones.length > 30 && (
                            <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                {observaciones}
                                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                        )}
                    </div>
                );
            },
        },
    ];

    if (isLoading) {
        return (
            <PageLayout title="Historial de Movimientos">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Historial de Movimientos">
            <SearchAndActions
                searchValue={busqueda}
                onSearchChange={setBusqueda}
                searchPlaceholder="Buscar por producto, observaciones o fecha..."
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