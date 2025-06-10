"use client";

import { useState } from "react";
import Link from 'next/link';
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Settings, 
  Users, 
  Shield, 
  Bell, 
  Database, 
  Save,
  Edit3,
  Camera,
  Key,
  Globe,
  Calendar,
  Building
} from "lucide-react";

// Components
import PageLayout from "@/components/shared/PageLayout";

interface PerfilData {
  nombre: string;
  email: string;
  telefono: string;
  cargo: string;
  empresa: string;
  ubicacion: string;
  fechaIngreso: string;
  avatar: string;
}

export default function PerfilUsuario() {
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [perfilData, setPerfilData] = useState<PerfilData>({
    nombre: "María González",
    email: "maria.gonzalez@agrotech.com",
    telefono: "+57 300 123 4567",
    cargo: "Administrador de Inventario",
    empresa: "AgroTech Solutions",
    ubicacion: "Bogotá, Colombia",
    fechaIngreso: "2023-01-15",
    avatar: "/api/placeholder/120/120"
  });

  const handleInputChange = (field: keyof PerfilData, value: string) => {
    setPerfilData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGuardar = async () => {
    setGuardando(true);
    
    // Simular llamada a API
    setTimeout(() => {
      toast.success("Perfil actualizado correctamente");
      setEditando(false);
      setGuardando(false);
    }, 1000);
  };

  const handleCancelar = () => {
    setEditando(false);
    // Aquí podrías revertir los cambios si es necesario
  };

  const configLinks = [
    {
      href: "/dashboard/configuracion",
      icon: Settings,
      title: "Configuración General",
      description: "Ajustes básicos del sistema"
    },
    {
      href: "/dashboard/configuracion/usuarios",
      icon: Users,
      title: "Gestión de Usuarios",
      description: "Administrar usuarios del sistema"
    },
    {
      href: "/dashboard/configuracion/roles",
      icon: Shield,
      title: "Roles y Permisos",
      description: "Configurar permisos de acceso"
    },
    {
      href: "/dashboard/configuracion/notificaciones",
      icon: Bell,
      title: "Notificaciones",
      description: "Preferencias de notificaciones"
    },
    {
      href: "/dashboard/configuracion/backup",
      icon: Database,
      title: "Copias de Seguridad",
      description: "Gestionar backups del sistema"
    }
  ];

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <PageLayout title="Mi Cuenta">
      <div className="space-y-8">
        {/* Información del Perfil */}
        <div className="bg-white rounded-xl shadow-sm border border-muted p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-heading">Información Personal</h2>
            <button
              onClick={() => setEditando(!editando)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>{editando ? "Cancelar" : "Editar"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Avatar y Info Básica */}
            <div className="lg:col-span-1">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="h-32 w-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-16 w-16 text-primary" />
                  </div>
                  {editando && (
                    <button className="absolute bottom-4 right-0 h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-heading">{perfilData.nombre}</h3>
                <p className="text-sm text-muted-dark">{perfilData.cargo}</p>
                <p className="text-xs text-muted-dark mt-1">{perfilData.empresa}</p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-dark" />
                  <span className="text-muted-dark">Miembro desde:</span>
                </div>
                <p className="text-sm font-medium text-heading ml-7">
                  {formatearFecha(perfilData.fechaIngreso)}
                </p>
              </div>
            </div>

            {/* Formulario de Datos */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-heading">Nombre completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-dark" />
                    <input
                      type="text"
                      value={perfilData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      disabled={!editando}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                        editando ? 'border-muted bg-white' : 'border-muted-light bg-muted-light text-muted-dark'
                      }`}
                      placeholder="Ingresa tu nombre completo"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-heading">Correo electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-dark" />
                    <input
                      type="email"
                      value={perfilData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!editando}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                        editando ? 'border-muted bg-white' : 'border-muted-light bg-muted-light text-muted-dark'
                      }`}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-heading">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-dark" />
                    <input
                      type="tel"
                      value={perfilData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      disabled={!editando}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                        editando ? 'border-muted bg-white' : 'border-muted-light bg-muted-light text-muted-dark'
                      }`}
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-heading">Cargo</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-dark" />
                    <input
                      type="text"
                      value={perfilData.cargo}
                      onChange={(e) => handleInputChange('cargo', e.target.value)}
                      disabled={!editando}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                        editando ? 'border-muted bg-white' : 'border-muted-light bg-muted-light text-muted-dark'
                      }`}
                      placeholder="Tu cargo en la empresa"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-heading">Empresa</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-dark" />
                    <input
                      type="text"
                      value={perfilData.empresa}
                      onChange={(e) => handleInputChange('empresa', e.target.value)}
                      disabled={!editando}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                        editando ? 'border-muted bg-white' : 'border-muted-light bg-muted-light text-muted-dark'
                      }`}
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-heading">Ubicación</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-dark" />
                    <input
                      type="text"
                      value={perfilData.ubicacion}
                      onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                      disabled={!editando}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                        editando ? 'border-muted bg-white' : 'border-muted-light bg-muted-light text-muted-dark'
                      }`}
                      placeholder="Ciudad, País"
                    />
                  </div>
                </div>
              </div>

              {editando && (
                <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-muted">
                  <button
                    onClick={handleCancelar}
                    className="px-4 py-2 text-sm font-medium text-muted-dark hover:text-heading border border-muted rounded-lg hover:bg-muted-light transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleGuardar}
                    disabled={guardando}
                    className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                    <span>{guardando ? "Guardando..." : "Guardar cambios"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cambiar Contraseña */}
        <div className="bg-white rounded-xl shadow-sm border border-muted p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Key className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-heading">Seguridad</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-heading mb-4">Cambiar Contraseña</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-heading">Contraseña actual</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-muted rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Ingresa tu contraseña actual"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-heading">Nueva contraseña</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-muted rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Ingresa tu nueva contraseña"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-heading">Confirmar contraseña</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-muted rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>
                <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium">
                  Actualizar Contraseña
                </button>
              </div>
            </div>
            
            <div className="bg-muted-light rounded-lg p-6">
              <h4 className="font-medium text-heading mb-3">Recomendaciones de seguridad</h4>
              <ul className="space-y-2 text-sm text-muted-dark">
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Usa al menos 8 caracteres</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Incluye letras mayúsculas y minúsculas</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Agrega números y símbolos</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Evita palabras comunes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Configuraciones Rápidas */}
        <div className="bg-white rounded-xl shadow-sm border border-muted p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-heading">Configuraciones del Sistema</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {configLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={index}
                  href={link.href}
                  className="group p-6 border border-muted rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-heading group-hover:text-primary transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-muted-dark mt-1">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}