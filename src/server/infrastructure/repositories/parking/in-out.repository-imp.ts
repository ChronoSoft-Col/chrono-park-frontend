import { inject, injectable } from "tsyringe";

import {
  IListInOutParamsEntity,
  IListInOutResponseEntity,
  InOutRepository,
} from "@/server/domain/index";
import { InOutDatasourceService } from "@/server/infrastructure/index";

@injectable()
export class InOutRepositoryImp implements InOutRepository {
  constructor(
    @inject("InOutDatasourceService")
    private readonly inOutDatasource: InOutDatasourceService
  ) {}

  listInOuts(params: IListInOutParamsEntity): Promise<IListInOutResponseEntity> {
    return this.inOutDatasource.listInOuts(params);
  }
}
