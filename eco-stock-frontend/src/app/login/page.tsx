'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

//components
import Header from '@/components/logo-header';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('/images/login-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >     
      <Head>
        <title>Iniciar Sesión | EcoStock</title>
        <meta name="description" content="Iniciar sesión en la plataforma EcoStock" />
      </Head>

      <Header />
      
      {/* Overlay semitransparente para mejorar la legibilidad */}
      <div className="absolute inset-0 bg-black/30 z-0"/>
      
      {/* Contenedor principal */}
      <div className="z-10 max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">
            Bienvenido EcoStock
          </h2>
        </div>
        
        {/* Tarjeta de login */}
        <div 
          className="bg-heading/70 backdrop-blur-md rounded-lg shadow-xl overflow-hidden"
        >
          <div className="px-8 py-8">
            <form className="space-y-6">
              {/* Campo de correo electrónico */}
              <div>
                <label htmlFor="email" className="sr-only">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 
                            border border-transparent bg-muted text-heading placeholder-gray-500
                            focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  placeholder="Correo electrónico"
                />
              </div>
              
              {/* Campo de contraseña */}
              <div>
                <label htmlFor="password" className="sr-only">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 
                            border border-transparent bg-muted text-heading placeholder-gray-500
                            focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  placeholder="Contraseña"
                />
              </div>
              
              {/* Recordarme y olvidé contraseña */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded bg-muted border-transparent focus:ring-accent"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                    Recordarme
                  </label>
                </div>
                
                <div className="text-sm">
                  <Link 
                    href="/forgot-password" 
                    className="font-medium text-white hover:text-primary transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>
              
              {/* Botón de iniciar sesión */}
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 
                            border border-transparent text-sm font-medium rounded-md text-white
                            bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2
                            focus:ring-offset-2 focus:ring-accent transition-colors"
                >
                  Iniciar sesión
                </button>
              </div>
            </form>
            
            {/* Enlace para registro */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white">
                ¿No tienes una cuenta?{' '}
                <Link 
                  href="/register" 
                  className="font-medium text-white hover:text-primary transition-colors"
                >
                  Registrarse
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}