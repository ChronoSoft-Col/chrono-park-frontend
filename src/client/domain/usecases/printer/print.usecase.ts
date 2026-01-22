'use client'

import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { PrintRepository } from "@/client/domain/repositories/printer/print.repository";
import { IPrintRequestEntity } from "../../entities/printer/print-request.entity";
import { IPrinterOperationEntity } from "../../entities/printer/printer-operation.entity";
import { ENVIRONMENT } from "@/src/shared/constants/environment";
import { IPrintPostPaymentInvoiceParamsEntity } from "@/src/server/domain";
import { IClosureEntity } from "@/src/server/domain/entities/parking/closure.entity";
import { TPrintIncomeBody } from "@/src/shared/types/parking/print-income-body.type";
import type { IPrintPaymentTicketContentEntity } from "@/src/server/domain/entities/parking/print-payment-ticket-response.entity";
import { printerOps } from "./printer-operations";

@injectable()
export class PrintUsecase {
  constructor(@inject("PrintRepository") private printRepository: PrintRepository) {}

  private sanitizeText(value: string): string {
    // Algunas impresoras/servicios (ESC/POS) fallan con acentos.
    // Quitamos tildes/diacriticos para evitar caracteres raros.
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

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

    const formatCurrencyNoCents = (value?: string | null) => {
      if (!value) return "$0";
      const parsed = Number(value);
      const safe = Number.isFinite(parsed) ? parsed : 0;
      return `$${safe.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
    };

    const formatLeftRight = (leftText: string, rightText: string, width: number) => {
      const spaceAvailable = width - leftText.length - rightText.length;
      const spaces = " ".repeat(Math.max(spaceAvailable, 1));
      return `${leftText}${spaces}${rightText}`;
    };

    const wrapText = (text: string, maxWidth: number) => {
      const words = String(text ?? "").trim().split(/\s+/).filter(Boolean);
      if (words.length === 0) return [""];

      const lines: string[] = [];
      let currentLine = "";

      for (const word of words) {
        if ((currentLine + (currentLine ? " " : "") + word).length <= maxWidth) {
          currentLine += (currentLine ? " " : "") + word;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }

      if (currentLine) lines.push(currentLine);
      return lines;
    };

    const shortenItemLabel = (value: string) => {
      const words = String(value ?? "").trim().split(/\s+/).filter(Boolean);
      if (words.length >= 3) {
        words[0] = words[0].slice(0, 4);
        words[1] = words[1].slice(0, 4);
        return words.join(" ");
      }
      return String(value ?? "");
    };

    const formatTableRow = (item: string, count: number, total: string | null, col1: number, col2: number, col3: number) => {
      const label = shortenItemLabel(item);
      const itemLines = wrapText(label, col1);
      const countText = String(count ?? 0);
      const totalText = formatCurrencyNoCents(total);

      return itemLines.map((line, index) => {
        if (index === itemLines.length - 1) {
          return `${line.padEnd(col1)}${countText.padStart(col2)}${totalText.padStart(col3)}`;
        }
        return `${line.padEnd(col1)}${"".padStart(col2)}${"".padStart(col3)}`;
      });
    };

    const pushLine = (value = "") => operations.push(printerOps.text(value));
    const separator = () => operations.push(printerOps.separator());
    const strongSeparator = () => operations.push(printerOps.strongSeparator());

    const summaryByMethod = parseJsonMaybe<SummaryByMethod>(closure.detail?.summary);
    const rateSummary = parseJsonMaybe<RateSummary>(closure.detail?.rateSummary);
    
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

    pushLine(`Desde: ${formatDateTime(closure.startedAt)}`);
    pushLine(`Hasta: ${formatDateTime(closure.finishedAt)}`);
    separator();

    // Mantener el total en tamanio normal para evitar salto de linea.
    // (El servicio de impresion actual no soporta bold y el ancho es limitado.)
    operations.push(printerOps.fontSize(1));
    pushLine(`Total: ${formatCurrencyNoCents(closure.totalCollected)}`);

    strongSeparator();

    const lineWidth = 40;
    const col1 = 22; // item
    const col2 = 6; // cantidad
    const col3 = 12; // total
    const tableHeader = `${"Item".padEnd(col1)}${"Cant".padStart(col2)}${"Total".padStart(col3)}`;

    // Resumen por método de pago
    pushLine("Resumen por metodo de pago");

    if (!summaryByMethod || Object.keys(summaryByMethod).length === 0) {
      pushLine("(Sin resumen disponible)");
    } else {
      for (const [methodName, bucket] of Object.entries(summaryByMethod)) {
        strongSeparator();
        pushLine(methodName);
        operations.push(printerOps.fontSize(1));
        separator();
        pushLine(tableHeader);
        separator();

        const rateEntries = Object.entries(bucket?.data ?? {});
        if (rateEntries.length === 0) {
          pushLine("(Sin detalle)");
        } else {
          for (const [rateName, rateData] of rateEntries) {
            const rows = formatTableRow(rateName, Number(rateData?.count ?? 0), String(rateData?.total ?? null), col1, col2, col3);
            rows.forEach((row) => pushLine(row));
          }
        }

        separator();
        pushLine(formatLeftRight("Total metodo:", formatCurrencyNoCents(String(bucket?.total ?? null)), lineWidth));
      }
    }

    strongSeparator();

    strongSeparator();

    // Resumen por tarifa
    pushLine("Resumen por tarifa");
    operations.push(printerOps.fontSize(1));

    if (!rateSummary || Object.keys(rateSummary).length === 0) {
      pushLine("(Sin resumen disponible)");
    } else {
      separator();
      pushLine(tableHeader);
      separator();
      for (const [rateName, rateData] of Object.entries(rateSummary)) {
        const rows = formatTableRow(rateName, Number(rateData?.count ?? 0), String(rateData?.total ?? null), col1, col2, col3);
        rows.forEach((row) => pushLine(row));
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

  async printIncomeReceipt(body: TPrintIncomeBody): Promise<boolean> {
    const operations: IPrinterOperationEntity[] = [];

    const pushLine = (value = "") => operations.push(printerOps.text(this.sanitizeText(value)));

    operations.push(printerOps.feed(1));
    operations.push(printerOps.align("center"));

    // Header
    if (body.informationPrinter?.headerMessage) {
      pushLine(body.informationPrinter.headerMessage);
      operations.push(printerOps.separator());
    } else {
      pushLine("TICKET DE INGRESO");
      operations.push(printerOps.separator());
    }

    operations.push(printerOps.align("left"));
    pushLine(`Fecha ingreso: ${new Date(body.entryTime).toLocaleString("es-CO")}`);
    pushLine(`Tipo vehiculo: ${body.vehicleType}`);
    pushLine(`Placa: ${body.vehiclePlate}`);

    operations.push(printerOps.separator());
    operations.push(printerOps.align("center"));

    // QR con el parkingSessionId
    operations.push(printerOps.qrSized(10, this.sanitizeText(body.parkingSessionId)));

    operations.push(printerOps.text(this.sanitizeText("Con este QR pagas y sales")));

    operations.push(printerOps.align("left"));

    if (body.informationPrinter?.bodyMessage) {
      pushLine(body.informationPrinter.bodyMessage);
    }

    if (body.informationPrinter?.insurancePolicyInfo) {
      pushLine(body.informationPrinter.insurancePolicyInfo);
    }

    if (body.informationPrinter?.footerMessage) {
      pushLine(body.informationPrinter.footerMessage);
    }

    operations.push(printerOps.feed(2));

    const printRequest: IPrintRequestEntity = {
      nombre_impresora: ENVIRONMENT.PRINTER_NAME,
      operaciones: operations,
    };

    return this.printRepository.sendToPrinter(printRequest);
  }

  async printTransactionReceipt(ticket: IPrintPaymentTicketContentEntity): Promise<boolean> {
    const operations: IPrinterOperationEntity[] = [];

    const pushLine = (value = "") => operations.push(printerOps.text(this.sanitizeText(value)));
    const separator = () => operations.push(printerOps.separator());
    const strongSeparator = () => operations.push(printerOps.strongSeparator());

    const wrapText = (text: string, maxWidth: number) => {
      const words = String(text ?? "").trim().split(/\s+/).filter(Boolean);
      if (words.length === 0) return [""];

      const lines: string[] = [];
      let currentLine = "";

      for (const word of words) {
        if ((currentLine + (currentLine ? " " : "") + word).length <= maxWidth) {
          currentLine += (currentLine ? " " : "") + word;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }

      if (currentLine) lines.push(currentLine);
      return lines;
    };

    const safe = (value?: string | null) => (value && String(value).trim() ? String(value) : "-");

    const lineWidth = 40;
    const formatLeftRight = (leftText: string, rightText: string, width: number) => {
      const left = String(leftText ?? "");
      const right = String(rightText ?? "");
      const spaceAvailable = width - left.length - right.length;
      const spaces = " ".repeat(Math.max(spaceAvailable, 1));
      return `${left}${spaces}${right}`;
    };

    const formatMoneyNoCents = (raw?: string | null) => {
      const value = safe(raw);
      const parsed = Number(String(value).replace(/,/g, ""));
      if (!Number.isFinite(parsed)) return value;
      return parsed.toLocaleString("es-CO", { maximumFractionDigits: 0 });
    };

    const parseNumber = (raw?: string | null) => {
      if (!raw) return null;
      const parsed = Number(String(raw).replace(/,/g, ""));
      return Number.isFinite(parsed) ? parsed : null;
    };

    operations.push(printerOps.feed(1));
    operations.push(printerOps.align("center"));

    // Company / header
    if (ticket.company?.name) {
      operations.push(printerOps.fontSize(2));
      pushLine(ticket.company.name);
      operations.push(printerOps.fontSize(1));
    }
    if (ticket.company?.taxId) {
      pushLine(`NIT: ${ticket.company.taxId}`);
    }
    if (ticket.company?.address) {
      wrapText(`Direccion: ${ticket.company.address}`, 40).forEach(pushLine);
    }

    if (ticket.headerMessage) {
      separator();
      wrapText(ticket.headerMessage, 40).forEach(pushLine);
    }

    strongSeparator();

    pushLine("COMPROBANTE DE TRANSACCION");
    operations.push(printerOps.align("left"));
    separator();

    // Header info (invoice style)
    pushLine(formatLeftRight("Transaccion:", safe(ticket.header?.transactionId), lineWidth));
    pushLine(formatLeftRight("Fecha:", safe(ticket.header?.paymentDate), lineWidth));
    pushLine(formatLeftRight("Metodo:", safe(ticket.header?.paymentMethod), lineWidth));
    pushLine(formatLeftRight("Punto:", safe(ticket.header?.paymentPoint), lineWidth));
    pushLine(formatLeftRight("Estado:", safe(ticket.header?.status), lineWidth));
    separator();

    // Details (invoice-like table)
    if (!ticket.details || ticket.details.length === 0) {
      pushLine("(Sin detalle)");
    } else {

      // Text-only invoice table (works with current printer backend)
      const colItem = 16;
      const colBase = 7;
      const colIva = 7;
      const colTotal = 7;
      const tableHeader = `${"ITEM".padEnd(colItem)} ${"BASE".padStart(colBase)} ${"IVA".padStart(colIva)} ${"TOTAL".padStart(colTotal)}`;

      pushLine(tableHeader);

      for (let i = 0; i < ticket.details.length; i++) {
        const d = ticket.details[i];
        const subtotalNum = parseNumber(d.subtotal);
        const taxNum = parseNumber(d.tax);
        const computedTotal = subtotalNum != null && taxNum != null ? subtotalNum + taxNum : null;

        const itemLabel = safe(d.type);
        const itemLines = wrapText(this.sanitizeText(itemLabel), colItem);

        const base = this.sanitizeText(formatMoneyNoCents(d.subtotal));
        const iva = this.sanitizeText(formatMoneyNoCents(d.tax));
        const total = this.sanitizeText(
          computedTotal != null ? computedTotal.toLocaleString("es-CO", { maximumFractionDigits: 0 }) : "-",
        );

        itemLines.forEach((line, index) => {
          if (index === 0) {
            pushLine(
              `${line.padEnd(colItem)} ${base.padStart(colBase)} ${iva.padStart(colIva)} ${total.padStart(colTotal)}`,
            );
          } else {
            pushLine(`${line.padEnd(colItem)} ${"".padStart(colBase)} ${"".padStart(colIva)} ${"".padStart(colTotal)}`);
          }
        });

        const extraLines: string[] = [];
        if (d.licensePlate) extraLines.push(`Placa: ${d.licensePlate}`);
        if (d.entryTime) extraLines.push(`Entrada: ${d.entryTime}`);
        if (d.exitTime) extraLines.push(`Salida: ${d.exitTime}`);
        if (d.duration) extraLines.push(`Duracion: ${d.duration}`);

        for (const extra of extraLines) {
          wrapText(this.sanitizeText(`  ${extra}`), lineWidth).forEach(pushLine);
        }

        if (i < ticket.details.length - 1) {
          separator();
        }
      }
    }

    separator();

    // Totals
    if (ticket.totals) {
      pushLine("TOTALES");
      const taxPercent = ticket.totals.taxPercent ? ` ${ticket.totals.taxPercent}` : "";
      pushLine(formatLeftRight("Subtotal:", formatMoneyNoCents(ticket.totals.subtotal), lineWidth));
      pushLine(formatLeftRight(`Impuesto${taxPercent}:`, formatMoneyNoCents(ticket.totals.taxAmount), lineWidth));
      separator();
      operations.push(printerOps.fontSize(2));
      {
        const totalLine = `TOTAL: ${formatMoneyNoCents(ticket.totals.total)}`;
        pushLine(totalLine.length >= lineWidth ? totalLine : totalLine.padStart(lineWidth));
      }
      operations.push(printerOps.fontSize(1));
    }

    if (ticket.bodyMessage) {
      separator();
      wrapText(ticket.bodyMessage, 40).forEach(pushLine);
    }

    if (ticket.insurancePolicyInfo) {
      separator();
      wrapText(ticket.insurancePolicyInfo, 40).forEach(pushLine);
    }

    if (ticket.notes) {
      separator();
      wrapText(`Notas: ${ticket.notes}`, 40).forEach(pushLine);
    }

    if (ticket.footerMessage) {
      separator();
      wrapText(ticket.footerMessage, 40).forEach(pushLine);
    }

    operations.push(printerOps.feed(2));

    const printRequest: IPrintRequestEntity = {
      nombre_impresora: ENVIRONMENT.PRINTER_NAME,
      operaciones: operations,
    };

    return this.printRepository.sendToPrinter(printRequest);
  }
}

