'use client'

import { injectable, inject } from "tsyringe";
import { PrintRepository } from "@/server/domain/repositories/parking/print.repository";
import { IPrintPostPaymentInvoiceParamsEntity } from "@/server/domain/index";
import { ENVIRONMENT } from "@/src/shared/constants/environment";
import { IPrinterOperationEntity, IPrintRequestEntity } from "@/src/client/domain";
import { printerOps } from "@/src/client/domain/usecases/printer/printer-operations";

@injectable()
export class PrintUsecase {
  constructor(@inject("PrintRepository") private printRepository: PrintRepository) {}

  async printPostPaymentInvoice(
    params: IPrintPostPaymentInvoiceParamsEntity
  ): Promise<boolean> {
    
    const operations: IPrinterOperationEntity[] = [];

    operations.push(printerOps.feed(1));
    operations.push(printerOps.align("center"));
    operations.push(printerOps.fontSize(2));
    operations.push(printerOps.text("TICKET DE PAGO"));
    operations.push(printerOps.fontSize(1));
    operations.push(printerOps.separator());
    operations.push(printerOps.align("left"));

    operations.push(printerOps.text(`Placa: ${params.session.vehicle.licensePlate}`));
    operations.push(printerOps.text(`Tipo: ${params.session.vehicle.vehicleType.name}`));
    operations.push(printerOps.text(`Ingreso: ${new Date(params.session.entryTime).toLocaleString()}`));
    operations.push(printerOps.text(`Salida: ${new Date(params.session.exitTime).toLocaleString()}`));
    operations.push(printerOps.separator());

    operations.push(printerOps.text(`Monto calculado: $${params.session.calculatedAmount.toLocaleString()}`));
    if (params.session.discount > 0) {
      operations.push(printerOps.text(`Descuento: $${params.session.discount.toLocaleString()}`));
    }

    operations.push(printerOps.fontSize(2));
    operations.push(printerOps.text(`Total: $${params.totalAmount.toLocaleString()}`));
    operations.push(printerOps.fontSize(1));
    operations.push(printerOps.text(`Recibido: $${params.amountReceived.toLocaleString()}`));
    operations.push(printerOps.text(`Cambio: $${params.change.toLocaleString()}`));
    operations.push(printerOps.separator());
    operations.push(printerOps.feed(2));

    const printerName = ENVIRONMENT.PRINTER_NAME;
    
    const printRequest: IPrintRequestEntity = {
      nombre_impresora: printerName,
      operaciones: operations
    };

    return this.printRepository.sendToPrinter(printRequest);
  }
}
