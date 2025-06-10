"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/usuarios/autenticar/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo_electronico: correo,
            contraseña: contrasena,
          }),
        }
      );

      const contentType = response.headers.get("content-type");
      let data;

      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        if (textResponse.includes("Page not found")) {
          throw new Error(
            "Endpoint no encontrado. Verifica que el backend esté configurado correctamente y que la URL sea correcta."
          );
        }
        throw new Error(
          "El servidor no está respondiendo con JSON. Verifica que el backend esté funcionando correctamente."
        );
      } else {
        data = await response.json();
      }

      if (!response.ok) {
        if (response.status === 400 || response.status === 401) {
          throw new Error(
            data?.error ||
              data?.mensaje ||
              "Credenciales inválidas. Verifica tus datos."
          );
        }
        if (response.status === 404) {
          throw new Error("Usuario no encontrado.");
        }
        if (response.status === 500) {
          throw new Error(
            "Error interno del servidor. Revisa los logs del backend."
          );
        }
        throw new Error(
          data?.detail ||
            data?.error ||
            data?.message ||
            `Error ${response.status}: ${response.statusText}`
        );
      }

      if (!data.access || !data.refresh) {
        throw new Error(
          "Respuesta del servidor incompleta: faltan tokens de autenticación"
        );
      }

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      if (data.user) {
        localStorage.setItem("user_data", JSON.stringify(data.user));
      }
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Error desconocido durante el login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Overlay semitransparente */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      <div className="z-10 max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">
            Bienvenido EcoStock
          </h2>
        </div>

        {/* Tarjeta de login */}
        <div className="bg-heading/70 backdrop-blur-md rounded-lg shadow-xl overflow-hidden">
          <div className="px-8 py-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
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
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
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
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-white"
                  >
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
                  {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>
              </div>
            </form>

            {/* Enlace para registro */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white">
                ¿No tienes una cuenta?{" "}
                <Link
                  href="/register"
                  className="font-medium text-white hover:text-primary transition-colors"
                >
                  Registrarse
                </Link>
              </p>
            </div>

            {/* Mostrar error si existe */}
            {error && (
              <div className="mt-4 text-center text-sm text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
