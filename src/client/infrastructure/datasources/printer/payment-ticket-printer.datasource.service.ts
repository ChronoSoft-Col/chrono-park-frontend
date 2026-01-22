'use client'

import "reflect-metadata";

import type { IPrintPaymentTicketContentEntity } from "@/src/server/domain/entities/parking/print-payment-ticket-response.entity";
import { ENVIRONMENT } from "@/src/shared/constants/environment";
import { injectable } from "tsyringe";

@injectable()
export class PaymentTicketPrinterDatasourceService {
  private buildPrinterUrl(): string {
    try {
      return new URL(
        ENVIRONMENT.PAYMENT_TICKET_PRINTER_ENDPOINT,
        ENVIRONMENT.PAYMENT_TICKET_PRINTER_API_URL,
      ).toString();
    } catch {
      const base = String(ENVIRONMENT.PAYMENT_TICKET_PRINTER_API_URL || "").replace(/\/$/, "");
      const path = String(ENVIRONMENT.PAYMENT_TICKET_PRINTER_ENDPOINT || "").replace(/^\//, "");
      return `${base}/${path}`;
    }
  }

  async printPaymentTicket(ticket: IPrintPaymentTicketContentEntity): Promise<boolean> {
    const printerUrl = this.buildPrinterUrl();

    try {
      const response = await fetch(printerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket),
      });

      return response.ok;
    } catch (error) {
      console.error("PaymentTicketPrinterDatasourceService error:", error);
      return false;
    }
  }
}
