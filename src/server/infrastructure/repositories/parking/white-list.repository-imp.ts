import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { WhiteListDatasourceService } from "@/server/infrastructure/datasources/parking/white-list-datasource.service";
import {
  WhiteListRepository,
  IListWhiteListParamsEntity,
  IListWhiteListResponseEntity,
  ICreateWhiteListParamsEntity,
  IUpdateWhiteListParamsEntity,
} from "@/server/domain";
import IEmptyResponse from "@/shared/interfaces/generic/empty-response";

@injectable()
export class WhiteListRepositoryImp implements WhiteListRepository {
  constructor(
    @inject(SERVER_TOKENS.WhiteListDatasourceService)
    private datasource: WhiteListDatasourceService,
  ) {}

  list(params: IListWhiteListParamsEntity): Promise<IListWhiteListResponseEntity> {
    return this.datasource.list(params);
  }

  create(params: ICreateWhiteListParamsEntity): Promise<IEmptyResponse> {
    return this.datasource.create(params);
  }

  update(id: string, params: IUpdateWhiteListParamsEntity): Promise<IEmptyResponse> {
    return this.datasource.update(id, params);
  }

  deactivate(id: string): Promise<IEmptyResponse> {
    return this.datasource.deactivate(id);
  }
}
