'use client'

import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { PrintRepository } from "@/client/domain/repositories/printer/print.repository";
import { IPrintRequestEntity } from "../../entities/printer/print-request.entity";
import { IPrinterOperationEntity } from "../../entities/printer/printer-operation.entity";
import { ENVIRONMENT } from "@/src/shared/constants/environment";
import { IPrintPostPaymentInvoiceParamsEntity } from "@/src/server/domain";
import { IClosureEntity } from "@/src/server/domain/entities/parking/closure.entity";

@injectable()
export class PrintUsecase {
  constructor(@inject("PrintRepository") private printRepository: PrintRepository) {}

  async printPostPaymentInvoice(
    params: IPrintPostPaymentInvoiceParamsEntity
  ): Promise<boolean> {    
    
    // Validar que tenemos los datos necesarios
    if (!params.session) {
      console.error("Error: params.session es undefined. Datos recibidos:", JSON.stringify(params, null, 2));
      throw new Error("No se recibieron los datos de la sesión para imprimir. Verifica la respuesta del backend.");
    }
    
    const operations: IPrinterOperationEntity[] = [];
    
    operations.push({ accion: "text", datos: "\n" });
    operations.push({ accion: "textalign", datos: "center" });
    operations.push({ accion: "bold", datos: "on" });
    operations.push({ accion: "text", datos: "TICKET DE PAGO" });
    operations.push({ accion: "bold", datos: "off" });
    operations.push({ accion: "text", datos: "----------------------------------------" });
    operations.push({ accion: "textalign", datos: "left" });
    
    operations.push({ accion: "text", datos: `Placa: ${params.session.vehicle.licensePlate}` });
    operations.push({ accion: "text", datos: `Tipo: ${params.session.vehicle.vehicleType.name}` });
    operations.push({ accion: "text", datos: `Ingreso: ${new Date(params.session.entryTime).toLocaleString()}` });
    operations.push({ accion: "text", datos: `Salida: ${new Date(params.session.exitTime).toLocaleString()}` });
    operations.push({ accion: "text", datos: "----------------------------------------" });
    
    operations.push({ accion: "text", datos: `Monto calculado: $${params.session.calculatedAmount.toLocaleString()}` });
    if (params.session.discount > 0) {
      operations.push({ accion: "text", datos: `Descuento: $${params.session.discount.toLocaleString()}` });
    }
    operations.push({ accion: "bold", datos: "on" });
    operations.push({ accion: "text", datos: `Total: $${params.totalAmount.toLocaleString()}` });
    operations.push({ accion: "bold", datos: "off" });
    operations.push({ accion: "text", datos: `Recibido: $${params.amountReceived.toLocaleString()}` });
    operations.push({ accion: "text", datos: `Cambio: $${params.change.toLocaleString()}` });
    operations.push({ accion: "text", datos: "----------------------------------------" });
    operations.push({ accion: "text", datos: "\n\n" });

    const printerName = ENVIRONMENT.PRINTER_NAME;
    
    const printRequest: IPrintRequestEntity = {
      nombre_impresora: printerName,
      operaciones: operations
    };

    return this.printRepository.sendToPrinter(printRequest);
  }

  async printClosureReceipt(closure: IClosureEntity): Promise<boolean> {
    const operations: IPrinterOperationEntity[] = [];

    const formatCurrency = (value?: string | null) => {
      if (!value) return "$0.00";
      const parsed = Number(value);
      const safe = Number.isFinite(parsed) ? parsed : 0;
      return `$${safe.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    operations.push({ accion: "text", datos: "\n" });
    operations.push({ accion: "textalign", datos: "center" });
    operations.push({ accion: "bold", datos: "on" });
    operations.push({ accion: "text", datos: "CIERRE DE CAJA" });
    operations.push({ accion: "bold", datos: "off" });
    operations.push({ accion: "text", datos: "========================================" });
    operations.push({ accion: "textalign", datos: "left" });

    operations.push({ accion: "text", datos: `Tipo: ${closure.closureType === "PARCIAL" ? "Parcial" : "Total"}` });
    operations.push({ accion: "text", datos: `Fecha: ${new Date(closure.createdOn).toLocaleString()}` });
    operations.push({ accion: "text", datos: "========================================" });

    operations.push({ accion: "text", datos: `Periodo:` });
    operations.push({ accion: "text", datos: `Desde: ${new Date(closure.startedAt).toLocaleString()}` });
    operations.push({ accion: "text", datos: `Hasta: ${new Date(closure.finishedAt).toLocaleString()}` });
    operations.push({ accion: "text", datos: "----------------------------------------" });

    operations.push({ accion: "bold", datos: "on" });
    operations.push({ accion: "text", datos: `Total Recaudado: ${formatCurrency(closure.totalCollected)}` });
    operations.push({ accion: "bold", datos: "off" });
    operations.push({ accion: "text", datos: "========================================" });

    operations.push({ accion: "text", datos: "\n\n" });

    const printerName = ENVIRONMENT.PRINTER_NAME;

    const printRequest: IPrintRequestEntity = {
      nombre_impresora: printerName,
      operaciones: operations,
    };

    return this.printRepository.sendToPrinter(printRequest);
  }
}

