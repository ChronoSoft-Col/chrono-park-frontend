import { IGeneralResponse } from "@/shared/interfaces/generic/general-response";
import { 
  ISessionServiceEntity, 
  ISessionServicesResponseEntity, 
  IAddSessionServiceParams 
} from "../entities/parking/session-services";

export abstract class SessionServiceRepository {
  abstract addServiceToSession(
    sessionId: string, 
    params: IAddSessionServiceParams
  ): Promise<IGeneralResponse<ISessionServiceEntity, false>>;
  
  abstract listSessionServices(
    sessionId: string
  ): Promise<IGeneralResponse<ISessionServicesResponseEntity, false>>;
  
  abstract removeSessionService(
    sessionId: string, 
    serviceId: string
  ): Promise<IGeneralResponse<void, false>>;
}
