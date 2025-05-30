"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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

const manuals = [
  { id: "user", name: "Manual de Usuario" },
  { id: "tech", name: "Manual Técnico" },
];

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
  const [manual, setManual] = useState("user");
  const [active, setActive] = useState(userSections[0].id);

  useEffect(() => {
    const newSections = manual === "user" ? userSections : techSections;
    setActive(newSections[0].id);
  }, [manual]);

  const sections = manual === "user" ? userSections : techSections;

  return (
    <>
      <header className="flex items-center justify-between px-12 py-4 bg-[#f0f0e8] border-b-2 border-[#6a8275]">
        <Image
          src="/images/logo.png"
          width={100}
          height={100}
          alt="EcoStock Logo"
          className="h-[90px] w-[100px]"
        />
        <h1 className="text-[#6a8275] text-xl font-bold text-center">
          {manual === "user"
            ? "¡Bienvenidos al Manual de Usuario de EcoStock!"
            : "¡Bienvenidos al Manual Técnico de EcoStock!"}
        </h1>
        <Listbox value={manual} onChange={(m) => setManual(m)}>
          <div className="relative">
            <ListboxButton className="px-4 py-2 w-48 border border-[#6a8275] bg-[#f0f0e8] text-[#243029] rounded-md text-left cursor-pointer">
              {manual === "user" ? "Manual de Usuario" : "Manual Técnico"}
            </ListboxButton>
            <ListboxOptions className="absolute z-10 mt-1 max-h-52 overflow-y-auto w-48 bg-white border border-[#6a8275] rounded-md shadow-md">
              {manuals.map(({ id, name }) => (
                <ListboxOption
                  key={id}
                  value={id}
                  className={({ active }) =>
                    `px-4 py-2 cursor-pointer ${
                      active ? "bg-[#708871] text-white" : "text-[#243029]"
                    }`
                  }
                >
                  {name}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </header>

      <div className="flex flex-col md:flex-row min-h-screen">
        <aside className="w-full md:w-72 bg-[#6a8275] text-white p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            {manual === "user" ? (
              <>
                <BookOpenCheck className="stroke-1.5" /> Manual de Usuario
              </>
            ) : (
              <>
                <Server className="stroke-1.5" /> Manual Técnico
              </>
            )}
          </h2>
          <nav>
            <ul className="space-y-1">
              {sections.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                    onClick={() => setActive(id)}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium ${
                      id === active
                        ? "bg-white text-[#4a635a] font-bold"
                        : "hover:bg-[#4a635a] text-white"
                    }`}
                  >
                    <Icon
                      className={`stroke-1.5 ${
                        id === active ? "stroke-[#4a635a]" : "stroke-white"
                      }`}
                    />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-grow p-8 bg-white">
          {sections.map(({ id, label, icon: Icon }) =>
            active === id ? (
              <section key={id} className="max-w-3xl mx-auto">
                <h1 className="flex items-center gap-2 text-xl text-[#334139] mb-4">
                  <Icon className="stroke-1.5" /> {label}
                </h1>
                {manual === "user" && id === "ingreso" && (
                  <p>
                    Ingresa a la URL asignada (e.g.{" "}
                    <code className="bg-[#f0f0e8] px-1 rounded">
                      http://localhost:3000
                    </code>
                    ), escribe tu usuario y contraseña y presiona{" "}
                    <em>“Iniciar sesión”</em>.
                  </p>
                )}
                {manual === "user" && id === "usuarios" && (
                  <ul className="list-disc pl-5">
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
                  <ul className="list-disc pl-5">
                    <li>No compartas tu contraseña.</li>
                    <li>Cierra sesión al terminar.</li>
                    <li>Verifica la información antes de guardar.</li>
                  </ul>
                )}
                {manual === "tech" && id === "desc" && (
                  <p>
                    EcoStock es una app web para gestionar insumos agrícolas.
                    Usa Next.js, Node.js y MySQL.
                  </p>
                )}
                {manual === "tech" && id === "arquitectura" && (
                  <ul className="list-disc pl-5">
                    <li>Frontend: Next.js, TailwindCSS</li>
                    <li>Backend: Node.js + Express</li>
                    <li>Base de datos: MySQL</li>
                  </ul>
                )}
                {manual === "tech" && id === "instalacion" && (
                  <ol className="list-decimal pl-5">
                    <li>Clona el repo</li>
                    <li>Instala dependencias</li>
                    <li>
                      Configura archivo{" "}
                      <code className="bg-[#f0f0e8] px-1 rounded">.env</code>
                    </li>
                    <li>Corre el frontend y backend</li>
                  </ol>
                )}
                {manual === "tech" && id === "estructura" && (
                  <pre className="bg-[#f0f0e8] p-4 rounded">
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
                  <ul className="list-disc pl-5">
                    <li>
                      <code className="bg-[#f0f0e8] px-1 rounded">
                        usuarios
                      </code>
                      : credenciales y roles
                    </li>
                    <li>
                      <code className="bg-[#f0f0e8] px-1 rounded">insumos</code>
                      : productos agrícolas
                    </li>
                    <li>
                      <code className="bg-[#f0f0e8] px-1 rounded">
                        movimientos
                      </code>
                      : entradas y salidas
                    </li>
                    <li>
                      <code className="bg-[#f0f0e8] px-1 rounded">
                        proveedores
                      </code>
                      : datos de contacto
                    </li>
                    <li>
                      <code className="bg-[#f0f0e8] px-1 rounded">
                        recepciones
                      </code>
                      : insumos recibidos
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
                  <ul className="list-disc pl-5">
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
