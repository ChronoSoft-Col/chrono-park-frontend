'use client'

import "reflect-metadata";
import { container } from "tsyringe";

import { PrintRepository } from "@/client/domain/repositories/printer/print.repository";
import { PrintDatasourceService } from "@/client/infrastructure/datasources/printer/print-datasource.service";
import { PrintRepositoryImpl } from "@/client/infrastructure/repositories/printer/print-repository.impl";

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

export { container as clientContainer };
