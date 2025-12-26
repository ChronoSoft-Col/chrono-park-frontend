'use client'

import { PrintRepository } from "@/client/domain/repositories/printer/print.repository";
import { IPrintRequestEntity } from "@/client/domain/entities/printer/print-request.entity";
import { PrintDatasourceService } from "@/client/infrastructure/datasources/printer/print-datasource.service";
import { inject, injectable } from "tsyringe";

@injectable()
export class PrintRepositoryImpl implements PrintRepository {
  constructor(
    @inject("PrintDatasourceService")
    private printDatasource: PrintDatasourceService
  ) {}

  async sendToPrinter(request: IPrintRequestEntity): Promise<boolean> {
    return this.printDatasource.sendToPrinter(request);
  }
}
