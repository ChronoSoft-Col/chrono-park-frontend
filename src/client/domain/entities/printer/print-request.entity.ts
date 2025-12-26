import { IPrinterOperationEntity } from "./printer-operation.entity";

export interface IPrintRequestEntity {
  nombre_impresora: string;
  operaciones: IPrinterOperationEntity[];
}
