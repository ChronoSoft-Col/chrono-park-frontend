import { IGenerateManualIncomeParamsEntity, IGenerateManualIncomeResponse, ManualControlRepository } from "@/server/domain";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { inject, injectable } from "tsyringe";

@injectable()
export class ManualControlUseCase implements ManualControlRepository {
    constructor(@inject(SERVER_TOKENS.ManualControlRepository) private manualControlRepository: ManualControlRepository){}

    generateManualIncome(params: IGenerateManualIncomeParamsEntity): Promise<IGenerateManualIncomeResponse> {
        return this.manualControlRepository.generateManualIncome(params)
    }
}