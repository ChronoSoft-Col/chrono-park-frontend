'use client'

import { PrintRepository } from "@/client/domain/repositories/printer/print.repository";
import { IPrintRequestEntity } from "@/client/domain/entities/printer/print-request.entity";
import axios from "axios";
import { injectable } from "tsyringe";
import { ENVIRONMENT } from "@/src/shared/constants/environment";

@injectable()
export class PrintDatasourceService implements PrintRepository {
  async sendToPrinter(request: IPrintRequestEntity): Promise<boolean> {
    const apiUrl = ENVIRONMENT.PRINTER_API_URL

    try {
      await axios.post(`${apiUrl}/imprimir`, {
        nombre_impresora: request.nombre_impresora,
        operaciones: [...request.operaciones, { accion: "cut", datos: "" }],
      });
      
      await axios.get(`${apiUrl}/abrir-monedero?printer=${request.nombre_impresora}`)
        .catch(e => console.log(e));
      
      return true;
    } catch (_) {
      return false;
    }
  }
}
