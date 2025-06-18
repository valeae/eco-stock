"use client";

import { X, LogOut, User } from "lucide-react";
import { useEffect } from "react";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  userName?: string;
  isLoading?: boolean;
}

export default function LogoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "¿Cerrar sesión?",
  message = "Tu sesión se cerrará y tendrás que volver a iniciar sesión para acceder.",
  confirmText = "Sí, cerrar sesión",
  cancelText = "Cancelar",
  userName,
  isLoading = false,
}: LogoutConfirmationModalProps) {
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
      <div className="fixed inset-0 bg-heading/20 backdrop-blur-sm transition-opacity" />

      <div className="relative bg-white rounded-2xl shadow-md border border-muted max-w-md w-full transition-all overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-muted">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-ecoLight border-2 border-primary">
              <LogOut className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-heading">
              {title}
            </h3>
          </div>
          <button
            title="Cerrar"
            type="button"
            className="text-muted-dark hover:text-heading hover:bg-muted-light rounded-full p-2 transition-colors"
            onClick={onClose}
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <p className="text-heading-light text-base leading-relaxed">
            {message}
          </p>

          {userName && (
            <div className="flex items-center gap-3 rounded-lg bg-primary-ecoLight p-4 border border-primary/20">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-heading">
                  {userName}
                </p>
                <p className="text-xs text-muted-dark">
                  Emanuel Palacio
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 pt-0 bg-muted-light/30">
          <button
            type="button"
            className="flex-1 px-6 py-3 text-heading bg-white hover:bg-muted-light border border-muted rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 hover:shadow-sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={`flex-1 px-6 py-3 text-white rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 bg-primary hover:bg-primary-dark ${
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:shadow-sm transform hover:-translate-y-0.5"
            }`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Cerrando...
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