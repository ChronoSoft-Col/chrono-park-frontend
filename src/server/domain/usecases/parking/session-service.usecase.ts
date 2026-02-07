import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import IGeneralResponse from "@/shared/interfaces/generic/general-response.interface";
import { 
  ISessionServiceEntity, 
  ISessionServicesResponseEntity, 
  IAddSessionServiceParams 
} from "../../entities/parking/session-services";
import { SessionServiceRepository } from "../../repositories/parking/session-service.repository";

@injectable()
export class SessionServiceUsecase {
  constructor(
    @inject(SERVER_TOKENS.SessionServiceRepository)
    private readonly repository: SessionServiceRepository
  ) {}

  addServiceToSession(
    sessionId: string, 
    params: IAddSessionServiceParams
  ): Promise<IGeneralResponse<ISessionServiceEntity>> {
    return this.repository.addServiceToSession(sessionId, params);
  }

  listSessionServices(
    sessionId: string
  ): Promise<IGeneralResponse<ISessionServicesResponseEntity>> {
    return this.repository.listSessionServices(sessionId);
  }

  removeSessionService(
    sessionId: string, 
    serviceId: string
  ): Promise<IGeneralResponse<void>> {
    return this.repository.removeSessionService(sessionId, serviceId);
  }
}
