export type MenuKey =
| "inicio"
| "catalogos"
| "productos"
| "inventario"
| "reportes"
| "proveedores"
| "configuracion"

export type ExpandedMenus = Record<MenuKey, boolean>;