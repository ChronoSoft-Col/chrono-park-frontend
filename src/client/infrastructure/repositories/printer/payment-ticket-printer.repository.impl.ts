'use client'

import "reflect-metadata";

import { IPrintPaymentTicketContentEntity } from "@/server/domain";
import { PaymentTicketPrinterRepository } from "@/client/domain/repositories/printer/payment-ticket-printer.repository";
import { PaymentTicketPrinterDatasourceService } from "@/client/infrastructure/datasources/printer/payment-ticket-printer.datasource.service";
import { inject, injectable } from "tsyringe";
import { CLIENT_TOKENS } from "@/client/di/client-tokens";

@injectable()
export class PaymentTicketPrinterRepositoryImpl implements PaymentTicketPrinterRepository {
  constructor(
    @inject(CLIENT_TOKENS.PaymentTicketPrinterDatasourceService)
    private datasource: PaymentTicketPrinterDatasourceService,
  ) {}

  async printPaymentTicket(ticket: IPrintPaymentTicketContentEntity): Promise<boolean> {
    return this.datasource.printPaymentTicket(ticket);
  }
}
