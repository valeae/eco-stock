// src/hooks/useProductos.ts
import { useQuery } from '@tanstack/react-query';
import type { Producto } from '@/types/index';

async function fetchProductos(): Promise<Producto[]> {
  const res = await fetch('/api/productos'); // tu endpoint real aquí
  if (!res.ok) throw new Error('Error al obtener productos');
  return res.json();
}

export function useProductos() {
  return useQuery<Producto[], Error>({
    queryKey: ['productos'],
    queryFn: fetchProductos,
  });
}
