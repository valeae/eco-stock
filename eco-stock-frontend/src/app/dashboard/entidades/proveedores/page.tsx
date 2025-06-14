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

type Proveedor = {
  id: number;
  nombre: string;
  telefono: number;
  correo: string;
  estado: string;
  direccion: string;
};

type FiltroCompleto = 'todos' | 'activos' | 'inactivos';

const PROVEEDORES_EJEMPLO: Proveedor[] = [
  {
    id: 1,
    nombre: "Juan Perez",
    telefono: 987654321,
    correo: "juan@perez.com",
    estado: "Activo",
    direccion: "Av. Juan Perez, 123",
  },
  {
    id: 2,
    nombre: "Carlos Perez",
    telefono: 987654322,
    correo: "carlos@perez.com",
    estado: "Activo",
    direccion: "Av. Carlos Perez, 456",
  },
  {
    id: 3,
    nombre: "Ana Perez",
    telefono: 987654323,
    correo: "ana@perez.com",
    estado: "Inactivo",
    direccion: "Av. Ana Perez, 789",
  },
  {
    id: 4,
    nombre: "Luis Martinez",
    telefono: 987654324,
    correo: "luis@martinez.com",
    estado: "Inactivo",
    direccion: "Av. Luis Martinez, 321",
  },
  {
    id: 5,
    nombre: "Maria Rodriguez",
    telefono: 987654325,
    correo: "maria@rodriguez.com",
    estado: "Activo",
    direccion: "Av. Maria Rodriguez, 654",
  },
];

export default function ListadoProveedores() {
    const [proveedores, setProveedores] = useState<Proveedor[]>(PROVEEDORES_EJEMPLO);
    const [busqueda, setBusqueda] = useState("");
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [formVisible, setFormVisible] = useState(false);
    const [exportandoCSV, setExportandoCSV] = useState(false);
    
    // Filtro simplificado para solo activo/inactivo
    const [filtroActivo, setFiltroActivo] = useState<FiltroCompleto>('todos');

    const [formData, setFormData] = useState({
        nombre: "",
        telefono: 0,
        correo: "",
        direccion: "",
        estado: "",
    });

    const inputNombreRef = useRef<HTMLInputElement>(null);
    const { validateRequired, validateUnique } = useFormValidation();

    // Función para obtener opciones de filtro simplificada
    const getFilterOptions = useCallback((data: Proveedor[]) => {
        const total = data.length;
        const totalActivos = data.filter(p => p.estado === "Activo").length;
        const totalInactivos = data.filter(p => p.estado === "Inactivo").length;
    
        return [
            { key: 'todos', label: 'Todos', count: total, color: 'bg-primary' },
            { key: 'activos', label: 'Activos', count: totalActivos, color: 'bg-info-dark' },
            { key: 'inactivos', label: 'Inactivos', count: totalInactivos, color: 'bg-danger-dark' },
        ];
    }, []);

    // Filtrado de datos simplificado
    const proveedoresFiltrados = useMemo(() => {
        return proveedores.filter((p) => {
            const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                                    p.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
                                    p.direccion.toLowerCase().includes(busqueda.toLowerCase());
    
            let coincideFiltro = true;
            switch (filtroActivo) {
                case 'activos':
                    coincideFiltro = p.estado === 'Activo';
                    break;
                case 'inactivos':
                    coincideFiltro = p.estado === 'Inactivo';
                    break;
                default:
                    coincideFiltro = true;
            }
    
            return coincideBusqueda && coincideFiltro;
        });
    }, [proveedores, busqueda, filtroActivo]);

    const handleAgregarOEditar = () => {
        if (!validateRequired(formData, ["nombre", "telefono", "correo", "direccion", "estado"])) {
            return;
        }

        if (formData.telefono < 0) {
            toast.error("El teléfono no puede ser negativo");
            return;
        }

        // Validación de email básica
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.correo)) {
            toast.error("Por favor ingrese un correo electrónico válido");
            return;
        }

        if (
            !validateUnique(
                proveedores,
                formData.nombre,
                "nombre",
                editandoId,
                "Ya existe un proveedor con este nombre"
            )
        ) {
            return;
        }

        // Validar correo único
        if (
            !validateUnique(
                proveedores,
                formData.correo,
                "correo",
                editandoId,
                "Ya existe un proveedor con este correo electrónico"
            )
        ) {
            return;
        }

        if (editandoId) {
            setProveedores((prev) =>
                prev.map((p) => (p.id === editandoId ? { ...p, ...formData } : p))
            );
            toast.success("Proveedor actualizado correctamente");
            setEditandoId(null);
        } else {
            const nuevoProveedor: Proveedor = {
                id: Date.now(),
                ...formData,
            };
            setProveedores((prev) => [...prev, nuevoProveedor]);
            toast.success("Proveedor agregado correctamente");
        }

        resetFormulario();
    };

    const resetFormulario = () => {
        setFormData({
            nombre: "",
            telefono: 0,
            correo: "",
            direccion: "",
            estado: "",
        });
        setFormVisible(false);
        setEditandoId(null);
    };

    const handleEditar = (proveedor: Proveedor) => {
        setEditandoId(proveedor.id);
        setFormData({
            nombre: proveedor.nombre,
            telefono: proveedor.telefono,
            correo: proveedor.correo,
            estado: proveedor.estado,
            direccion: proveedor.direccion,
        });
        setFormVisible(true);
    };

    const handleEliminar = (proveedor: Proveedor) => {
        setProveedores((prev) => prev.filter((p) => p.id !== proveedor.id));
        toast.info(`Proveedor eliminado: ${proveedor.nombre}`);
    };

    const handleCambiarEstado = (proveedor: Proveedor) => {
        const nuevoEstado = proveedor.estado === "Activo" ? "Inactivo" : "Activo";
        setProveedores((prev) =>
            prev.map((p) => (p.id === proveedor.id ? { ...p, estado: nuevoEstado } : p))
        );
        toast.success(`Proveedor ${proveedor.nombre} marcado como ${nuevoEstado}`);
    };

    const exportarCSV = useCallback(() => {
        setExportandoCSV(true);

        setTimeout(() => {
            const headers = ["Nombre", "Teléfono", "Correo", "Dirección", "Estado"];
            const fileName = `proveedores_${filtroActivo}_${new Date().toISOString().split('T')[0]}.csv`;
            
            const success = exportToCSV(
                proveedoresFiltrados,
                headers,
                fileName
            );

            if (success) {
                toast.success(`Archivo CSV generado correctamente (${proveedoresFiltrados.length} registros)`);
            } else {
                toast.error("Error al generar el archivo CSV");
            }

            setExportandoCSV(false);
        }, 100);
    }, [proveedoresFiltrados, filtroActivo]);

    const formFields: FormField[] = [
        {
            key: "nombre",
            type: "text",
            placeholder: "Nombre completo",
            value: formData.nombre,
            onChange: (value) =>
                setFormData((prev) => ({ ...prev, nombre: String(value) })),
        },
        {
            key: "telefono",
            type: "number",
            placeholder: "Número de teléfono",
            value: formData.telefono,
            onChange: (value) =>
                setFormData((prev) => ({ ...prev, telefono: Number(value) || 0 })),
            min: 0,
        },
        {
            key: "correo",
            type: "email",
            placeholder: "Correo electrónico",
            value: formData.correo,
            onChange: (value) =>
                setFormData((prev) => ({ ...prev, correo: String(value) })),
        },
        {
            key: "direccion",
            type: "text",
            placeholder: "Dirección completa",
            value: formData.direccion,
            onChange: (value) =>
                setFormData((prev) => ({ ...prev, direccion: String(value) })),
        },
        {
            key: "estado",
            type: "select",
            placeholder: "Selecciona el estado",
            value: formData.estado,
            onChange: (value) =>
                setFormData((prev) => ({ ...prev, estado: String(value) })),
            options: [
                { value: "Activo", label: "Activo" },
                { value: "Inactivo", label: "Inactivo" },
            ],
        },
    ];

    const columns: TableColumn<Proveedor>[] = [
        { key: "nombre", title: "Nombre" },
        { key: "telefono", title: "Teléfono" },
        { key: "correo", title: "Correo" },
        { key: "direccion", title: "Dirección" },
        {
            key: "estado",
            title: "Estado",
            render: (value) => (
                <StatusBadge status={String(value)} variant="inventory" />
            ),
        },
    ];

    return (
        <PageLayout title="Proveedores">
            <SearchAndActions
                searchValue={busqueda}
                onSearchChange={setBusqueda}
                searchPlaceholder="Buscar por nombre, correo o dirección..."
                formVisible={formVisible}
                onToggleForm={() => setFormVisible(true)}
                onSave={handleAgregarOEditar}
                onCancel={resetFormulario}
                isEditing={!!editandoId}
                addButtonText={editandoId ? "Actualizar" : "Agregar Proveedor"}
                showExport={true}
                onExport={exportarCSV}
                isExporting={exportandoCSV}
            />

            <DataForm
                ref={inputNombreRef}
                title={editandoId ? "Editar proveedor" : "Nuevo proveedor"}
                fields={formFields}
                visible={formVisible}
                isEditing={!!editandoId}
            />

            {/* Filtros simplificados para solo activo/inactivo */}
            <div className="mb-6">                
                <FilterButtons
                    data={proveedores}
                    currentFilter={filtroActivo}
                    onFilterChange={(filter) => setFiltroActivo(filter as FiltroCompleto)}
                    getFilterOptions={getFilterOptions}
                    className="mb-4"
                />
            </div>

            {/* Tabla principal */}
            <DataTable
                data={proveedoresFiltrados}
                columns={columns}
                onEdit={handleEditar}
                onDelete={handleEliminar}
                emptyMessage="No se encontraron registros que coincidan con los criterios de búsqueda."
                customActions={(proveedor) => (
                    <button
                        type="button"
                        onClick={() => handleCambiarEstado(proveedor)}
                        className={`px-3 py-1 rounded-md transition-colors text-sm font-medium ${
                            proveedor.estado === "Activo"
                                ? "bg-accent text-white "
                                : "bg-info text-white "
                        }`}
                        title={proveedor.estado === "Activo" ? "Marcar como inactivo" : "Marcar como activo"}
                    >
                        {proveedor.estado === "Activo" ? "Desactivar" : "Reactivar"}
                    </button>
                )}
            />
        </PageLayout>
    );
}