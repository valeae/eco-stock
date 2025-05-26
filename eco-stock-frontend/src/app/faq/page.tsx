"use client";

import React, { useState, useEffect } from "react";
import "./page.css";
import Image from "next/image";

// ✅ Nuevos componentes recomendados por Headless UI
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";

import {
  BookOpenCheck,
  LogIn,
  UserPlus,
  PackagePlus,
  Table,
  FileText,
  Bell,
  Truck,
  Layers3,
  ShieldCheck,
  Server,
  Code,
  Database,
  Settings2,
  FolderKanban,
  ListChecks,
} from "lucide-react";

// ✅ Datos del selector
const manuals = [
  { id: "user", name: "Manual de Usuario" },
  { id: "tech", name: "Manual Técnico" },
];

// Secciones del Manual de Usuario
const userSections = [
  { id: "ingreso", label: "1. Ingreso al Sistema", icon: LogIn },
  { id: "usuarios", label: "2. Agregar Usuario", icon: UserPlus },
  { id: "insumos", label: "3. Registrar Insumo", icon: PackagePlus },
  { id: "inventario", label: "4. Movimientos de Inventario", icon: Table },
  { id: "reportes", label: "5. Generar Reporte", icon: FileText },
  { id: "alertas", label: "6. Alertas de Stock", icon: Bell },
  { id: "proveedores", label: "7. Registrar Proveedor", icon: Truck },
  { id: "recepciones", label: "8. Registrar Recepción", icon: Layers3 },
  {
    id: "seguridad",
    label: "9. Seguridad y Buenas Prácticas",
    icon: ShieldCheck,
  },
];

// Secciones del Manual Técnico
const techSections = [
  { id: "desc", label: "1. Descripción del sistema", icon: Code },
  { id: "arquitectura", label: "2. Arquitectura del sistema", icon: Settings2 },
  { id: "instalacion", label: "3. Instalación del sistema", icon: Settings2 },
  { id: "estructura", label: "4. Estructura del proyecto", icon: FolderKanban },
  { id: "modelo", label: "5. Modelo de Base de Datos", icon: Database },
  { id: "pruebas", label: "6. Pruebas y Validaciones", icon: ListChecks },
  { id: "seg-tec", label: "7. Seguridad (Técnico)", icon: ShieldCheck },
];

export default function ManualPage() {
  const [manual, setManual] = useState<"user" | "tech">("user");
  const [active, setActive] = useState(userSections[0].id);

  useEffect(() => {
    const newSections = manual === "user" ? userSections : techSections;
    setActive(newSections[0].id);
  }, [manual]);

  const sections = manual === "user" ? userSections : techSections;

  return (
    <>
      {/* ENCABEZADO */}
      <header className="header-manual">
        <Image
          src="/images/logo.png"
          width={100}
          height={100}
          alt="EcoStock Logo"
          className="logo-manual"
        />

        <h1 className="bienvenida">
          {manual === "user"
            ? "¡Bienvenidos al Manual de Usuario de EcoStock!"
            : "¡Bienvenidos al Manual Técnico de EcoStock!"}
        </h1>

        {/* SELECTOR MANUAL */}
        <Listbox value={manual} onChange={(m) => setManual(m)}>
          <div className="relative">
            <ListboxButton className="manual-selector-custom">
              {manual === "user" ? "Manual de Usuario" : "Manual Técnico"}
            </ListboxButton>
            <ListboxOptions className="manual-options">
              {manuals.map(({ id, name }) => (
                <ListboxOption
                  key={id}
                  value={id}
                  className={({ active }) =>
                    `option-item ${active ? "bg-option-hover" : ""}`
                  }
                >
                  {name}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="layout">
        {/* BARRA LATERAL */}
        <aside className="sidebar">
          <h2 className="sidebar-title">
            {manual === "user" ? (
              <>
                <BookOpenCheck className="icon" /> Manual de Usuario
              </>
            ) : (
              <>
                <Server className="icon" /> Manual Técnico
              </>
            )}
          </h2>
          <nav>
            <ul>
              {sections.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                    className={`nav-btn ${id === active ? "active" : ""}`}
                    onClick={() => setActive(id)}
                  >
                    <Icon className="icon" /> {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* SECCIONES DEL MANUAL */}
        <main className="content">
          {sections.map(({ id, label, icon: Icon }) =>
            active === id ? (
              <section key={id}>
                <h1>
                  <Icon className="icon" /> {label}
                </h1>

                {/* Contenidos del manual de usuario */}
                {manual === "user" && id === "ingreso" && (
                  <p>
                    Ingresa a la URL asignada (e.g.{" "}
                    <code>http://localhost:3000</code>), escribe tu usuario y
                    contraseña y presiona <em>“Iniciar sesión”</em>.
                  </p>
                )}

                {manual === "user" && id === "usuarios" && (
                  <ul>
                    <li>
                      Haz clic en <em>“Agregar usuario”</em>.
                    </li>
                    <li>Rellena los datos y selecciona el rol.</li>
                    <li>
                      Presiona <strong>Guardar</strong>.
                    </li>
                  </ul>
                )}

                {manual === "user" && id === "insumos" && (
                  <p>
                    En <strong>“Insumos”</strong>, haz clic en{" "}
                    <em>“Registrar insumo”</em>, completa los campos y guarda.
                  </p>
                )}

                {manual === "user" && id === "inventario" && (
                  <p>
                    Consulta entradas y salidas de productos, incluyendo fechas,
                    cantidades y responsables.
                  </p>
                )}

                {manual === "user" && id === "reportes" && (
                  <p>
                    Aplica filtros por fecha, producto o proveedor y exporta en
                    PDF o Excel.
                  </p>
                )}

                {manual === "user" && id === "alertas" && (
                  <p>
                    EcoStock alerta cuando el stock baja del mínimo configurado.
                  </p>
                )}

                {manual === "user" && id === "proveedores" && (
                  <p>
                    Registra proveedores seleccionando tipo, NIT/RUT, nombre,
                    correo y dirección.
                  </p>
                )}

                {manual === "user" && id === "recepciones" && (
                  <p>
                    Selecciona proveedor y productos recibidos, luego haz clic
                    en guardar.
                  </p>
                )}

                {manual === "user" && id === "seguridad" && (
                  <ul>
                    <li>No compartas tu contraseña.</li>
                    <li>Cierra sesión al terminar.</li>
                    <li>Verifica la información antes de guardar.</li>
                  </ul>
                )}

                {/* Contenidos del manual técnico */}
                {manual === "tech" && id === "desc" && (
                  <p>
                    EcoStock es una app web para gestionar insumos agrícolas.
                    Usa Next.js, Node.js y MySQL.
                  </p>
                )}

                {manual === "tech" && id === "arquitectura" && (
                  <ul>
                    <li>Frontend: Next.js, TailwindCSS</li>
                    <li>Backend: Node.js + Express</li>
                    <li>Base de datos: MySQL</li>
                  </ul>
                )}

                {manual === "tech" && id === "instalacion" && (
                  <ol>
                    <li>Clona el repo</li>
                    <li>Instala dependencias</li>
                    <li>
                      Configura archivo <code>.env</code>
                    </li>
                    <li>Corre el frontend y backend</li>
                  </ol>
                )}

                {manual === "tech" && id === "estructura" && (
                  <pre>
                    {`src/
├── app/
├── components/
├── public/
│   └── Manual_EcoStock.pdf
tailwind.config.js
tsconfig.json`}
                  </pre>
                )}

                {manual === "tech" && id === "modelo" && (
                  <ul>
                    <li>
                      <code>usuarios</code>: credenciales y roles
                    </li>
                    <li>
                      <code>insumos</code>: productos agrícolas
                    </li>
                    <li>
                      <code>movimientos</code>: entradas y salidas
                    </li>
                    <li>
                      <code>proveedores</code>: datos de contacto
                    </li>
                    <li>
                      <code>recepciones</code>: insumos recibidos
                    </li>
                  </ul>
                )}

                {manual === "tech" && id === "pruebas" && (
                  <p>
                    Validaciones, pruebas unitarias y lógicas implementadas por
                    cada módulo.
                  </p>
                )}

                {manual === "tech" && id === "seg-tec" && (
                  <ul>
                    <li>Contraseñas encriptadas</li>
                    <li>Protección SQL</li>
                    <li>Tokens JWT</li>
                  </ul>
                )}
              </section>
            ) : null
          )}
        </main>
      </div>
    </>
  );
}
