//La idea es crear la página de perfil de usuario, agregar configuraciones de usuarios, roles, notificaciones, backups
//los enlaces de esta ruta iran en el archivo modal-contact.tsx
import Link from 'next/link';

export default function PerfilUsuario() {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Mi cuenta</h1>
  
        <section>
          <h2 className="text-xl font-medium">Información personal</h2>
          <form className="mt-4 space-y-4">
            <input type="text" placeholder="Nombre" className="input" />
            <input type="email" placeholder="Correo electrónico" className="input" />
            <button type="submit" className="btn-primary">Guardar cambios</button>
          </form>
        </section>
  
        <section>
          <h2 className="text-xl font-medium">Configuraciones rápidas</h2>
          <ul className="list-disc ml-6 mt-2 text-sm">
            <li><Link href="/dashboard/configuracion">Configuración general</Link></li>
            <li><Link href="/dashboard/configuracion/usuarios">Usuarios</Link></li>
            <li><Link href="/dashboard/configuracion/roles">Roles</Link></li>
            <li><Link href="/dashboard/configuracion/notificaciones">Notificaciones</Link></li>
            <li><Link href="/dashboard/configuracion/backup">Copias de seguridad</Link></li>
          </ul>
        </section>
      </div>
    );
  }
  