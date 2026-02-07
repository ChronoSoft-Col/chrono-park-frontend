import { injectable, inject } from "tsyringe";
import { IGeneralResponse } from "@/shared/interfaces/generic/general-response";
import { 
  SessionServiceRepository, 
  ISessionServiceEntity, 
  ISessionServicesResponseEntity, 
  IAddSessionServiceParams 
} from "@/server/domain";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { SessionServiceDatasourceService } from "../../datasources/parking/session-service-datasource.service";

@injectable()
export class SessionServiceRepositoryImp extends SessionServiceRepository {
  constructor(
    @inject(SERVER_TOKENS.SessionServiceDatasource)
    private readonly datasource: SessionServiceDatasourceService
  ) {
    super();
  }

  addServiceToSession(
    sessionId: string, 
    params: IAddSessionServiceParams
  ): Promise<IGeneralResponse<ISessionServiceEntity, false>> {
    return this.datasource.addServiceToSession(sessionId, params);
  }

  listSessionServices(
    sessionId: string
  ): Promise<IGeneralResponse<ISessionServicesResponseEntity, false>> {
    return this.datasource.listSessionServices(sessionId);
  }

  removeSessionService(
    sessionId: string, 
    serviceId: string
  ): Promise<IGeneralResponse<void, false>> {
    return this.datasource.removeSessionService(sessionId, serviceId);
  }
}
