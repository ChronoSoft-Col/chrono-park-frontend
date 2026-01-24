import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import IGeneralResponse from "@/shared/interfaces/generic/general-response.interface";
import { EServices } from "@/shared/enums/common/services.enum";
import { CommonRepository } from "@/server/domain/index";
import { TRateProfile } from "@/shared/types/common/rate-profile.type";

@injectable()
export class CommonUsecase implements CommonRepository {
  constructor(
    @inject(SERVER_TOKENS.CommonRepository)
    private readonly commonRepository: CommonRepository
  ) {}

  get<T = unknown>(service: EServices): Promise<IGeneralResponse<T>> {
    return this.commonRepository.get<T>(service);
  }

  getRateProfiles(vehicleTypeId: string): Promise<IGeneralResponse<TRateProfile, false>> {
    return this.commonRepository.getRateProfiles(vehicleTypeId);
  }
}
