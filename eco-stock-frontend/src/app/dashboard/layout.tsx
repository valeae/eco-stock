import Head from "next/head";
import Sidebar from "@/components/layout/Sidebar";

export default function Layout({
  children,
  title = "EcoStock - Gestión de Insumos Agrícolas",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Sistema de gestión de inventario para insumos agrícolas"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen bg-primary-ecoLight">
        {/* Sidebar */}
        <Sidebar />

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Contenido de la página */}
          <main className="flex-1 overflow-auto bg-opacity-95 p-6">{children}</main>
        </div>
      </div>
    </>
  );
}