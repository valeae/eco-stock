import { forwardRef } from "react";

export interface FormField {
  key: string;
  type: "text" | "number" | "date" | "select" | "textarea";
  placeholder?: string;
  label?: string;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  options?: { value: string; label: string }[];
  min?: number;
  rows?: number;
  colSpan?: "full" | 1 | 2 | 3;
  required?: boolean;
}

interface DataFormProps {
  title: string;
  fields: FormField[];
  visible: boolean;
  isEditing: boolean;
  className?: string;
}

const DataForm = forwardRef<HTMLDivElement, DataFormProps>(
  ({ title, fields, visible, isEditing, className = "" }, ref) => {
    if (!visible) return null;

    const renderField = (field: FormField) => {
      const baseClassName = "p-2 border rounded-md";
      const colSpanClass =
        field.colSpan === "full"
          ? "col-span-full"
          : field.colSpan === 2
          ? "md:col-span-2"
          : field.colSpan === 3
          ? "md:col-span-3"
          : "";

      const fieldClassName = `${baseClassName} ${colSpanClass}`;

      switch (field.type) {
        case "textarea":
          return (
            <textarea
              key={field.key}
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                field.onChange(e.target.value)
              }
              className={fieldClassName}
              rows={field.rows || 3}
            />
          );

        case "select":
          return (
            <select
              key={field.key}
              value={field.value}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                field.onChange(e.target.value)
              }
              className={fieldClassName}
              aria-label={field.label || field.placeholder}
            >
              <option value="">{field.placeholder}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );

        case "number":
          return (
            <input
              key={field.key}
              type="number"
              placeholder={field.placeholder}
              value={field.value}
              min={field.min || 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                field.onChange(Number.parseInt(e.target.value) || 0)
              }
              className={fieldClassName}
            />
          );

        case "date":
          return (
            <input
              key={field.key}
              type="date"
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                field.onChange(e.target.value)
              }
              className={fieldClassName}
            />
          );

        default:
          return (
            <input
              key={field.key}
              type="text"
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                field.onChange(e.target.value)
              }
              className={fieldClassName}
            />
          );
      }
    };

    return (
      <div
        ref={ref}
        className={`w-full max-w-4xl bg-white shadow-md rounded-xl p-6 mb-8 ${className}`}
      >
        <h3 className="text-xl font-semibold mb-4">
          {isEditing
            ? `Editar ${title.toLowerCase()}`
            : `Agregar nuevo ${title.toLowerCase()}`}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fields.map((field) => renderField(field))}
        </div>
      </div>
    );
  }
);

DataForm.displayName = "DataForm";

export default DataForm;