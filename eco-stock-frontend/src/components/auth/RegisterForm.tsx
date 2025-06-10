"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const [nombre, setNombre] = useState("");
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
        "http://localhost:8000/api/usuarios/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            correo_electronico: correo,
            contraseña: contrasena,
            idrol: 2,
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
        if (response.status === 400) {
          const errorMessages = [];
          for (const [field, messages] of Object.entries(data)) {
            if (Array.isArray(messages)) {
              errorMessages.push(`${field}: ${messages.join(", ")}`);
            } else {
              errorMessages.push(`${field}: ${messages}`);
            }
          }
          throw new Error(errorMessages.join(" | "));
        }
        if (response.status === 404) {
          throw new Error(
            "Endpoint no encontrado. Verifica la configuración del backend."
          );
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
      else setError("Error desconocido durante el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Campo Nombre */}
              <input
                id="nombreCompleto"
                name="nombreCompleto"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
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
                disabled={loading}
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
                disabled={loading}
                className="appearance-none rounded-md w-full px-3 py-3 
                  border border-transparent bg-muted text-heading placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              />

              {/* Botón de registro */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 
                    border border-transparent text-sm font-medium rounded-md text-white
                    bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2
                    focus:ring-offset-2 focus:ring-accent transition-colors"
                >
                  {loading ? "Registrando..." : "Crear cuenta"}
                </button>
              </div>
            </form>

            {/* Enlace para ir al login */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/login"
                  className="font-medium text-white hover:text-primary transition-colors"
                >
                  Iniciar sesión
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
