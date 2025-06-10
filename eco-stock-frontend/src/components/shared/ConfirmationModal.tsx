"use client";

import { X, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  itemName?: string;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar eliminación",
  message = "¿Estás seguro de que deseas eliminar este elemento?",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  type = "danger",
  itemName,
  isLoading = false,
}: ConfirmationModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const iconColors = {
    danger: "text-danger bg-danger-light border-danger",
    warning: "text-warning bg-warning-light border-warning",
    info: "text-info bg-info-light border-info",
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) onClose();
  };

  const handleBackdropKeyUp = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isLoading) onClose();
  };

  return (
    <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    onClick={handleBackdropClick}
    onKeyUp={handleBackdropKeyUp}
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />

      <div className="relative bg-muted-light rounded-2xl shadow-md border border-muted max-w-md w-full transition-all overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-muted">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-xl border-2 ${iconColors[type]}`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-heading">
              {title}
            </h3>
          </div>
          <button
            title="Cerrar"
            type="button"
            className="text-muted-dark hover:text-heading-dark hover:bg-muted rounded-full p-2 transition-colors"
            onClick={onClose}
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="text-heading text-sm">{message}</p>

          {itemName && (
            <div className="rounded-md bg-muted p-3 border border-muted-dark">
              <p className="text-sm font-medium text-heading">
                {itemName}
              </p>
            </div>
          )}

          <p className="text-xs text-accent-dark">
            Esta acción no se puede deshacer.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 pt-0">
          <button
            type="button"
            className="flex-1 px-4 py-2.5 text-white bg-primary hover:bg-primary-dark rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 bg-danger hover:bg-danger-dark focus:ring-danger ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-md transform hover:-translate-y-0.5"
            }`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Eliminando...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
