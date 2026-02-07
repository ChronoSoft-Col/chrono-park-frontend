import { injectable } from "tsyringe";
import { IGeneralResponse } from "@/shared/interfaces/generic/general-response";
import { 
  SessionServiceRepository, 
  ISessionServiceEntity, 
  ISessionServicesResponseEntity, 
  IAddSessionServiceParams 
} from "@/server/domain";
import { AxiosServerInstance } from "../axios-server.intance";

@injectable()
export class SessionServiceDatasourceService extends AxiosServerInstance implements SessionServiceRepository {
  async addServiceToSession(
    sessionId: string, 
    params: IAddSessionServiceParams
  ): Promise<IGeneralResponse<ISessionServiceEntity, false>> {
    return this.api
      .post<IGeneralResponse<ISessionServiceEntity, false>>(
        `/parking-sessions/${sessionId}/services`,
        params
      )
      .then((response) => response.data);
  }

  async listSessionServices(
    sessionId: string
  ): Promise<IGeneralResponse<ISessionServicesResponseEntity, false>> {
    return this.api
      .get<IGeneralResponse<ISessionServicesResponseEntity, false>>(
        `/parking-sessions/${sessionId}/services`
      )
      .then((response) => response.data);
  }

  async removeSessionService(
    sessionId: string, 
    serviceId: string
  ): Promise<IGeneralResponse<void, false>> {
    return this.api
      .delete<IGeneralResponse<void, false>>(
        `/parking-sessions/${sessionId}/services/${serviceId}`
      )
      .then((response) => response.data);
  }
}
