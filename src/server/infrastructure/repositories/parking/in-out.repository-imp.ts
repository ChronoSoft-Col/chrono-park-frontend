import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";

import {
  IListInOutParamsEntity,
  IListInOutResponseEntity,
  InOutRepository,
} from "@/server/domain/index";
import { InOutDatasourceService } from "@/server/infrastructure/index";

@injectable()
export class InOutRepositoryImp implements InOutRepository {
  constructor(
    @inject(SERVER_TOKENS.InOutDatasourceService)
    private readonly inOutDatasource: InOutDatasourceService
  ) {}

  listInOuts(params: IListInOutParamsEntity): Promise<IListInOutResponseEntity> {
    return this.inOutDatasource.listInOuts(params);
  }
}
