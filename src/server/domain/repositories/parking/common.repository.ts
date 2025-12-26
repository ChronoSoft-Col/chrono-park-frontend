import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import { EServices } from "@/src/shared/enums/common/services.enum";
import { TRateProfile } from "@/src/shared/types/common/rate-profile.type";

export abstract class CommonRepository {
  abstract get<T = unknown>(service: EServices): Promise<IGeneralResponse<T>>;

  //TODO
  abstract getRateProfiles(vehicleTypeId: string): Promise<IGeneralResponse<TRateProfile, false>>;
}