"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import LogoutConfirmationModal from "@/components/shared/LogoutConfirmation";

interface HeaderProps {
  timeString: string;
  dateString: string;
}

export default function HeaderSection({ timeString, dateString }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Función para mostrar el modal de confirmación
  const handleLogoutClick = () => {
    setIsOpen(false); // Cerrar el dropdown
    setShowLogoutModal(true); // Mostrar el modal
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowLogoutModal(false);
    setIsLoggingOut(false);
  };

  // Función para confirmar el logout
  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Aquí puedes agregar lógica adicional como:
      // - Llamar a una API para cerrar sesión
      // - Limpiar localStorage/sessionStorage
      // - Limpiar cookies

      // Simular un pequeño retraso para mostrar el loading
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirigir a la página de inicio/login
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setIsLoggingOut(false);
      // Aquí podrías mostrar un mensaje de error
    }
  };

  return (
    <>
      <header className="bg-[#1f2937] bg-gradient-to-r from-primary via-primary-DEFAULT to-primary-dark text-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          {/* Información de bienvenida */}
          <div>
            <h2 className="text-2xl font-bold mb-2">Bienvenido</h2>
            <p className="text-white/90">Sistema de gestión EcoStock</p>
          </div>

          {/* Hora, Fecha y Usuario */}
          <div className="flex items-center gap-6 relative" ref={dropdownRef}>
            {/* Hora y Fecha */}
            <div className="text-right mr-4">
              <div className="text-3xl font-bold">{timeString}</div>
              <div className="text-sm opacity-85">{dateString}</div>
            </div>

            {/* Usuario + Dropdown */}
            <button
              type="button"
              className="flex items-center bg-white/10 px-3 py-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="h-8 w-8 rounded-full text-primary-DEFAULT font-bold flex items-center justify-center mr-2 shadow-sm">
                <User size={18} />
              </div>
              <span className="hidden md:inline font-medium">
                Administrador
              </span>
            </button>

            {/* Menú desplegable */}
            {isOpen && (
              <div className="absolute right-0 top-16 bg-white text-gray-800 rounded-xl shadow-xl w-52 z-50 animate-fade-in border border-gray-200">
                <Link
                  href="/dashboard/perfil"
                  className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={18} className="text-primary" />
                  <span className="text-sm">Perfil</span>
                </Link>
                <div className="border-t border-gray-200 my-1" />
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                >
                  <LogOut size={18} className="text-red-500" />
                  <span className="text-sm">Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal de confirmación de logout */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogout}
        userName="Administrador"
        isLoading={isLoggingOut}
      />
    </>
  );
}
