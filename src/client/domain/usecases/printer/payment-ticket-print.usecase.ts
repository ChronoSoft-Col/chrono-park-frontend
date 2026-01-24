'use client'

import "reflect-metadata";

import { IPrintPaymentTicketContentEntity } from "@/src/server/domain";
import { PaymentTicketPrinterRepository } from "@/client/domain/repositories/printer/payment-ticket-printer.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class PaymentTicketPrintUsecase {
  constructor(
    @inject("PaymentTicketPrinterRepository")
    private paymentTicketPrinterRepository: PaymentTicketPrinterRepository,
  ) {}

  async printPaymentTicket(ticket: IPrintPaymentTicketContentEntity): Promise<boolean> {
    return this.paymentTicketPrinterRepository.printPaymentTicket(ticket);
  }
}
