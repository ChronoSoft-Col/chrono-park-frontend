/**
 * Enums de permisos/acciones organizados por módulo.
 * Cada valor corresponde exactamente al `name` de la acción en la base de datos.
 */

// ─── Usuarios (Administración) ───────────────────────────────────────────────

export enum UsuariosAction {
  VER_USUARIOS = "VER_USUARIOS",
  CREAR_USUARIOS = "CREAR_USUARIOS",
  EDITAR_USUARIOS = "EDITAR_USUARIOS",
  INACTIVAR_USUARIOS = "INACTIVAR_USUARIOS",
}

// ─── Control Manual ──────────────────────────────────────────────────────────

export enum ControlManualAction {
  VER_INGRESO_MANUAL = "VER_INGRESO_MANUAL",
  CREAR_INGRESO_MANUAL = "CREAR_INGRESO_MANUAL",
  EDITAR_INGRESO_MANUAL = "EDITAR_INGRESO_MANUAL",
  ASIGNAR_FECHA_INGRESO = "ASIGNAR_FECHA_INGRESO",
}

// ─── Cobro de Estacionamiento ────────────────────────────────────────────────

export enum CobroAction {
  COBRAR_ESTACIONAMIENTO = "COBRAR_ESTACIONAMIENTO",
  VER_TARIFAS = "VER_TARIFAS",
  ASIGNAR_TARIFA_PAGO = "ASIGNAR_TARIFA_PAGO",
}

// ─── Ingresos y Salidas ──────────────────────────────────────────────────────

export enum IngresosSalidasAction {
  VER_INGRESOS_SALIDAS = "VER_INGRESOS_SALIDAS",
  EDITAR_INGRESOS_SALIDAS = "EDITAR_INGRESOS_SALIDAS",
}

// ─── Cierres ─────────────────────────────────────────────────────────────────

export enum CierresAction {
  VER_CIERRES = "VER_CIERRES",
  CREAR_CIERRE = "CREAR_CIERRE",
  VER_DETALLE_CIERRE = "VER_DETALLE_CIERRE",
}

// ─── Clientes ────────────────────────────────────────────────────────────────

export enum ClientesAction {
  VER_CLIENTES = "VER_CLIENTES",
  CREAR_CLIENTE = "CREAR_CLIENTE",
  VER_DETALLES_CLIENTE = "VER_DETALLES_CLIENTE",
  EDITAR_CLIENTE = "EDITAR_CLIENTE",
  ELIMINAR_CLIENTE = "ELIMINAR_CLIENTE",
}

// ─── Pagos ───────────────────────────────────────────────────────────────────

export enum PagosAction {
  VER_PAGOS = "VER_PAGOS",
}

// ─── Mensualidades ───────────────────────────────────────────────────────────

export enum MensualidadesAction {
  VER_MENSUALIDADES = "VER_MENSUALIDADES",
  CREAR_MENSUALIDAD = "CREAR_MENSUALIDAD",
  PAGAR_MENSUALIDAD = "PAGAR_MENSUALIDAD",
  APLICAR_DESCUENTO = "APLICAR_DESCUENTO",
  CANCELAR_MENSUALIDAD = "CANCELAR_MENSUALIDAD",
  EDITAR_FECHA_MENSUALIDAD = "EDITAR_FECHA_MENSUALIDAD",
  ACTIVAR_MENSUALIDAD = "ACTIVAR_MENSUALIDAD",
  PERSONALIZAR_FECHA_MENSUALIDAD = "PERSONALIZAR_FECHA_MENSUALIDAD",
}

// ─── Lista Blanca ────────────────────────────────────────────────────────────

export enum ListaBlancaAction {
  VER_LISTA_BLANCA = "VER_LISTA_BLANCA",
  CREAR_LISTA_BLANCA = "CREAR_LISTA_BLANCA",
  EDITAR_LISTA_BLANCA = "EDITAR_LISTA_BLANCA",
  INACTIVAR_LISTA_BLANCA = "INACTIVAR_LISTA_BLANCA",
}

// ─── Lista Negra ─────────────────────────────────────────────────────────────

export enum ListaNegraAction {
  VER_LISTA_NEGRA = "VER_LISTA_NEGRA",
  CREAR_LISTA_NEGRA = "CREAR_LISTA_NEGRA",
  EDITAR_LISTA_NEGRA = "EDITAR_LISTA_NEGRA",
  INACTIVAR_LISTA_NEGRA = "INACTIVAR_LISTA_NEGRA",
}

// ─── Llaves Maestras ─────────────────────────────────────────────────────────

export enum LlavesMaestrasAction {
  VER_LLAVES_MAESTRAS = "VER_LLAVES_MAESTRAS",
  CREAR_LLAVE_MAESTRA = "CREAR_LLAVE_MAESTRA",
  EDITAR_LLAVE_MAESTRA = "EDITAR_LLAVE_MAESTRA",
  INACTIVAR_LLAVE_MAESTRA = "INACTIVAR_LLAVE_MAESTRA",
}

// ─── Tipo unificado de todas las acciones ────────────────────────────────────

export type AppAction =
  | UsuariosAction
  | ControlManualAction
  | CobroAction
  | IngresosSalidasAction
  | CierresAction
  | ClientesAction
  | PagosAction
  | MensualidadesAction
  | ListaBlancaAction
  | ListaNegraAction
  | LlavesMaestrasAction;
