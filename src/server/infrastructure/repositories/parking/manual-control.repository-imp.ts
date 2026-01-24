import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";

import {
  IGenerateManualIncomeParamsEntity,
  IGenerateManualIncomeResponse,
  ManualControlRepository,
} from "@/server/domain/index";
import { ManualControlDatasourceService } from "@/server/infrastructure/index";

@injectable()
export class ManualControlRepositoryImp implements ManualControlRepository {
  constructor(
    @inject(SERVER_TOKENS.ManualControlDatasourceService)
    private manualControlDatasourceService: ManualControlDatasourceService,
  ) {}

  generateManualIncome(
    params: IGenerateManualIncomeParamsEntity,
  ): Promise<IGenerateManualIncomeResponse> {
    return this.manualControlDatasourceService.generateManualIncome(params);
  }

  getEntryTicket(
    parkingSessionId: string,
  ): Promise<IGenerateManualIncomeResponse> {
    return this.manualControlDatasourceService.getEntryTicket(parkingSessionId);
  }
}
