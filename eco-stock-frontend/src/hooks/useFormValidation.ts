// hooks/useFormValidation.ts
import { toast } from "sonner";

export const useFormValidation = () => {
  const validateRequired = (fields: Record<string, unknown>, fieldNames: string[]) => {
    const emptyFields = fieldNames.filter(field => {
      const value = fields[field];
      return !value || (typeof value === "string" && !value.trim()) || 
             (typeof value === "number" && value < 0);
    });

    if (emptyFields.length > 0) {
      toast.error("Todos los campos son obligatorios");
      return false;
    }
    return true;
  };

  const validateUnique = <T extends { id: number | string }>(
    items: T[],
    newValue: string,
    field: keyof T,
    editingId?: number | string | null,
    message = "Este elemento ya existe"
  ) => {
    const existing = items.find(
      item => 
        String(item[field]).toLowerCase() === newValue.toLowerCase() && 
        item.id !== editingId
    );

    if (existing) {
      toast.warning(message);
      return false;
    }
    return true;
  };

  return { validateRequired, validateUnique };
};