import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { BlackListDatasourceService } from "@/server/infrastructure/datasources/parking/black-list-datasource.service";
import {
  BlackListRepository,
  IListBlackListParamsEntity,
  IListBlackListResponseEntity,
  ICreateBlackListParamsEntity,
  IUpdateBlackListParamsEntity,
} from "@/server/domain";
import IEmptyResponse from "@/shared/interfaces/generic/empty-response";

@injectable()
export class BlackListRepositoryImp implements BlackListRepository {
  constructor(
    @inject(SERVER_TOKENS.BlackListDatasourceService)
    private datasource: BlackListDatasourceService,
  ) {}

  list(params: IListBlackListParamsEntity): Promise<IListBlackListResponseEntity> {
    return this.datasource.list(params);
  }

  create(params: ICreateBlackListParamsEntity): Promise<IEmptyResponse> {
    return this.datasource.create(params);
  }

  update(id: string, params: IUpdateBlackListParamsEntity): Promise<IEmptyResponse> {
    return this.datasource.update(id, params);
  }

  deactivate(id: string): Promise<IEmptyResponse> {
    return this.datasource.deactivate(id);
  }
}
