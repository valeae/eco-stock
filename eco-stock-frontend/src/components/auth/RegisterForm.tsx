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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Registro EcoStock
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-green-600 hover:underline">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}