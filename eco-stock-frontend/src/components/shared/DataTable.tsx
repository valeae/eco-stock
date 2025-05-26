// components/shared/DataTable.tsx
import { Edit, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

export interface TableColumn<T> {
  key: Extract<keyof T, string | number>;
  title: string;
  render?: (value: T[keyof T], item: T) => ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export interface TableAction<T> {
  id: string;
  type: "edit" | "delete" | "custom";
  icon?: ReactNode;
  onClick: (item: T) => void;
  title?: string;
  className?: string;
  show?: (item: T) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
  rowClassName?: (item: T) => string;
}

// Componente auxiliar para renderizar badges de estado
export const StatusBadge = ({ 
  status, 
  variant = "default" 
}: { 
  status: string; 
  variant?: "inventory" | "activity" | "default" 
}) => {
  const getStatusStyles = () => {
    if (variant === "inventory") {
      switch (status.toLowerCase()) {
        case "disponible":
          return "bg-green-100 text-green-800 border-green-200";
        case "agotado":
          return "bg-red-100 text-red-800 border-red-200";
        case "próximo a agotarse":
        case "proximo a agotarse":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    }
    
    if (variant === "activity") {
      switch (status.toLowerCase()) {
        case "activo":
          return "bg-green-100 text-green-800 border-green-200";
        case "inactivo":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    }
    
    // Default variant
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

// componente auxiliar para fechas de expiración
export const ExpirationDate = ({ 
  date, 
  showDaysRemaining = true 
}: { 
  date: string; 
  showDaysRemaining?: boolean 
}) => {
  const calculateDaysRemaining = (dateString: string) => {
    const today = new Date();
    const expirationDate = new Date(dateString);
    return Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getDaysStyles = (days: number) => {
    if (days <= 0) return "bg-red-100 text-red-700";
    if (days <= 5) return "bg-red-100 text-red-700";
    if (days <= 15) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const daysRemaining = calculateDaysRemaining(date);

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-sm">
        {formatDate(date)}
      </span>
      {showDaysRemaining && (
        <span className={`text-xs px-2 py-1 rounded-full ${getDaysStyles(daysRemaining)}`}>
          {daysRemaining > 0
            ? `${daysRemaining} días`
            : `Vencido hace ${Math.abs(daysRemaining)} días`}
        </span>
      )}
    </div>
  );
};


export default function DataTable<T extends { id: number | string }>({
  data,
  columns,
  actions = [],
  onEdit,
  onDelete,
  emptyMessage = "No se encontraron elementos",
  className = "",
  rowClassName,
}: DataTableProps<T>) {
  const defaultActions: TableAction<T>[] = [];
  
  if (onEdit) {
    defaultActions.push({
      id: `default-${defaultActions.length}`,
      type: "edit",
      icon: <Edit size={18} />,
      onClick: onEdit,
      title: "Editar",
      className: "bg-primary-dark text-white p-2 rounded-md hover:bg-primary-light transition",
    });
  }
  
  if (onDelete) {
    defaultActions.push({
      id: `default-${defaultActions.length}`,
      type: "delete",
      icon: <Trash2 size={18} />,
      onClick: onDelete,
      title: "Eliminar",
      className: "bg-primary-dark text-white p-2 rounded-md hover:bg-primary-light transition",
    });
  }

  const allActions = [...defaultActions, ...actions];

  const renderCell = (column: TableColumn<T>, item: T) => {
    const value = item[column.key as keyof T];
  
    if (column.render) {
      return column.render(value, item);
    }
  
    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      return value;
    }
  
    return String(value ?? "");
  };
  
  const getAlignClass = (align?: string) => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  return (
    <div className={`overflow-x-auto w-full max-w-4xl bg-white shadow-md rounded-xl ${className}`}>
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-primary-dark text-white">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`py-4 px-6 ${getAlignClass(column.align)} ${column.className || ""}`}
              >
                {column.title}
              </th>
            ))}
            {allActions.length > 0 && (
              <th className="py-4 px-6 text-center">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-muted-default hover:bg-muted-light transition ${
                  rowClassName ? rowClassName(item) : ""
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`py-4 px-6 ${getAlignClass(column.align)} ${column.className || ""}`}
                  >
                    {renderCell(column, item)}
                  </td>
                ))}
                {allActions.length > 0 && (
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center gap-2">
                      {allActions.map((action) => {
                        if (action.show && !action.show(item)) return null;
                        
                        return (
                          <button
                            key={action.id}
                            type="button"
                            onClick={() => action.onClick(item)}
                            className={action.className}
                            title={action.title}
                          >
                            {action.icon}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (allActions.length > 0 ? 1 : 0)}
                className="text-center py-4 text-muted-dark"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}