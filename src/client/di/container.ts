'use client'

import "reflect-metadata";
import { container } from "tsyringe";

import { PrintRepository } from "@/client/domain/repositories/printer/print.repository";
import { PrintDatasourceService } from "@/client/infrastructure/datasources/printer/print-datasource.service";
import { PrintRepositoryImpl } from "@/client/infrastructure/repositories/printer/print-repository.impl";
import { PaymentTicketPrinterRepository } from "@/client/domain/repositories/printer/payment-ticket-printer.repository";
import { PaymentTicketPrinterDatasourceService } from "@/client/infrastructure/datasources/printer/payment-ticket-printer.datasource.service";
import { PaymentTicketPrinterRepositoryImpl } from "@/client/infrastructure/repositories/printer/payment-ticket-printer.repository.impl";

if(!container.isRegistered("PrintRepository")){
  container.register<PrintRepository>("PrintRepository", {
    useClass: PrintRepositoryImpl,
  });
}

if(!container.isRegistered("PrintDatasourceService")){
  container.register<PrintDatasourceService>("PrintDatasourceService", {
    useClass: PrintDatasourceService,
  });
}

if(!container.isRegistered("PaymentTicketPrinterRepository")){
  container.register<PaymentTicketPrinterRepository>("PaymentTicketPrinterRepository", {
    useClass: PaymentTicketPrinterRepositoryImpl,
  });
}

if(!container.isRegistered("PaymentTicketPrinterDatasourceService")){
  container.register<PaymentTicketPrinterDatasourceService>("PaymentTicketPrinterDatasourceService", {
    useClass: PaymentTicketPrinterDatasourceService,
  });
}

export { container as clientContainer };
