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
} from "lucide-react";

//Types 
import type { MenuKey, ExpandedMenus } from "@/types/menu";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<ExpandedMenus>({
    inicio: false,
    registro: false,
    inventario: false,
    reportes: false,
    proveedores: false,
  });

  const isInicioSubpath = [
    "/dashboard/inicio",
    "/dashboard/inicio/detalles-productos",
    "/dashboard/inicio/orden-ventas",
    "/dashboard/inicio/top-productos",
  ].some((path) => pathname.startsWith(path));

  const isRegistroSubpath = [
    "/dashboard/registro",
    "/dashboard/registro/registro-producto",
  ].some((path) => pathname.startsWith(path));

  const isInventarioSubpath = [
    "/dashboard/inventario",
    "/dashboard/inventario/entradas",
    "/dashboard/inventario/salidas",
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
    "/dashboard/proveedores/distribuidores",
    "/dashboard/proveedores/historial",
  ].some((path) => pathname.startsWith(path));

  useEffect(() => {
    setExpandedMenus({
      inicio: isInicioSubpath,
      registro: isRegistroSubpath,
      inventario: isInventarioSubpath,
      reportes: isReportesSubpath,
      proveedores: isProveedoresSubpath,
    });
  }, [isInicioSubpath, isRegistroSubpath, isInventarioSubpath, isReportesSubpath, isProveedoresSubpath]);

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
                className={`block py-2 px-3 rounded-md text-sm ${
                  pathname === href
                    ? "text-heading-DEFAULT font-small bg-muted-light"
                    : "text-white hover:bg-muted-light"
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
    <div className="h-full w-64 bg-primary border-r border-muted-DEFAULT flex flex-col">
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


      <nav className="flex-1 py-2 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {/* Inicio */}
          <li>
            <button
              type="button"
              onClick={() => handleSectionClick("inicio", "/dashboard/inicio")}
              className={`flex items-center w-full p-3 rounded-md transition-colors ${
                isInicioSubpath
                  ? "bg-accent-light text-heading-DEFAULT font-small"
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
              { href: "/dashboard/inicio/orden-ventas", text: "Orden de ventas" },
              { href: "/dashboard/inicio/top-productos", text: "Top de productos" },
            ])}
          </li>


          {/* Registro */}
          <li>
            <button
              type="button"
              onClick={() => handleSectionClick("registro", "/registro")}
              className={`flex items-center w-full p-3 rounded-md transition-colors ${
                isRegistroSubpath
                  ? "bg-accent-light text-heading-DEFAULT font-small"
                  : "text-white hover:bg-accent-light"
              }`}
            >
              <Clipboard
                size={20}
                className="flex-shrink-0 text-heading-DEFAULT"
              />
              <span className="ml-3 flex-1 text-left text-white">Registro</span>
              <svg
                className={`w-4 h-4 ml-auto transition-transform ${
                  expandedMenus.registro ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {renderSubmenu("registro", [
              { href: "/registro/registro-producto", text: "Registro de producto" },
            ])}
          </li>


          {/* Inventario */}
          <li>
            <button
              type="button"
              onClick={() => handleSectionClick("inventario", "/inventario")}
              className={`flex items-center w-full p-3 rounded-md transition-colors ${
                isInventarioSubpath
                  ? "bg-accent-light text-heading-DEFAULT font-small"
                  : "text-white hover:bg-accent-light"
              }`}
            >
              <Package size={20} className="flex-shrink-0 text-heading-DEFAULT" />
              <span className="ml-3 flex-1 text-left text-white">Inventario</span>
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
              { href: "/inventario/entradas", text: "Entradas" },
              { href: "/inventario/salidas", text: "Salidas" },
              { href: "/inventario/historial", text: "Historial" },
            ])}
          </li>


          {/* Reportes */}
          <li>
            <button
              type="button"
              onClick={() => handleSectionClick("reportes", "/reportes")}
              className={`flex items-center w-full p-3 rounded-md transition-colors ${
                isReportesSubpath
                  ? "bg-accent-light text-heading-DEFAULT font-small"
                  : "text-white hover:bg-accent-light"
              }`}
            >
              <BarChart2 size={20} className="flex-shrink-0 text-heading-DEFAULT" />
              <span className="ml-3 flex-1 text-left text-white">Reportes</span>
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
              { href: "/reportes/dia", text: "Reporte diario" },
              { href: "/reportes/semana", text: "Reporte semanal" },
              { href: "/reportes/mensual", text: "Reporte mensual" },
              { href: "/reportes/producto-categoria", text: "Por producto/categoría" },
              { href: "/reportes/periodo-tiempo", text: "Por periodo de tiempo" },
            ])}
          </li>

          {/* Proveedores */}
          <li>
            <button
              type="button"
              onClick={() => handleSectionClick("proveedores", "/proveedores")}
              className={`flex items-center w-full p-3 rounded-md transition-colors ${
                isProveedoresSubpath
                  ? "bg-accent-light text-heading-DEFAULT font-small"
                  : "text-white hover:bg-accent-light"
              }`}
            >
              <Truck size={20} className="flex-shrink-0 text-heading-DEFAULT" />
              <span className="ml-3 flex-1 text-left text-white">Proveedores</span>
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
              { href: "/proveedores/distribuidores", text: "Distribuidores" },
              { href: "/proveedores/historial", text: "Historial de compras" },
            ])}
          </li>
        </ul>
      </nav>
    </div>
  );
}
