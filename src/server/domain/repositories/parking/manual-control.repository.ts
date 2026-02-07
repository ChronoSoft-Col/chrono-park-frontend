import {
  IGenerateManualIncomeParamsEntity,
  IGenerateManualIncomeResponse,
  IEditParkingSessionParamsEntity,
} from "@/server/domain/index";

export abstract class ManualControlRepository {
  abstract generateManualIncome(
    params: IGenerateManualIncomeParamsEntity,
  ): Promise<IGenerateManualIncomeResponse>;
  abstract getEntryTicket(
    parkingSessionId: string,
  ): Promise<IGenerateManualIncomeResponse>;
  abstract editParkingSession(
    parkingSessionId: string,
    params: IEditParkingSessionParamsEntity,
  ): Promise<void>;
}
