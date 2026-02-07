import { IGeneralResponse } from "@/shared/interfaces/generic/general-response";
import { 
  ISessionServiceEntity, 
  ISessionServicesResponseEntity, 
  IAddSessionServiceParams 
} from "../entities/parking/session-services";
import { SessionServiceRepository } from "../repositories/parking/session-service.repository";

export class SessionServiceUsecase {
  constructor(private readonly repository: SessionServiceRepository) {}

  addServiceToSession(
    sessionId: string, 
    params: IAddSessionServiceParams
  ): Promise<IGeneralResponse<ISessionServiceEntity, false>> {
    return this.repository.addServiceToSession(sessionId, params);
  }

  listSessionServices(
    sessionId: string
  ): Promise<IGeneralResponse<ISessionServicesResponseEntity, false>> {
    return this.repository.listSessionServices(sessionId);
  }

  removeSessionService(
    sessionId: string, 
    serviceId: string
  ): Promise<IGeneralResponse<void, false>> {
    return this.repository.removeSessionService(sessionId, serviceId);
  }
}
