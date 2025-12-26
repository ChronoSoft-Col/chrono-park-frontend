import { inject, injectable } from "tsyringe";
import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import { EServices } from "@/src/shared/enums/common/services.enum";
import { CommonRepository } from "@/server/domain/index";
import { TRateProfile } from "@/src/shared/types/common/rate-profile.type";

@injectable()
export class CommonUsecase implements CommonRepository {
  constructor(
    @inject("CommonRepository")
    private readonly commonRepository: CommonRepository
  ) {}

  get<T = unknown>(service: EServices): Promise<IGeneralResponse<T>> {
    return this.commonRepository.get<T>(service);
  }

  getRateProfiles(vehicleTypeId: string): Promise<IGeneralResponse<TRateProfile, false>> {
    return this.commonRepository.getRateProfiles(vehicleTypeId);
  }
}
