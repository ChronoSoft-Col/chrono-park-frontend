import { IPrintPaymentTicketContentEntity } from "@/src/server/domain";

export abstract class PaymentTicketPrinterRepository {
  abstract printPaymentTicket(ticket: IPrintPaymentTicketContentEntity): Promise<boolean>;
}
