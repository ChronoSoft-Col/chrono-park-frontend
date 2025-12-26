'use client'

import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { PrintRepository } from "@/client/domain/repositories/printer/print.repository";
import { IPrintRequestEntity } from "../../entities/printer/print-request.entity";
import { IPrinterOperationEntity } from "../../entities/printer/printer-operation.entity";
import { ENVIRONMENT } from "@/src/shared/constants/environment";
import { IPrintPostPaymentInvoiceParamsEntity } from "@/src/server/domain";
import { IClosureEntity } from "@/src/server/domain/entities/parking/closure.entity";
import { printerOps } from "./printer-operations";

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

  async printClosureReceipt(
    closure: IClosureEntity,
    options?: { operatorName?: string }
  ): Promise<boolean> {
    const operations: IPrinterOperationEntity[] = [];

    type MethodBucket = {
      total: string;
      data: Record<string, { total: string; count: number }>;
    };
    type SummaryByMethod = Record<string, MethodBucket>;
    type RateSummary = Record<string, { total: string; count: number }>;

    const formatDateTime = (value?: string | null) => {
      if (!value) return "-";
      try {
        return new Intl.DateTimeFormat("es-CO", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(value));
      } catch {
        return "-";
      }
    };

    const parseJsonMaybe = <T,>(value: unknown): T | null => {
      if (!value) return null;
      if (typeof value === "object") return value as T;
      if (typeof value !== "string") return null;
      try {
        return JSON.parse(value) as T;
      } catch {
        return null;
      }
    };

    const formatCurrency = (value?: string | null) => {
      if (!value) return "$0.00";
      const parsed = Number(value);
      const safe = Number.isFinite(parsed) ? parsed : 0;
      return `$${safe.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const pushLine = (value = "") => operations.push(printerOps.text(value));
    const separator = () => operations.push(printerOps.separator());
    const strongSeparator = () => operations.push(printerOps.strongSeparator());

    const summaryByMethod = parseJsonMaybe<SummaryByMethod>(closure.detail?.summary);
    const rateSummary = parseJsonMaybe<RateSummary>(closure.detail?.rateSummary);

    operations.push(printerOps.feed(1));
    operations.push(printerOps.align("center"));
    operations.push(printerOps.fontSize(2));
    operations.push(printerOps.text("CIERRE DE CAJA"));
    operations.push(printerOps.fontSize(1));
    strongSeparator();
    operations.push(printerOps.align("left"));

    pushLine(`Tipo: ${closure.closureType === "PARCIAL" ? "Parcial" : "Total"}`);
    pushLine(`Creado: ${formatDateTime(closure.createdOn)}`);
    if (options?.operatorName) {
      pushLine(`Operador: ${options.operatorName}`);
    }
    if (closure.detail?.recordedAt) {
      pushLine(`Registrado: ${formatDateTime(closure.detail.recordedAt)}`);
    }
    strongSeparator();

    pushLine("Período:");
    pushLine(`Desde: ${formatDateTime(closure.startedAt)}`);
    pushLine(`Hasta: ${formatDateTime(closure.finishedAt)}`);
    separator();

    operations.push(printerOps.fontSize(2));
    pushLine(`Total Recaudado: ${formatCurrency(closure.totalCollected)}`);
    operations.push(printerOps.fontSize(1));

    strongSeparator();

    // Resumen por método de pago (igual que el detalle)
    pushLine("Resumen por método de pago:");
    if (!summaryByMethod || Object.keys(summaryByMethod).length === 0) {
      pushLine("(Sin resumen disponible)");
    } else {
      for (const [methodName, bucket] of Object.entries(summaryByMethod)) {
        separator();
        operations.push({ accion: "bold", datos: "on" });
        pushLine(methodName);
        operations.push({ accion: "bold", datos: "off" });
        pushLine(`Total del método: ${formatCurrency(bucket?.total ?? null)}`);

        const rateEntries = Object.entries(bucket?.data ?? {});
        if (rateEntries.length > 0) {
          for (const [rateName, rateData] of rateEntries) {
            pushLine(`${rateName}`);
            pushLine(`  Cant: ${String(rateData?.count ?? 0)}  Total: ${formatCurrency(rateData?.total ?? null)}`);
          }
        }
      }
    }

    strongSeparator();

    // Resumen por tarifa (igual que el detalle)
    pushLine("Resumen por tarifa:");
    if (!rateSummary || Object.keys(rateSummary).length === 0) {
      pushLine("(Sin resumen disponible)");
    } else {
      for (const [rateName, rateData] of Object.entries(rateSummary)) {
        pushLine(`${rateName}`);
        pushLine(`  Cant: ${String(rateData?.count ?? 0)}  Total: ${formatCurrency(rateData?.total ?? null)}`);
      }
    }

    strongSeparator();

    operations.push(printerOps.feed(2));

    const printerName = ENVIRONMENT.PRINTER_NAME;

    const printRequest: IPrintRequestEntity = {
      nombre_impresora: printerName,
      operaciones: operations,
    };

    return this.printRepository.sendToPrinter(printRequest);
  }
}

