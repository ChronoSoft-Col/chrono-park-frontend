import type { IPrintPaymentTicketContentEntity } from "@/src/server/domain/entities/parking/print-payment-ticket-response.entity";

export abstract class PaymentTicketPrinterRepository {
  abstract printPaymentTicket(ticket: IPrintPaymentTicketContentEntity): Promise<boolean>;
}
