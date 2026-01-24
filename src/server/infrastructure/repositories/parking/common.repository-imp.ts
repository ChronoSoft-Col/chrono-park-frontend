import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import IGeneralResponse from "@/shared/interfaces/generic/general-response.interface";
import { EServices } from "@/shared/enums/common/services.enum";
import { CommonDatasourceService } from "@/server/infrastructure/index";
import { TRateProfile } from "@/shared/types/common/rate-profile.type";
import { CommonRepository } from "@/server/domain";

@injectable()
export class CommonRepositoryImp implements CommonRepository {
  constructor(
    @inject(SERVER_TOKENS.CommonDatasourceService)
    private readonly ds: CommonDatasourceService
  ) {}

  get<T = unknown>(service: EServices): Promise<IGeneralResponse<T>> {
    return this.ds.get<T>(service);
  }

  getRateProfiles(vehicleTypeId: string): Promise<IGeneralResponse<TRateProfile, false>> {
    return this.ds.getRateProfiles(vehicleTypeId);
  }
}
