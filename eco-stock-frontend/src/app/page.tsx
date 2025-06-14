import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import ContactoModal from "@/components/shared/ModalContact";

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="flex flex-col min-h-screen bg-primary">
      {/* NavBar */}
      <nav className="bg-white shadow-md w-full z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="#">
            <Image
              src="/favicon.ico"
              alt="EcoStock Logo"
              width={60}
              height={60}
              className="mr-2 scale-[2] object-contain"
            />
          </Link>
          <ul className="flex space-x-4">
            <li className="text-heading hover:text-accent font-medium cursor-pointer text-lg">
              <a href="#sobre-nosotros">Sobre Nosotros</a>
            </li>
            <li className="text-heading hover:text-accent font-medium cursor-pointer text-lg">
              <a href="#productos">Productos</a>
            </li>
            <li className="text-heading hover:text-accent font-medium cursor-pointer text-lg">
              <a href="/faq">Documentación</a>
            </li>
            <li className="text-heading hover:text-accent font-medium cursor-pointer text-lg">
              <ContactoModal />
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        className="pt-24 pb-16 px-6 bg-cover bg-center h-screen flex items-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('/images/campo-agricola.jpg')",
        }}
      >
        <div className="container mx-auto text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Gestión de Inventario Agrícola
          </h1>
          <p className="text-xl mb-8 max-w-2xl">
            Digitaliza, optimiza y controla tus insumos agrícolas con nuestra
            plataforma especializada para el campo colombiano.
          </p>
          <div className="flex space-x-4 mt-10">
            <Link href="/login">
              <button
                type="button"
                className="bg-accent hover:bg-accent-dark text-white font-medium py-3 px-8 rounded transition duration-300"
              >
                Iniciar Sesión
              </button>
            </Link>
            <Link href="/register">
              <button
                type="button"
                className="bg-transparent hover:bg-white hover:text-accent text-white font-medium py-3 px-8 border border-white rounded transition duration-300"
              >
                Registrar
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Sobre Nosotros */}
      <section
        id="sobre-nosotros"
        className="bg-white py-20 px-6 text-[#2E3D30]"
      >
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Nuestra Solución
          </h2>

          <p className="mb-10 text-lg leading-relaxed">
            EcoStock es un sistema integral para la gestión de inventarios
            agrícolas, diseñado específicamente para optimizar el control de
            productos, proveedores y stock en tiendas del sector. Nuestra
            plataforma combina facilidad de uso con potentes herramientas de
            seguimiento y reportes.
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-muted p-8 rounded-lg hover:shadow-md transition duration-300">
              <h3 className="text-2xl font-semibold mb-6">🎯 Objetivos</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="mr-2 text-accent">•</span> Eficiencia en
                  gestión de inventario
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-accent">•</span> Seguimiento
                  preciso de productos
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-accent">•</span> Automatización de
                  reportes
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-accent">•</span> Control óptimo de
                  stock
                </li>
              </ul>
            </div>

            <div className="bg-muted p-8 rounded-lg hover:shadow-md transition duration-300">
              <h3 className="text-2xl font-semibold mb-6">
                📌 Características
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="mr-2 text-accent">•</span> Interfaz intuitiva
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-accent">•</span> Registro y
                  seguimiento de productos
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-accent">•</span> Administración de
                  proveedores
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-accent">•</span> Reportes
                  personalizados
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Productos */}
      <section id="productos" className="py-20 px-6 bg-muted">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-heading text-center">
            Categorías de Productos
          </h2>
          <p className="text-lg mb-12 text-center text-heading max-w-3xl mx-auto">
            Nuestro sistema permite el registro y control detallado de todos los
            insumos esenciales para el campo
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 h-full flex flex-col">
              <div className="w-full aspect-[4/3] mb-4 overflow-hidden rounded-md relative">
                <Image
                  src="/images/fertilizantes-organicos.png"
                  alt="Fertilizantes Orgánicos"
                  fill
                  className="object-cover rounded-md hover:scale-105 transition duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-accent">
                Fertilizantes
              </h3>
              <p className="text-heading mt-auto">
                Control completo de fertilizantes orgánicos y químicos para
                optimizar tus cultivos.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 h-full flex flex-col">
              <div className="w-full aspect-[4/3] mb-4 overflow-hidden rounded-md relative">
                <Image
                  src="/images/semillas.png"
                  alt="Semillas"
                  fill
                  className="object-cover rounded-md hover:scale-105 transition duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-accent">
                Semillas
              </h3>
              <p className="text-heading mt-auto">
                Registro detallado de semillas con información de variedades y
                rendimientos.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 h-full flex flex-col">
              <div className="w-full aspect-[4/3] mb-4 overflow-hidden rounded-md relative">
                <Image
                  src="/images/herramientas.png"
                  alt="Herramientas"
                  fill
                  className="object-cover rounded-md hover:scale-105 transition duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-accent">
                Herramientas
              </h3>
              <p className="text-heading mt-auto">
                Gestión eficiente de herramientas y equipos para el trabajo
                agrícola.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Características destacadas */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-heading text-center">
            Funcionalidades Destacadas
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <div className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Inventario</h3>
              <p className="text-sm">
                Control detallado de entradas, salidas y existencias
              </p>
            </div>

            <div className="p-6 bg-muted rounded-lg text-center">
              <div className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Reportes</h3>
              <p className="text-sm">
                Generación automática de informes personalizados
              </p>
            </div>

            <div className="p-6 bg-muted rounded-lg text-center">
              <div className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Proveedores</h3>
              <p className="text-sm">
                Administración completa de proveedores y contactos
              </p>
            </div>

            <div className="p-6 bg-muted rounded-lg text-center">
              <div className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Alertas</h3>
              <p className="text-sm">
                Notificaciones de stock mínimo y próximos vencimientos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent text-white py-12 px-6">
        <div className="container mx-auto grid md:grid-cols-3 gap-10">
          {/* Columna 1: Información de contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-5 border-b border-white pb-2">
              Contáctanos
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3 text-white" />
                <span>Vereda El Progreso, Zona Rural, Colombia</span>
              </li>
              <li className="flex items-start">
                <Phone className="mt-1 mr-3 text-white" />
                <a href="tel:+573001112233" className="hover:underline">
                  +57 300 111 2233
                </a>
              </li>
              <li className="flex items-start">
                <Mail className="mt-1 mr-3 text-white" />
                <a
                  href="mailto:contacto@ecostock.com"
                  className="hover:underline break-all"
                >
                  contacto@ecostock.com
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 2: Formulario de contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-5 border-b border-white pb-2">
              Mantente Informado
            </h4>
            <form className="mt-4">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Tu correo electrónico"
                  className="px-4 py-2 rounded-md bg-white text-accent-dark focus:outline-none focus:ring-2 focus:ring-[accent] border border-accent"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-accent hover:bg-opacity-90 font-medium py-2 px-6 rounded-md transition duration-300"
                >
                  Suscribir
                </button>
              </div>
            </form>
            <p className="mt-4 text-sm">
              Recibe actualizaciones sobre nuevas funciones y mejoras del
              sistema.
            </p>
          </div>

          {/* Columna 3: Derechos reservados */}
          <div className="flex flex-col items-start md:items-end text-sm">
            <div className="mb-4">
              <span className="text-2xl font-bold">EcoStock</span>
              <p className="mt-2">
                Sistema de gestión para el sector agrícola colombiano
              </p>
            </div>
            <p className="mt-auto">
              &copy; {currentYear} <strong>EcoStock</strong>
            </p>
            <p className="text-gray-200 text-xs mt-1">
              Desarrollado con 💻 para el campo colombiano
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
