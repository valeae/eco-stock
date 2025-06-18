"use client";

import { useState } from "react";
import { Mail, Phone, User } from "lucide-react";

export default function ContactoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    mensaje: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleToggleModal = () => {
    setIsOpen(!isOpen);
    setSuccessMessage("");
    setFormData({
      nombre: "",
      correo: "",
      telefono: "",
      mensaje: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simula el envío del formulario
    setSuccessMessage("¡Gracias! Pronto nos contactaremos contigo.");
    setFormData({
      nombre: "",
      correo: "",
      telefono: "",
      mensaje: "",
    });

    // Cierra el modal después de 3 segundos
    setTimeout(() => {
      setIsOpen(false);
      setSuccessMessage("");
    }, 4000);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleToggleModal}
        className="text-heading hover:text-accent font-medium cursor-pointer text-lg"
      >
        Contacto
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md relative border border-gray-200">
            {/* Botón de cerrar */}
            <button
              type="button"
              className="absolute top-2 right-3 text-2xl font-bold text-accent hover:text-accent-dark"
              onClick={handleToggleModal}
            >
              ×
            </button>

            {/* Título */}
            <h2 className="text-2xl font-bold mb-6 text-center text-accent-dark">
              ¿Tienes dudas? Contáctanos
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Estamos aquí para ayudarte con lo que necesites
            </p>

            {successMessage ? (
              <p className="text-green-600 text-center font-medium">{successMessage}</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded bg-white/90">
                  <User className="text-primary" />
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full bg-transparent text-gray-800 placeholder-gray-500 outline-none focus:outline-none focus:ring-0 font-normal"
                  />
                </div>
                <div className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded bg-white/90 focus:ring-accent">
                  <Mail className="text-primary" />
                  <input
                    type="email"
                    name="correo"
                    placeholder="Correo electrónico"
                    value={formData.correo}
                    onChange={handleChange}
                    className="w-full bg-transparent text-gray-800 placeholder-gray-500 outline-none focus:outline-none focus:ring-0 font-normal"
                  />
                </div>
                <div className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded bg-white/90">
                  <Phone className="text-primary" />
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full bg-transparent text-gray-800 placeholder-gray-500 outline-none focus:outline-none focus:ring-0 font-normal"
                  />
                </div>
                <textarea
                  name="mensaje"
                  placeholder="Mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded h-24 bg-white/90 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-accent"
                />

                <button
                  type="submit"
                  className="w-full bg-accent text-white py-2 rounded hover:bg-accent-dark transition"
                >
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
