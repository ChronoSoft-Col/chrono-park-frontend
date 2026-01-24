'use client'

import "reflect-metadata";
import { container } from "tsyringe";

import { CLIENT_TOKENS } from "@/client/di/client-tokens";
import { PrintUsecase } from "@/client/domain";
import { PaymentTicketPrintUsecase } from "@/client/domain/usecases/printer/payment-ticket-print.usecase";
import { PrintDatasourceService } from "@/client/infrastructure/datasources/printer/print-datasource.service";
import { PrintRepositoryImpl } from "@/client/infrastructure/repositories/printer/print-repository.impl";
import { PaymentTicketPrinterDatasourceService } from "@/client/infrastructure/datasources/printer/payment-ticket-printer.datasource.service";
import { PaymentTicketPrinterRepositoryImpl } from "@/client/infrastructure/repositories/printer/payment-ticket-printer.repository.impl";

if (!container.isRegistered(CLIENT_TOKENS.PrintRepository)) {
  container.register(CLIENT_TOKENS.PrintRepository, {
    useClass: PrintRepositoryImpl,
  });
}

if (!container.isRegistered(CLIENT_TOKENS.PrintDatasourceService)) {
  container.register(CLIENT_TOKENS.PrintDatasourceService, {
    useClass: PrintDatasourceService,
  });
}

if (!container.isRegistered(CLIENT_TOKENS.PaymentTicketPrinterRepository)) {
  container.register(CLIENT_TOKENS.PaymentTicketPrinterRepository, {
    useClass: PaymentTicketPrinterRepositoryImpl,
  });
}

if (!container.isRegistered(CLIENT_TOKENS.PaymentTicketPrinterDatasourceService)) {
  container.register(CLIENT_TOKENS.PaymentTicketPrinterDatasourceService, {
    useClass: PaymentTicketPrinterDatasourceService,
  });
}

if (!container.isRegistered(CLIENT_TOKENS.PrintUsecase)) {
  container.register(CLIENT_TOKENS.PrintUsecase, { useClass: PrintUsecase });
}

if (!container.isRegistered(CLIENT_TOKENS.PaymentTicketPrintUsecase)) {
  container.register(CLIENT_TOKENS.PaymentTicketPrintUsecase, { useClass: PaymentTicketPrintUsecase });
}

export { container as clientContainer };
