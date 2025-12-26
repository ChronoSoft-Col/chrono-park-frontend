import { IPrintRequestEntity } from "@/src/client/domain";

export abstract class PrintRepository {
  abstract sendToPrinter(request: IPrintRequestEntity): Promise<boolean>;
}
