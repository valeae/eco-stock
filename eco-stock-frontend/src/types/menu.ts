export type MenuKey =
  | 'inicio'
  | 'registro'
  | 'inventario'
  | 'reportes'
  | 'proveedores';

export type ExpandedMenus = Record<MenuKey, boolean>;