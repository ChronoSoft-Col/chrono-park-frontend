import { injectable } from "tsyringe";
import { AxiosServerInstance } from "@/server/infrastructure/index";
import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import { EServices } from "@/src/shared/enums/common/services.enum";
import { TRateProfile } from "@/src/shared/types/common/rate-profile.type";

@injectable()
export class CommonDatasourceService extends AxiosServerInstance {
  async get<T = unknown>(service: EServices): Promise<IGeneralResponse<T>> {
    return this.api.get(`/common/${service}`).then((res) => res.data);
  }

  async getRateProfiles(vehicleTypeId: string): Promise<IGeneralResponse<TRateProfile, false>> {
    return this.api.get(`/rate-profiles`, { params: { vehicleTypeId } }).then((res) => res.data);
  }

}
