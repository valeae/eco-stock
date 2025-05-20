"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Clipboard,
  Package,
  BarChart2,
  Truck,
  Layers,
  Settings,
} from "lucide-react";

// Types 
import type { MenuKey, ExpandedMenus } from "@/types/menu";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<ExpandedMenus>({
    inicio: false,
    catalogos: false,
    productos: false,
    inventario: false,
    reportes: false,
    proveedores: false,
    configuracion: false,
  });

  // Verificación de rutas de acuerdo a la nueva estructura
  const isInicioSubpath = [
    "/dashboard/inicio",
    "/dashboard/inicio/detalles-productos",
    "/dashboard/inicio/top-productos",
    "/dashboard/inicio/proximos-vencimientos",
  ].some((path) => pathname.startsWith(path));

  const isCatalogosSubpath = [
    "/dashboard/catalogos",
    "/dashboard/catalogos/categorias",
    "/dashboard/catalogos/unidades-medida", //Para estandarizar las unidades de los productos
  ].some((path) => pathname.startsWith(path));

  const isProductosSubpath = [
    "/dashboard/productos",
    "/dashboard/productos/registro-producto",
    "/dashboard/productos/edicion",
  ].some((path) => pathname.startsWith(path));

  const isInventarioSubpath = [
    "/dashboard/inventario",
    "/dashboard/inventario/entradas",
    "/dashboard/inventario/salidas",
    "/dashboard/inventario/ajustes",
    "/dashboard/inventario/historial",
  ].some((path) => pathname.startsWith(path));

  const isReportesSubpath = [
    "/dashboard/reportes",
    "/dashboard/reportes/dia",
    "/dashboard/reportes/semana",
    "/dashboard/reportes/mensual",
    "/dashboard/reportes/producto-categoria",
    "/dashboard/reportes/periodo-tiempo",
  ].some((path) => pathname.startsWith(path));

  const isProveedoresSubpath = [
    "/dashboard/proveedores",
    "/dashboard/proveedores/registro",
    "/dashboard/proveedores/edicion",
    "/dashboard/proveedores/distribuidores",
    "/dashboard/proveedores/historial",
  ].some((path) => pathname.startsWith(path));

  const isConfiguracionSubpath = [
    "/dashboard/configuracion",
    "/dashboard/configuracion/usuarios",
    "/dashboard/configuracion/roles",
    "/dashboard/configuracion/notificaciones",
    "/dashboard/configuracion/backup",
  ].some((path) => pathname.startsWith(path));

  useEffect(() => {
    setExpandedMenus({
      inicio: isInicioSubpath,
      catalogos: isCatalogosSubpath,
      productos: isProductosSubpath,
      inventario: isInventarioSubpath,
      reportes: isReportesSubpath,
      proveedores: isProveedoresSubpath,
      configuracion: isConfiguracionSubpath,
    });
  }, [
    isInicioSubpath,
    isCatalogosSubpath,
    isProductosSubpath,
    isInventarioSubpath,
    isReportesSubpath,
    isProveedoresSubpath,
    isConfiguracionSubpath,
  ]);

  const toggleMenu = (section: MenuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSectionClick = (section: MenuKey, mainPath: string) => {
    router.push(mainPath);
    toggleMenu(section);
  };

  const renderSubmenu = (
    section: MenuKey,
    links: { href: string; text: string }[]
  ) => {
    return (
      expandedMenus[section] && (
        <ul className="pl-10 pt-2 pb-1">
          {links.map(({ href, text }) => (
            <li key={href}>
              <Link
                href={href}
                className={`block py-2 px-3 rounded-md text-sm transition-colors ${
                  pathname === href
                    ? "text-white font-medium bg-accent-light"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {text}
              </Link>
            </li>
          ))}
        </ul>
      )
    );
  };

  return (
    <div className="h-full w-[256px] bg-primary border-r border-muted-DEFAULT flex flex-col overflow-hidden">
      <div className="flex items-center justify-center border-b border-muted-light">
        <Link href="/dashboard" className="inline-block">
          <Image 
            src="/images/logo.png" 
            alt="EcoStock" 
            width={120}
            height={120}
            className="h-auto w-auto drop-shadow-lg hover:scale-105 transition-transform"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto pr-2 scrollbar-hide">
        <ul className="space-y-1 px-3">
          {/* Inicio */}
          <li>
            <button
              type="button"
              onClick={() => handleSectionClick("inicio", "/dashboard/inicio")}
              className={`flex items-center w-full p-3 rounded-md transition-colors ${
                isInicioSubpath
                  ? "bg-accent-light text-heading-DEFAULT font-medium"
                  : "text-white hover:bg-accent-light"
              }`}
            >
              <Home
                size={20}
                className={`flex-shrink-0 ${
                  isInicioSubpath ? "text-heading-DEFAULT" : "text-white"
                }`}
              />
              <span
                className={`ml-3 flex-1 text-left ${
                  isInicioSubpath ? "text-heading-DEFAULT" : "text-white"
                }`}
              >
                Inicio
              </span>
              <svg
                className={`w-4 h-4 ml-auto transition-transform ${
                  expandedMenus.inicio ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {renderSubmenu("inicio", [
              { href: "/dashboard/inicio/detalles-productos", text: "Detalles de productos" },
              { href: "/dashboard/inicio/top-productos", text: "Top de productos" },
              { href: "/dashboard/inicio/proximos-vencimientos", text: "Próximos vencimientos" },
            ])}
          </li>

          {/* Catálogos*/}
          <li>
            <button
              type="button"
              onClick={() => setExpandedMenus(prev => ({
                ...prev,
                catalogos: !prev.catalogos
              }))}
              className={`flex items-center w-full p-3 rounded-md transition-colors ${
                isCatalogosSubpath
                  ? "bg-accent-light text-heading-DEFAULT font-small"
                  : "text-white hover:bg-accent-light"
              }`}
            >
              <Layers
                size={20}
                className={`flex-shrink-0 ${
                  isCatalogosSubpath ? "text-heading-DEFAULT" : "text-white"
                }`}
              />
              <span
                className={`ml-3 flex-1 text-left ${
                  isCatalogosSubpath ? "text-heading-DEFAULT" : "text-white"
                }`}
              >
                Catálogos
              </span>
              <svg
                className={`w-4 h-4 ml-auto transition-transform ${
                  expandedMenus.catalogos ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {renderSubmenu("catalogos", [
              { href: "/dashboard/catalogos/categorias", text: "Categorías" },
              { href: "/dashboard/catalogos/unidades-medida", text: "Unidades de medida" },
            ])}
          </li>

          {/* Productos */}
          <li>
            <button
              type="button"
              onClick={() => setExpandedMenus(prev => ({
                ...prev,
                productos: !prev.productos
              }))}
              className={`flex items-center w-full p-3 rounded-md transition-colors ${
                isProductosSubpath
                  ? "bg-accent-light text-heading-DEFAULT font-small"
                  : "text-white hover:bg-accent-light"
              }`}
            >
              <Clipboard
                size={20}
                className={`flex-shrink-0 ${
                  isProductosSubpath ? "text-heading-DEFAULT" : "text-white"
                }`}
              />
              <span
                className={`ml-3 flex-1 text-left ${
                  isProductosSubpath ? "text-heading-DEFAULT" : "text-white"
                }`}
              >
                Productos
              </span>
              <svg
                className={`w-4 h-4 ml-auto transition-transform ${
                  expandedMenus.productos ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {renderSubmenu("productos", [
              { href: "/dashboard/productos/registro", text: "Registro de producto" },
              { href: "/dashboard/productos/edicion", text: "edición de producto" },
            ])}
          </li>

          {/* Inventario */}
          <li>
            <button
              type="button"
              onClick={() => setExpandedMenus(prev => ({
                ...prev,
                inventario: !prev.inventario
              }))}
              className={`flex items-center w-full p-3 rounded-md transition-colors ${
                isInventarioSubpath
                  ? "bg-accent-light text-heading-DEFAULT font-small"
                  : "text-white hover:bg-accent-light"
              }`}
            >
              <Package 
                size={20} 
                className={`flex-shrink-0 ${
                  isInventarioSubpath ? "text-heading-DEFAULT" : "text-white"
                }`} 
              />
              <span
                className={`ml-3 flex-1 text-left ${
                  isInventarioSubpath ? "text-heading-DEFAULT" : "text-white"
                }`}
              >
                Inventario
              </span>
              <svg
                className={`w-4 h-4 ml-auto transition-transform ${
                  expandedMenus.inventario ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {renderSubmenu("inventario", [
              { href: "/dashboard/inventario", text: "Estado de inventario" },
              { href: "/dashboard/inventario/entradas", text: "Entradas" },
              { href: "/dashboard/inventario/salidas", text: "Salidas" },
              { href: "/dashboard/inventario/ajustes", text: "Ajustes" },
              { href: "/dashboard/inventario/historial", text: "Historial" },
            ])}
          </li>

          {/* Reportes */}
          <li>
            <button
              type="button"
              onClick={() => setExpandedMenus(prev => ({
                ...prev,
                reportes: !prev.reportes
              }))}
              className={`flex items-center w-full p-3 rounded-md transition-colors ${
                isReportesSubpath
                  ? "bg-accent-light text-heading-DEFAULT font-small"
                  : "text-white hover:bg-accent-light"
              }`}
            >
              <BarChart2 
                size={20} 
                className={`flex-shrink-0 ${
                  isReportesSubpath ? "text-heading-DEFAULT" : "text-white"
                }`} 
              />
              <span
                className={`ml-3 flex-1 text-left ${
                  isReportesSubpath ? "text-heading-DEFAULT" : "text-white"
                }`}
              >
                Reportes
              </span>
              <svg
                className={`w-4 h-4 ml-auto transition-transform ${
                  expandedMenus.reportes ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {renderSubmenu("reportes", [
              { href: "/dashboard/reportes", text: "Panel de reportes" },
              { href: "/dashboard/reportes/dia", text: "Reporte diario" },
              { href: "/dashboard/reportes/semana", text: "Reporte semanal" },
              { href: "/dashboard/reportes/mensual", text: "Reporte mensual" },
              { href: "/dashboard/reportes/producto-categoria", text: "Por producto/categoría" },
              { href: "/dashboard/reportes/periodo-tiempo", text: "Por periodo de tiempo" },
              { href: "/dashboard/reportes/vencimientos", text: "Vencimientos" },
              { href: "/dashboard/reportes/rotacion-inventario", text: "Rotación de inventario" },
            ])}
          </li>

          {/* Proveedores */}
          <li>
            <button
              type="button"
              onClick={() => setExpandedMenus(prev => ({
                ...prev,
                proveedores: !prev.proveedores
              }))}
              className={`flex items-center w-full p-3 rounded-md transition-colors ${
                isProveedoresSubpath
                  ? "bg-accent-light text-heading-DEFAULT font-small"
                  : "text-white hover:bg-accent-light"
              }`}
            >
              <Truck 
                size={20} 
                className={`flex-shrink-0 ${
                  isProveedoresSubpath ? "text-heading-DEFAULT" : "text-white"
                }`} 
              />
              <span
                className={`ml-3 flex-1 text-left ${
                  isProveedoresSubpath ? "text-heading-DEFAULT" : "text-white"
                }`}
              >
                Proveedores
              </span>
              <svg
                className={`w-4 h-4 ml-auto transition-transform ${
                  expandedMenus.proveedores ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {renderSubmenu("proveedores", [
              { href: "/dashboard/proveedores", text: "Listado de proveedores" },
              { href: "/dashboard/proveedores/registro", text: "Registro de proveedor" },
              { href: "/dashboard/proveedores/distribuidores", text: "Distribuidores" },
              { href: "/dashboard/proveedores/historial", text: "Historial de compras" },
            ])}
          </li>

          {/* Configuración*/}
          <li>
            <button
              type="button"
              onClick={() => setExpandedMenus(prev => ({
                ...prev,
                configuracion: !prev.configuracion
              }))}
              className={`flex items-center w-full p-3 rounded-md transition-colors ${
                isConfiguracionSubpath
                  ? "bg-accent-light text-heading-DEFAULT font-small"
                  : "text-white hover:bg-accent-light"
              }`}
            >
              <Settings
                size={20}
                className={`flex-shrink-0 ${
                  isConfiguracionSubpath ? "text-heading-DEFAULT" : "text-white"
                }`}
              />
              <span
                className={`ml-3 flex-1 text-left ${
                  isConfiguracionSubpath ? "text-heading-DEFAULT" : "text-white"
                }`}
              >
                Configuración
              </span>
              <svg
                className={`w-4 h-4 ml-auto transition-transform ${
                  expandedMenus.configuracion ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {renderSubmenu("configuracion", [
              { href: "/dashboard/configuracion/usuarios", text: "Usuarios" },
              { href: "/dashboard/configuracion/roles", text: "Roles" },
              { href: "/dashboard/configuracion/notificaciones", text: "Notificaciones" },
              { href: "/dashboard/configuracion/backup", text: "Copias de seguridad" },
            ])}
          </li>
        </ul>
      </nav>
    </div>
  );
}