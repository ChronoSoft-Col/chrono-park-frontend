'use client'

import "reflect-metadata";

import { IPrintPaymentTicketContentEntity } from "@/server/domain";
import { PaymentTicketPrinterRepository } from "@/client/domain/repositories/printer/payment-ticket-printer.repository";
import { inject, injectable } from "tsyringe";
import { CLIENT_TOKENS } from "@/client/di/client-tokens";

@injectable()
export class PaymentTicketPrintUsecase {
  constructor(
    @inject(CLIENT_TOKENS.PaymentTicketPrinterRepository)
    private paymentTicketPrinterRepository: PaymentTicketPrinterRepository,
  ) {}

  async printPaymentTicket(ticket: IPrintPaymentTicketContentEntity): Promise<boolean> {
    return this.paymentTicketPrinterRepository.printPaymentTicket(ticket);
  }
}
