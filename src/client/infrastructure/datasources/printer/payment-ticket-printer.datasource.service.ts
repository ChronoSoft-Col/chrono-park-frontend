'use client'

import "reflect-metadata";

import type { IPrintPaymentTicketContentEntity } from "@/src/server/domain/entities/parking/print-payment-ticket-response.entity";
import { ENVIRONMENT } from "@/src/shared/constants/environment";
import { injectable } from "tsyringe";

@injectable()
export class PaymentTicketPrinterDatasourceService {

  async printPaymentTicket(ticket: IPrintPaymentTicketContentEntity): Promise<boolean> {

    try {
      const response = await fetch(ENVIRONMENT.PRINTER_API_URL + "/imprimir", {
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
