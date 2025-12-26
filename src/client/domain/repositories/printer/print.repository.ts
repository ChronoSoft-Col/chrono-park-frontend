import { IPrintRequestEntity } from "@/client/domain/entities/printer/print-request.entity";
export abstract class PrintRepository {
  abstract sendToPrinter(request: IPrintRequestEntity): Promise<boolean>;
}
