/**
 * Estado de un servicio adicional asociado a una sesión de parqueo
 */
export enum ServiceStatusEnum {
  /** Servicio pendiente de pago */
  PENDING = "PENDING",
  /** Servicio pagado */
  PAID = "PAID",
  /** Servicio cancelado */
  CANCELLED = "CANCELLED",
}
