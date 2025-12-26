'use client'

import { PrintRepository } from "@/client/domain/repositories/printer/print.repository";
import { IPrintRequestEntity } from "@/client/domain/entities/printer/print-request.entity";
import axios from "axios";
import { injectable } from "tsyringe";
import { ENVIRONMENT } from "@/src/shared/constants/environment";

@injectable()
export class PrintDatasourceService implements PrintRepository {
  async sendToPrinter(request: IPrintRequestEntity): Promise<boolean> {
    const apiUrl = ENVIRONMENT.PRINTER_API_URL;

    const normalizedOps = request.operaciones
      .map((op) => {
        if (op.accion === "textalign") {
          return { ...op, accion: "textaling" };
        }
        return op;
      })
      // The current Java printer server does not implement "bold".
      // Drop it to avoid silently doing nothing.
      .filter((op) => op.accion !== "bold");

    try {
      await axios.post(`${apiUrl}/imprimir`, {
        nombre_impresora: request.nombre_impresora,
        operaciones: [...normalizedOps, { accion: "cut", datos: "" }],
      });
      
      await axios.get(`${apiUrl}/abrir-monedero?printer=${request.nombre_impresora}`)
        .catch((error) => console.log(error));
      
      return true;
    } catch {
      return false;
    }
  }
}
