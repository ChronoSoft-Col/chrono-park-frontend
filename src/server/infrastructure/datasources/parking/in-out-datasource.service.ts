import { injectable } from "tsyringe";

import {
  IListInOutParamsEntity,
  IListInOutResponseEntity,
  InOutRepository,
} from "@/server/domain/index";
import { AxiosServerInstance } from "../axios-server.intance";

@injectable()
export class InOutDatasourceService
  extends AxiosServerInstance
  implements InOutRepository
{
  async listInOuts(
    params: IListInOutParamsEntity
  ): Promise<IListInOutResponseEntity> {
    return this.api
      .get<IListInOutResponseEntity>("/parking-sessions/list", { params })
      .then((response) => response.data)
      .catch(e=> console.log(e)) as unknown as IListInOutResponseEntity
      ;
  }
}
