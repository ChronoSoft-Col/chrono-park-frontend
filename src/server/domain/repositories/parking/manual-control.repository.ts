import {
  IGenerateManualIncomeParamsEntity,
  IGenerateManualIncomeResponse,
} from "@/server/domain/index";

export abstract class ManualControlRepository {
  abstract generateManualIncome(
    params: IGenerateManualIncomeParamsEntity,
  ): Promise<IGenerateManualIncomeResponse>;
  abstract getEntryTicket(
    parkingSessionId: string,
  ): Promise<IGenerateManualIncomeResponse>;
}
