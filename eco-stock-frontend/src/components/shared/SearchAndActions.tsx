import { Plus, Download, Loader2 } from "lucide-react";

interface SearchAndActionsProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  formVisible: boolean;
  onToggleForm: () => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  addButtonText?: string;
  saveButtonText?: string;
  editButtonText?: string;
  showExport?: boolean;
  onExport?: () => void;
  isExporting?: boolean;
  exportButtonText?: string;
  showAddButton?: boolean;
}

export default function SearchAndActions({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  formVisible,
  onToggleForm,
  onSave,
  onCancel,
  isEditing,
  addButtonText = "Agregar",
  saveButtonText = "Guardar",
  editButtonText = "Guardar cambios",
  showExport = false,
  onExport,
  isExporting = false,
  exportButtonText = "Exportar",
  showAddButton = true,
}: SearchAndActionsProps) {
  return (
    <div className="w-full max-w-4xl flex flex-col md:flex-row md:items-center gap-4 mb-6">
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="p-3 border rounded-md w-full md:w-1/2"
      />
      <div className="flex flex-wrap gap-2 md:ml-auto">
        {!formVisible && (
          <>
            {showAddButton !== false && (
              <button
                type="button"
                onClick={onToggleForm}
                className="bg-primary-dark text-white px-6 py-2 rounded-md hover:bg-primary-light transition flex items-center gap-2"
              >
                <Plus size={18} />
                {addButtonText}
              </button>
            )}
            {showExport && onExport && (
              <button
                type="button"
                onClick={onExport}
                disabled={isExporting}
                className="bg-primary-dark text-white px-6 py-2 rounded-md transition flex items-center gap-2"
              >
                {isExporting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    {exportButtonText}
                  </>
                )}
              </button>
            )}
          </>
        )}
        {formVisible && (
          <>
            <button
              type="button"
              onClick={onSave}
              className="bg-primary-dark text-white px-6 py-2 rounded-md hover:bg-primary-light transition"
            >
              {isEditing ? editButtonText : saveButtonText}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-muted-dark text-white px-6 py-2 rounded-md hover:bg-muted-light transition"
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
