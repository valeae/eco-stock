'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

//components
import Header from '@/components/header';

export default function Registro() {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: "url('/images/login-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Head>
        <title>Registro | EcoStock</title>
        <meta name="description" content="Registro en la plataforma EcoStock" />
      </Head>

      <Header />

      {/* Overlay semitransparente */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/* Contenedor principal */}
      <div className="z-10 max-w-md w-full">
        {/* Título */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">
            Registro EcoStock
          </h2>
        </div>

        {/* Tarjeta de registro */}
        <div className="bg-heading/70 backdrop-blur-md rounded-lg shadow-xl overflow-hidden">
          <div className="px-8 py-8">
            <form className="space-y-6">
              {/* Campo Nombre */}
              <input
                id="nombreCompleto"
                name="nombreCompleto"
                type="text"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                placeholder="Nombre completo"
                required
                className="appearance-none rounded-md w-full px-3 py-3 
                  border border-transparent bg-muted text-heading placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              />

              {/* Campo Correo */}
              <input
                id="correoElectronico"
                name="correoElectronico"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="Correo electrónico"
                required
                className="appearance-none rounded-md w-full px-3 py-3 
                  border border-transparent bg-muted text-heading placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              />

              {/* Campo Teléfono */}
              <input
                id="telefono"
                name="telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Teléfono"
                required
                className="appearance-none rounded-md w-full px-3 py-3 
                  border border-transparent bg-muted text-heading placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              />

              {/* Campo Contraseña */}
              <input
                id="contrasena"
                name="contrasena"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Contraseña"
                required
                className="appearance-none rounded-md w-full px-3 py-3 
                  border border-transparent bg-muted text-heading placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              />

              {/* Botón de registro */}
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 
                    border border-transparent text-sm font-medium rounded-md text-white
                    bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2
                    focus:ring-offset-2 focus:ring-accent transition-colors"
                >
                  Crear cuenta
                </button>
              </div>
            </form>

            {/* Enlace para ir al login */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:text-white transition-colors"
                >
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
