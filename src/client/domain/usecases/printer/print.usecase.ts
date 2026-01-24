'use client';

import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { PrintRepository } from "@/client/domain/repositories/printer/print.repository";
import { IPrintRequestEntity } from "../../entities/printer/print-request.entity";
import { IPrinterOperationEntity } from "../../entities/printer/printer-operation.entity";
import { ENVIRONMENT } from "@/src/shared/constants/environment";
import { IClosureEntity } from "@/src/server/domain/entities/parking/closure.entity";
import { TPrintIncomeBody } from "@/src/shared/types/parking/print-income-body.type";
import type { IPrintPaymentTicketContentEntity } from "@/src/server/domain/entities/parking/print-payment-ticket-response.entity";
import { printerOps } from "./printer-operations";

@injectable()
export class PrintUsecase {
  constructor(@inject("PrintRepository") private printRepository: PrintRepository) {}

  // -----------------------------
  // Constants
  // -----------------------------
  private readonly LINE_WIDTH = 40;

  // -----------------------------
  // Text helpers
  // -----------------------------
  private sanitizeText(value: string): string {
    // ESC/POS suele fallar con acentos/diacríticos dependiendo de codepage
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  private safe(value?: string | null, fallback = "-"): string {
    const v = value != null ? String(value).trim() : "";
    return v ? v : fallback;
  }

  private wrapText(text: string, maxWidth: number): string[] {
    const raw = String(text ?? "").trim();
    if (!raw) return [""];

    const words = raw.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let current = "";

    const pushChunked = (v: string) => {
      if (v.length <= maxWidth) return lines.push(v);
      for (let i = 0; i < v.length; i += maxWidth) lines.push(v.slice(i, i + maxWidth));
    };

    for (const w of words) {
      const next = current ? `${current} ${w}` : w;
      if (next.length <= maxWidth) {
        current = next;
        continue;
      }
      if (current) lines.push(current);
      current = "";
      if (w.length > maxWidth) pushChunked(w);
      else current = w;
    }
    if (current) lines.push(current);
    return lines;
  }

  private lr(leftText: string, rightText: string, width: number): string {
    const left = String(leftText ?? "");
    const right = String(rightText ?? "");
    const spaces = Math.max(width - left.length - right.length, 1);
    return `${left}${" ".repeat(spaces)}${right}`;
  }

  private formatDateTimeCO(value?: string | null): string {
    if (!value) return "-";
    try {
      return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(value),
      );
    } catch {
      return "-";
    }
  }

  // -----------------------------
  // Money parsing (FIX del bug)
  // -----------------------------
  private parseMoney(raw?: string | number | null): number | null {
    if (raw == null) return null;
    if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;

    // Mantener solo dígitos, coma, punto y signo
    let s = String(raw).trim().replace(/[^\d.,-]/g, "");
    if (!s) return null;

    const hasDot = s.includes(".");
    const hasComma = s.includes(",");

    if (hasDot && hasComma) {
      // El último separador suele ser el decimal
      const lastDot = s.lastIndexOf(".");
      const lastComma = s.lastIndexOf(",");
      if (lastDot > lastComma) {
        // '.' decimal, ',' miles
        s = s.replace(/,/g, "");
      } else {
        // ',' decimal, '.' miles
        s = s.replace(/\./g, "").replace(/,/g, ".");
      }
    } else if (hasComma) {
      // Solo coma: si termina con ,dd => decimal; si no, miles
      const parts = s.split(",");
      const decimals = parts[parts.length - 1] ?? "";
      if (decimals.length === 2) s = s.replace(/,/g, ".");
      else s = s.replace(/,/g, "");
    } else if (hasDot) {
      // Solo punto: si termina con .dd => decimal; si no, miles
      const parts = s.split(".");
      const decimals = parts[parts.length - 1] ?? "";
      if (decimals.length === 2) {
        // decimal, dejarlo
      } else {
        // miles
        s = s.replace(/\./g, "");
      }
    }

    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  private moneyNoCents(raw?: string | number | null): string {
    const n = this.parseMoney(raw);
    const safe = n == null ? 0 : n;
    return `$${safe.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
  }

  // -----------------------------
  // Printer line helpers (menos separadores)
  // -----------------------------
  private pushLine(ops: IPrinterOperationEntity[], value = ""): void {
    ops.push(printerOps.text(this.sanitizeText(value)));
  }

  private blankLine(ops: IPrinterOperationEntity[], count = 1): void {
    for (let i = 0; i < count; i++) this.pushLine(ops, "");
  }

  private separator(ops: IPrinterOperationEntity[]): void {
    // Separador "suave" (uso moderado)
    this.pushLine(ops, "-".repeat(this.LINE_WIDTH));
  }

  private strongSeparator(ops: IPrinterOperationEntity[]): void {
    // Separador "fuerte" en una sola línea “gruesa”
    // fontSize(2) en tu backend hace texto doble tamaño (ancho y alto).
    // Con 40 cols, en doble ancho caben ~20 chars.
    ops.push(printerOps.fontSize(2));
    this.pushLine(ops, "=".repeat(Math.floor(this.LINE_WIDTH / 2)));
    ops.push(printerOps.fontSize(1));
  }

  // -----------------------------
  // PRINT: Cierre de caja (NO ELIMINAR)
  // -----------------------------
  async printClosureReceipt(
    closure: IClosureEntity,
    options?: { operatorName?: string },
  ): Promise<boolean> {
    const operations: IPrinterOperationEntity[] = [];

    type MethodBucket = { total: string; data: Record<string, { total: string; count: number }> };
    type SummaryByMethod = Record<string, MethodBucket>;
    type RateSummary = Record<string, { total: string; count: number }>;

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

    const summaryByMethod = parseJsonMaybe<SummaryByMethod>(closure.detail?.summary);
    const rateSummary = parseJsonMaybe<RateSummary>(closure.detail?.rateSummary);

    // Layout (menos separadores)
    operations.push(printerOps.feed(2));
    operations.push(printerOps.align("center"));
    operations.push(printerOps.fontSize(2));
    this.pushLine(operations, "CIERRE DE CAJA");
    operations.push(printerOps.fontSize(1));
    this.strongSeparator(operations);

    operations.push(printerOps.align("left"));
    this.pushLine(operations, `Tipo: ${closure.closureType === "PARCIAL" ? "Parcial" : "Total"}`);
    this.pushLine(operations, `Creado: ${this.formatDateTimeCO(closure.createdOn)}`);
    if (options?.operatorName) {
      this.wrapText(`Operador: ${options.operatorName}`, this.LINE_WIDTH).forEach((l) =>
        this.pushLine(operations, l),
      );
    }
    if (closure.detail?.recordedAt) {
      this.pushLine(operations, `Registrado: ${this.formatDateTimeCO(closure.detail.recordedAt)}`);
    }

    this.blankLine(operations, 1);
    this.pushLine(operations, `Desde: ${this.formatDateTimeCO(closure.startedAt)}`);
    this.pushLine(operations, `Hasta: ${this.formatDateTimeCO(closure.finishedAt)}`);

    this.strongSeparator(operations);
    this.pushLine(operations, this.lr("TOTAL:", this.moneyNoCents(closure.totalCollected), this.LINE_WIDTH));
    this.strongSeparator(operations);

    // Tablas (un solo separador por bloque)
    const col1 = 22;
    const col2 = 6;
    const col3 = 12;
    const tableHeader = `${"Item".padEnd(col1)}${"Cant".padStart(col2)}${"Total".padStart(col3)}`;

    this.pushLine(operations, "Resumen por metodo de pago");
    if (!summaryByMethod || Object.keys(summaryByMethod).length === 0) {
      this.pushLine(operations, "(Sin resumen disponible)");
    } else {
      for (const [methodName, bucket] of Object.entries(summaryByMethod)) {
        this.blankLine(operations, 1);
        this.pushLine(operations, methodName);
        this.separator(operations);
        this.pushLine(operations, tableHeader);

        const rateEntries = Object.entries(bucket?.data ?? {});
        if (rateEntries.length === 0) {
          this.pushLine(operations, "(Sin detalle)");
        } else {
          for (const [rateName, rateData] of rateEntries) {
            const label = this.sanitizeText(rateName);
            const countText = String(rateData?.count ?? 0);
            const totalText = this.moneyNoCents(rateData?.total ?? "0");
            // fila simple (sin separador por fila)
            const line = `${label.slice(0, col1).padEnd(col1)}${countText.padStart(col2)}${totalText.padStart(col3)}`;
            this.pushLine(operations, line);
          }
        }

        this.pushLine(
          operations,
          this.lr("Total metodo:", this.moneyNoCents(bucket?.total ?? "0"), this.LINE_WIDTH),
        );
      }
    }

    this.strongSeparator(operations);

    this.pushLine(operations, "Resumen por tarifa");
    if (!rateSummary || Object.keys(rateSummary).length === 0) {
      this.pushLine(operations, "(Sin resumen disponible)");
    } else {
      this.separator(operations);
      this.pushLine(operations, tableHeader);
      for (const [rateName, rateData] of Object.entries(rateSummary)) {
        const label = this.sanitizeText(rateName);
        const countText = String(rateData?.count ?? 0);
        const totalText = this.moneyNoCents(rateData?.total ?? "0");
        const line = `${label.slice(0, col1).padEnd(col1)}${countText.padStart(col2)}${totalText.padStart(col3)}`;
        this.pushLine(operations, line);
      }
    }

    operations.push(printerOps.feed(2));

    const printRequest: IPrintRequestEntity = {
      nombre_impresora: ENVIRONMENT.PRINTER_NAME,
      operaciones: operations,
    };

    return this.printRepository.sendToPrinter(printRequest);
  }

  // -----------------------------
  // PRINT: Ticket de ingreso (NO ELIMINAR)
  // -----------------------------
  async printIncomeReceipt(body: TPrintIncomeBody): Promise<boolean> {
    const operations: IPrinterOperationEntity[] = [];

    operations.push(printerOps.feed(2));
    operations.push(printerOps.align("center"));

    // Header
    operations.push(printerOps.fontSize(2));
    this.pushLine(operations, body.informationPrinter?.headerMessage ?? "TICKET DE INGRESO");
    operations.push(printerOps.fontSize(1));

    this.strongSeparator(operations);

    operations.push(printerOps.align("left"));
    this.pushLine(operations, `Fecha ingreso: ${new Date(body.entryTime).toLocaleString("es-CO")}`);
    this.pushLine(operations, `Tipo vehiculo: ${body.vehicleType}`);
    this.pushLine(operations, `Placa: ${body.vehiclePlate}`);

    this.blankLine(operations, 1);
    operations.push(printerOps.align("center"));

    // QR con el parkingSessionId (tu back soporta "<size>|<content>")
    operations.push(printerOps.qrSized(10, this.sanitizeText(body.parkingSessionId)));
    this.pushLine(operations, "Con este QR pagas y sales");

    operations.push(printerOps.align("left"));

    if (body.informationPrinter?.bodyMessage) {
      this.wrapText(body.informationPrinter.bodyMessage, this.LINE_WIDTH).forEach((l) =>
        this.pushLine(operations, l),
      );
    }

    if (body.informationPrinter?.insurancePolicyInfo) {
      this.wrapText(body.informationPrinter.insurancePolicyInfo, this.LINE_WIDTH).forEach((l) =>
        this.pushLine(operations, l),
      );
    }

    if (body.informationPrinter?.footerMessage) {
      this.blankLine(operations, 1);
      this.wrapText(body.informationPrinter.footerMessage, this.LINE_WIDTH).forEach((l) =>
        this.pushLine(operations, l),
      );
    }

    operations.push(printerOps.feed(2));

    const printRequest: IPrintRequestEntity = {
      nombre_impresora: ENVIRONMENT.PRINTER_NAME,
      operaciones: operations,
    };

    return this.printRepository.sendToPrinter(printRequest);
  }

  // -----------------------------
  // PRINT: Comprobante / Ticket de pago (refactor + menos separadores + money FIX)
  // -----------------------------
  async printTransactionReceipt(ticket: IPrintPaymentTicketContentEntity): Promise<boolean> {
    const ops: IPrinterOperationEntity[] = [];

    // Margen superior
    ops.push(printerOps.feed(2));
    ops.push(printerOps.align("center"));

    // Empresa
    ops.push(printerOps.fontSize(2));
    this.pushLine(ops, ticket.company?.name ?? "COMERCIO");
    ops.push(printerOps.fontSize(1));

    if (ticket.company?.taxId) this.pushLine(ops, `NIT: ${this.sanitizeText(ticket.company.taxId)}`);
    if (ticket.company?.address) {
      this.wrapText(`Direccion: ${ticket.company.address}`, this.LINE_WIDTH).forEach((l) =>
        this.pushLine(ops, l),
      );
    }

    // Mensaje corto (sin separador extra)
    if (ticket.headerMessage) {
      this.blankLine(ops, 1);
      this.wrapText(ticket.headerMessage, this.LINE_WIDTH).forEach((l) => this.pushLine(ops, l));
    }

    this.strongSeparator(ops);

    // Título documento
    this.pushLine(ops, "COMPROBANTE DE TRANSACCION");
    ops.push(printerOps.align("left"));
    this.blankLine(ops, 1);

    // Header info (sin líneas entre cada campo)
    this.pushLine(ops, this.lr("Transaccion:", this.safe(ticket.header?.transactionId), this.LINE_WIDTH));
    this.pushLine(ops, this.lr("Fecha:", this.safe(ticket.header?.paymentDate), this.LINE_WIDTH));
    this.pushLine(ops, this.lr("Metodo:", this.safe(ticket.header?.paymentMethod), this.LINE_WIDTH));
    this.pushLine(ops, this.lr("Punto:", this.safe(ticket.header?.paymentPoint), this.LINE_WIDTH));
    // Estado opcional
    if (ticket.header?.status) {
      this.pushLine(ops, this.lr("Estado:", this.safe(ticket.header.status), this.LINE_WIDTH));
    }

    this.blankLine(ops, 1);

    // Tabla (un solo separador antes)
    const colItem = 16;
    const colBase = 7;
    const colIva = 7;
    const colTotal = 7;
    const tableHeader =
      `${"ITEM".padEnd(colItem)} ${"BASE".padStart(colBase)} ${"IVA".padStart(colIva)} ${"TOTAL".padStart(colTotal)}`;

    this.separator(ops);
    this.pushLine(ops, tableHeader);

    if (!ticket.details?.length) {
      this.pushLine(ops, "(Sin detalle)");
    } else {
      for (const d of ticket.details) {
        const subtotalNum = this.parseMoney(d.subtotal);
        const taxNum = this.parseMoney(d.tax);
        const computedTotal = subtotalNum != null && taxNum != null ? subtotalNum + taxNum : null;

        const itemLines = this.wrapText(this.sanitizeText(this.safe(d.type)), colItem);
        const base = this.moneyNoCents(d.subtotal);
        const iva = this.moneyNoCents(d.tax);
        const total = computedTotal != null ? this.moneyNoCents(computedTotal) : this.moneyNoCents(ticket.totals?.total);

        // Primera línea con valores
        this.pushLine(
          ops,
          `${itemLines[0].padEnd(colItem)} ${base.padStart(colBase)} ${iva.padStart(colIva)} ${total.padStart(colTotal)}`
        );
        // Resto de líneas (solo descripción)
        for (let i = 1; i < itemLines.length; i++) {
          this.pushLine(ops, `${itemLines[i].padEnd(colItem)}`);
        }

        // Extras compactos, sin separadores por ítem
        const extras: string[] = [];
        if (d.licensePlate) extras.push(`Placa: ${d.licensePlate}`);
        if (d.entryTime) extras.push(`Entrada: ${d.entryTime}`);
        if (d.exitTime) extras.push(`Salida: ${d.exitTime}`);
        if (d.duration) extras.push(`Duracion: ${d.duration}`);

        for (const extra of extras) {
          this.wrapText(this.sanitizeText(`  ${extra}`), this.LINE_WIDTH).forEach((l) =>
            this.pushLine(ops, l),
          );
        }

        this.blankLine(ops, 1);
      }
    }

    // Totales (solo separador fuerte antes del total final)
    const taxPercent = ticket.totals?.taxPercent ? ` ${ticket.totals.taxPercent}` : "";
    this.pushLine(ops, this.lr("Subtotal:", this.moneyNoCents(ticket.totals?.subtotal), this.LINE_WIDTH));
    this.pushLine(ops, this.lr(`Impuesto${taxPercent}:`, this.moneyNoCents(ticket.totals?.taxAmount), this.LINE_WIDTH));

    this.strongSeparator(ops);

    ops.push(printerOps.fontSize(2));
    this.pushLine(ops, `TOTAL: ${this.moneyNoCents(ticket.totals?.total)}`.padStart(this.LINE_WIDTH));
    ops.push(printerOps.fontSize(1));

    // Mensajes (sin separadores repetidos; solo espacios)
    if (ticket.bodyMessage) {
      this.blankLine(ops, 1);
      this.wrapText(ticket.bodyMessage, this.LINE_WIDTH).forEach((l) => this.pushLine(ops, l));
    }

    if (ticket.insurancePolicyInfo) {
      this.blankLine(ops, 1);
      this.wrapText(ticket.insurancePolicyInfo, this.LINE_WIDTH).forEach((l) => this.pushLine(ops, l));
    }

    if (ticket.notes) {
      const notes = String(ticket.notes ?? "").trim();
      if (notes) {
        this.blankLine(ops, 1);
        this.wrapText(`Notas: ${notes}`, this.LINE_WIDTH).forEach((l) => this.pushLine(ops, l));
      }
    }

    if (ticket.footerMessage) {
      this.blankLine(ops, 1);
      this.wrapText(ticket.footerMessage, this.LINE_WIDTH).forEach((l) => this.pushLine(ops, l));
    }

    ops.push(printerOps.feed(2));

    const printRequest: IPrintRequestEntity = {
      nombre_impresora: ENVIRONMENT.PRINTER_NAME,
      operaciones: ops,
    };

    return this.printRepository.sendToPrinter(printRequest);
  }
}
