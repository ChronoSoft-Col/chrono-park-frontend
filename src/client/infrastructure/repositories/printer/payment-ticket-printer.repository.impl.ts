'use client'

import "reflect-metadata";

import type { IPrintPaymentTicketContentEntity } from "@/src/server/domain/entities/parking/print-payment-ticket-response.entity";
import { PaymentTicketPrinterRepository } from "@/client/domain/repositories/printer/payment-ticket-printer.repository";
import { PaymentTicketPrinterDatasourceService } from "@/client/infrastructure/datasources/printer/payment-ticket-printer.datasource.service";
import { inject, injectable } from "tsyringe";

@injectable()
export class PaymentTicketPrinterRepositoryImpl implements PaymentTicketPrinterRepository {
  constructor(
    @inject("PaymentTicketPrinterDatasourceService")
    private datasource: PaymentTicketPrinterDatasourceService,
  ) {}

  async printPaymentTicket(ticket: IPrintPaymentTicketContentEntity): Promise<boolean> {
    return this.datasource.printPaymentTicket(ticket);
  }
}
