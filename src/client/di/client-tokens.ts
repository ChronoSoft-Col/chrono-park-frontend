export const CLIENT_TOKENS = {
  // UseCases
  PrintUsecase: Symbol.for("client:PrintUsecase"),
  PaymentTicketPrintUsecase: Symbol.for("client:PaymentTicketPrintUsecase"),

  // Repositories
  PrintRepository: Symbol.for("client:PrintRepository"),
  PaymentTicketPrinterRepository: Symbol.for("client:PaymentTicketPrinterRepository"),

  // Datasources
  PrintDatasourceService: Symbol.for("client:PrintDatasourceService"),
  PaymentTicketPrinterDatasourceService: Symbol.for(
    "client:PaymentTicketPrinterDatasourceService"
  ),
} as const;
