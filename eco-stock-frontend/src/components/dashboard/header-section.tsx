"use client";

import { Bell, Settings, User } from "lucide-react";

interface HeaderProps {
  timeString: string;
  dateString: string;
}

export default function HeaderSection({ timeString, dateString }: HeaderProps) {
  return (
    <div className="bg-[#1f2937] bg-gradient-to-r from-primary via-primary-DEFAULT to-primary-dark text-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Bienvenido</h2>
          <p className="text-white/90">Sistema de gestión EcoStock</p>
        </div>

        <div className="flex items-center gap-6">
          {/* Hora y fecha */}
          <div className="text-right mr-4">
            <div className="text-3xl font-bold">{timeString}</div>
            <div className="text-sm opacity-85">{dateString}</div>
          </div>

          {/* Íconos de notificaciones, configuración y usuario */}
          <div className="flex items-center gap-4">
            {/* Notificaciones */}
            <button
              type="button"
              className="p-2 rounded-full hover:bg-white/20 transition-colors relative"
            >
              <Bell size={24} />
              <span className="absolute top-0 right-0 bg-danger-DEFAULT text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                3
              </span>
            </button>

            {/* Configuración */}
            <button
              type="button"
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Notificaciones"
            >
              <Settings size={24} />
            </button>

            {/* Usuario */}
            <div className="flex items-center bg-white/10 px-3 py-2 rounded-full cursor-pointer hover:bg-white/20 transition-colors">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-primary-DEFAULT font-bold mr-2 shadow-sm">
                <User size={18} />
              </div>
              <span className="hidden md:inline font-medium">UserName</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
