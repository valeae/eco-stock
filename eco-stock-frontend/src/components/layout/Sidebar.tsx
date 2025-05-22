"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Clipboard,
  Package,
  BarChart2,
  Truck,
  Layers,
  Settings,
  Menu,
  X
} from "lucide-react";

// Types 
import type { MenuKey, ExpandedMenus } from "@/types/menu";

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<ExpandedMenus>({
    inicio: false,
    catalogos: false,
    productos: false,
    inventario: false,
    reportes: false,
    proveedores: false,
    configuracion: false,
  });

  // Manejo seguro de pathname - puede ser null durante la hidratación
  const currentPath = pathname || "";

  // Define path matching patterns
  const isCatalogosSubpath = currentPath.startsWith("/dashboard/catalogos");
  const isProductosSubpath = currentPath.startsWith("/dashboard/productos");
  const isInventarioSubpath = currentPath.startsWith("/dashboard/inventario");
  const isReportesSubpath = currentPath.startsWith("/dashboard/reportes");
  const isProveedoresSubpath = currentPath.startsWith("/dashboard/proveedores");
  const isConfiguracionSubpath = currentPath.startsWith("/dashboard/configuracion");

  // Update expanded menus state when pathname changes
  useEffect(() => {
    // Solo actualizar si pathname no es null
    if (pathname) {
      setExpandedMenus({
        inicio: false, // Inicio no tiene submenús
        catalogos: isCatalogosSubpath,
        productos: isProductosSubpath,
        inventario: isInventarioSubpath,
        reportes: isReportesSubpath,
        proveedores: isProveedoresSubpath,
        configuracion: isConfiguracionSubpath,
      });
    }
  }, [
    pathname,
    isCatalogosSubpath,
    isProductosSubpath,
    isInventarioSubpath,
    isReportesSubpath,
    isProveedoresSubpath,
    isConfiguracionSubpath,
  ]);

  // Toggle menu expansion
  const toggleMenu = (section: MenuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Render submenu items
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
                className={`block py-2 px-3 rounded-md text-sm transition-colors font-medium ${
                  currentPath === href
                    ? "text-white bg-accent-light"
                    : "text-white hover:bg-white/10"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {text}
              </Link>
            </li>
          ))}
        </ul>
      )
    );
  };

  // Navigation content - extracted to be reused in both desktop and mobile views
  const navigationContent = (
    <ul className="space-y-1 px-3">
      {/* Inicio - Simplified without submenus */}
      <li>
        <Link
          href="/dashboard/inicio"
          className={`flex items-center w-full p-3 rounded-md transition-colors font-medium ${
            currentPath === "/dashboard/inicio"
              ? "bg-accent-light text-heading-DEFAULT"
              : "text-white hover:bg-accent-light"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <Home
            size={20}
            className={`flex-shrink-0 ${
              currentPath === "/dashboard/inicio" ? "text-heading-DEFAULT" : "text-white"
            }`}
          />
          <span
            className={`ml-3 flex-1 text-left ${
              currentPath === "/dashboard/inicio" ? "text-heading-DEFAULT" : "text-white"
            }`}
          >
            Inicio
          </span>
        </Link>
      </li>

      {/* Catálogos*/}
      <li>
        <button
          type="button"
          onClick={() => toggleMenu("catalogos")}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleMenu("catalogos");
            }
          }}
          className={`flex items-center w-full p-3 rounded-md transition-colors font-medium ${
            isCatalogosSubpath
              ? "bg-accent-light text-heading-DEFAULT"
              : "text-white hover:bg-accent-light"
          }`}
          aria-expanded={expandedMenus.catalogos ? "true" : "false"}
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
          onClick={() => toggleMenu("productos")}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleMenu("productos");
            }
          }}
          className={`flex items-center w-full p-3 rounded-md transition-colors font-medium ${
            isProductosSubpath
              ? "bg-accent-light text-heading-DEFAULT"
              : "text-white hover:bg-accent-light"
          }`}
          aria-expanded={expandedMenus.productos ? "true" : "false"}
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
          { href: "/dashboard/productos", text: "Detalles de productos" },
          { href: "/dashboard/productos/top-productos", text: "Top de productos" },
          { href: "/dashboard/productos/proximos-vencimientos", text: "Próximos vencimientos" },
        ])}
      </li>

      {/* Inventario */}
      <li>
        <button
          type="button"
          onClick={() => toggleMenu("inventario")}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleMenu("inventario");
            }
          }}
          className={`flex items-center w-full p-3 rounded-md transition-colors font-medium ${
            isInventarioSubpath
              ? "bg-accent-light text-heading-DEFAULT"
              : "text-white hover:bg-accent-light"
          }`}
          aria-expanded={expandedMenus.inventario ? "true" : "false"}
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
          { href: "/dashboard/inventario/estado-inventario", text: "Detalles de inventario" },
          { href: "/dashboard/inventario/historial", text: "Historial" },
        ])}
      </li>

      {/* Reportes */}
      <li>
        <button
          type="button"
          onClick={() => toggleMenu("reportes")}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleMenu("reportes");
            }
          }}
          className={`flex items-center w-full p-3 rounded-md transition-colors font-medium ${
            isReportesSubpath
              ? "bg-accent-light text-heading-DEFAULT"
              : "text-white hover:bg-accent-light"
          }`}
          aria-expanded={expandedMenus.reportes ? "true" : "false"}
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
          { href: "/dashboard/reportes/producto-categoria", text: "Por producto/categoría" },
          { href: "/dashboard/reportes/periodo-tiempo", text: "Por periodo de tiempo" },
        ])}
      </li>

      {/* Proveedores */}
      <li>
        <button
          type="button"
          onClick={() => toggleMenu("proveedores")}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleMenu("proveedores");
            }
          }}
          className={`flex items-center w-full p-3 rounded-md transition-colors font-medium ${
            isProveedoresSubpath
              ? "bg-accent-light text-heading-DEFAULT"
              : "text-white hover:bg-accent-light"
          }`}
          aria-expanded={expandedMenus.proveedores ? "true" : "false"}
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
          onClick={() => toggleMenu("configuracion")}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleMenu("configuracion");
            }
          }}
          className={`flex items-center w-full p-3 rounded-md transition-colors font-medium ${
            isConfiguracionSubpath
              ? "bg-accent-light text-heading-DEFAULT"
              : "text-white hover:bg-accent-light"
          }`}
          aria-expanded={expandedMenus.configuracion ? "true" : "false"}
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
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          onClick={toggleMobileMenu}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleMobileMenu();
            }
          }}
          className="flex items-center justify-center h-10 w-10 rounded-md bg-primary text-white hover:bg-accent-light transition-colors focus:outline-none"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen ? "true" : "false"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMobileMenu}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            toggleMobileMenu();
          }
        }}
        tabIndex={mobileMenuOpen ? 0 : -1}
        role="button"
        aria-label="Close menu"
      />
      
      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-primary border-r border-muted-DEFAULT transition-transform transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden flex flex-col overflow-hidden`}
      >
        <div className="flex items-center justify-center h-16 border-b border-muted-light">
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="inline-block">
            <Image 
              src="/images/logo.png" 
              alt="EcoStock" 
              width={100}
              height={100}
              className="h-auto w-auto drop-shadow-lg hover:scale-105 transition-transform"
              priority
            />
          </Link>
        </div>
        <nav className="flex-1 py-2 overflow-y-auto scrollbar-hide">
          {navigationContent}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex h-full w-[256px] bg-primary border-r border-muted-DEFAULT flex-col overflow-hidden">
        <div className="flex items-center justify-center h-16 border-b border-muted-light">
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
          {navigationContent}
        </nav>
      </div>
    </>
  );
}