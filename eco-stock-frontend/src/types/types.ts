export interface Producto {
  id: number;
  nombre?: string;
  cantidad: string;           
  descripcion?: string;      
  stock?: number;            
  estado?: string;           
}
  
export interface ProductoDetalle {
    id: number;
    nombre: string;
    stock: number;
    proveedor: string;
    descripcion: string;
  }

  export type TopProducts = {
    id: number;
    nombre: string;
    categoria: string;
    rotacion: number;
    tendencia: 'positiva' | 'negativa';
    cambio: number;
    evolucion: { mes: string; rotacion: number }[];
  };

  export interface Categoria {
    nombre: string;            
    descripcion?: string;     
  }


export interface Proveedor {
  tipo?: string;             
  nombre?: string;           
  contacto?: string;
  direccion?: string;        
  estado?: string;           
}

export interface Rol {
  nombre: string;            
}

export interface Usuario {
  nombre?: string;           
  correo_electronico?: string;  
  contraseña: string;        
}

export interface DetalleEntradaSalida {
  fecha?: string;            
  precio_unitario?: number;  
  cantidad?: number;         
}


export interface MovimientoInventario {
  fecha?: string;            
  tipo_movimiento?: string;  
}


export interface ProductosVencimiento {
  fecha_vencimiento: string;
  notificado?: boolean;      
}

// 9) Tabla unidades_medida
export interface UnidadesMedida {
  nombre: string;            
  abreviatura: string;      
}
