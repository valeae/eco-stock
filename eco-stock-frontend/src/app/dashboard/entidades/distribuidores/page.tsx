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

    type Distribuidor = {
    id: number;
    nombre: string;
    telefono: number;
    correo: string;
    estado: string;
    direccion: string;
    };

    type FiltroCompleto = 'todos' | 'activos' | 'inactivos';

    const DISTRIBUIDORES_EJEMPLO: Distribuidor[] = [
    {
        id: 1,
        nombre: "Distribuidor Uno",
        telefono: 987654321,
        correo: "distribuidor1@example.com",
        estado: "Activo",
        direccion: "Calle Distribuidor 123",
    },
    {
        id: 2,
        nombre: "Distribuidor Dos",
        telefono: 987654322,
        correo: "distribuidor2@example.com",
        estado: "Activo",
        direccion: "Calle Distribuidor 456",
    },
    {
        id: 3,
        nombre: "Distribuidor Tres",
        telefono: 987654323,
        correo: "distribuidor3@example.com",
        estado: "Inactivo",
        direccion: "Calle Distribuidor 789",
    },
    ];

    export default function ListadoDistribuidores() {
        const [distribuidores, setDistribuidores] = useState<Distribuidor[]>(DISTRIBUIDORES_EJEMPLO);
        const [busqueda, setBusqueda] = useState("");
        const [editandoId, setEditandoId] = useState<number | null>(null);
        const [formVisible, setFormVisible] = useState(false);
        const [exportandoCSV, setExportandoCSV] = useState(false);
        
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

        const getFilterOptions = useCallback((data: Distribuidor[]) => {
            const total = data.length;
            const totalActivos = data.filter(p => p.estado === "Activo").length;
            const totalInactivos = data.filter(p => p.estado === "Inactivo").length;
        
            return [
                { key: 'todos', label: 'Todos', count: total, color: 'bg-primary' },
                { key: 'activos', label: 'Activos', count: totalActivos, color: 'bg-info-dark' },
                { key: 'inactivos', label: 'Inactivos', count: totalInactivos, color: 'bg-danger-dark' },
            ];
        }, []);

        const distribuidoresFiltrados = useMemo(() => {
            return distribuidores.filter((p) => {
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
        }, [distribuidores, busqueda, filtroActivo]);

        const handleAgregarOEditar = () => {
            if (!validateRequired(formData, ["nombre", "telefono", "correo", "direccion", "estado"])) {
                return;
            }

            if (formData.telefono < 0) {
                toast.error("El teléfono no puede ser negativo");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.correo)) {
                toast.error("Por favor ingrese un correo electrónico válido");
                return;
            }

            if (
                !validateUnique(
                    distribuidores,
                    formData.nombre,
                    "nombre",
                    editandoId,
                    "Ya existe un distribuidor con este nombre"
                )
            ) {
                return;
            }

            if (
                !validateUnique(
                    distribuidores,
                    formData.correo,
                    "correo",
                    editandoId,
                    "Ya existe un distribuidor con este correo electrónico"
                )
            ) {
                return;
            }

            if (editandoId) {
                setDistribuidores((prev) =>
                    prev.map((p) => (p.id === editandoId ? { ...p, ...formData } : p))
                );
                toast.success("Distribuidor actualizado correctamente");
                setEditandoId(null);
            } else {
                const nuevoDistribuidor: Distribuidor = {
                    id: Date.now(),
                    ...formData,
                };
                setDistribuidores((prev) => [...prev, nuevoDistribuidor]);
                toast.success("Distribuidor agregado correctamente");
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

        const handleEditar = (distribuidor: Distribuidor) => {
            setEditandoId(distribuidor.id);
            setFormData({
                nombre: distribuidor.nombre,
                telefono: distribuidor.telefono,
                correo: distribuidor.correo,
                estado: distribuidor.estado,
                direccion: distribuidor.direccion,
            });
            setFormVisible(true);
        };

        const handleEliminar = (distribuidor: Distribuidor) => {
            setDistribuidores((prev) => prev.filter((p) => p.id !== distribuidor.id));
            toast.info(`Distribuidor eliminado: ${distribuidor.nombre}`);
        };

        const handleCambiarEstado = (distribuidor: Distribuidor) => {
            const nuevoEstado = distribuidor.estado === "Activo" ? "Inactivo" : "Activo";
            setDistribuidores((prev) =>
                prev.map((p) => (p.id === distribuidor.id ? { ...p, estado: nuevoEstado } : p))
            );
            toast.success(`Distribuidor ${distribuidor.nombre} marcado como ${nuevoEstado}`);
        };

        const exportarCSV = useCallback(() => {
            setExportandoCSV(true);

            setTimeout(() => {
                const headers = ["Nombre", "Teléfono", "Correo", "Dirección", "Estado"];
                const fileName = `distribuidores_${filtroActivo}_${new Date().toISOString().split('T')[0]}.csv`;
                
                const success = exportToCSV(
                    distribuidoresFiltrados,
                    headers,
                    fileName
                );

                if (success) {
                    toast.success(`Archivo CSV generado correctamente (${distribuidoresFiltrados.length} registros)`);
                } else {
                    toast.error("Error al generar el archivo CSV");
                }

                setExportandoCSV(false);
            }, 100);
        }, [distribuidoresFiltrados, filtroActivo]);

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

        const columns: TableColumn<Distribuidor>[] = [
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
            <PageLayout title="Distribuidores">
                <SearchAndActions
                    searchValue={busqueda}
                    onSearchChange={setBusqueda}
                    searchPlaceholder="Buscar por nombre, correo o dirección..."
                    formVisible={formVisible}
                    onToggleForm={() => setFormVisible(true)}
                    onSave={handleAgregarOEditar}
                    onCancel={resetFormulario}
                    isEditing={!!editandoId}
                    addButtonText={editandoId ? "Actualizar" : "Agregar Distribuidor"}
                    showExport={true}
                    onExport={exportarCSV}
                    isExporting={exportandoCSV}
                />

                <DataForm
                    ref={inputNombreRef}
                    title={editandoId ? "Editar distribuidor" : "Nuevo distribuidor"}
                    fields={formFields}
                    visible={formVisible}
                    isEditing={!!editandoId}
                />

                <div className="mb-6">                
                    <FilterButtons
                        data={distribuidores}
                        currentFilter={filtroActivo}
                        onFilterChange={(filter) => setFiltroActivo(filter as FiltroCompleto)}
                        getFilterOptions={getFilterOptions}
                        className="mb-4"
                    />
                </div>

                <DataTable
                                data={distribuidoresFiltrados}
                                columns={columns}
                                onEdit={handleEditar}
                                onDelete={handleEliminar}
                                emptyMessage="No se encontraron registros que coincidan con los criterios de búsqueda."
                                customActions={(distribuidor) => (
                                    <button
                                        type="button"
                                        onClick={() => handleCambiarEstado(distribuidor)}
                                        className={`px-3 py-1 rounded-md transition-colors text-sm font-medium ${
                                            distribuidor.estado === "Activo"
                                                ? "bg-accent text-white "
                                                : "bg-info text-white "
                                        }`}
                                        title={distribuidor.estado === "Activo" ? "Marcar como inactivo" : "Marcar como activo"}
                                    >
                                        {distribuidor.estado === "Activo" ? "Desactivar" : "Reactivar"}
                                    </button>
                                )}
                            />
            </PageLayout>
        );
    }
