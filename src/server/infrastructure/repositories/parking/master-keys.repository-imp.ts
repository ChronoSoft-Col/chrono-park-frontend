import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { MasterKeysDatasourceService } from "@/server/infrastructure/datasources/parking/master-keys-datasource.service";
import {
  MasterKeysRepository,
  IListMasterKeysParamsEntity,
  IListMasterKeysResponseEntity,
  ICreateMasterKeyParamsEntity,
  IUpdateMasterKeyParamsEntity,
  IListMasterKeyLogsParamsEntity,
  IListMasterKeyLogsResponseEntity,
} from "@/server/domain";
import IEmptyResponse from "@/shared/interfaces/generic/empty-response";

@injectable()
export class MasterKeysRepositoryImp implements MasterKeysRepository {
  constructor(
    @inject(SERVER_TOKENS.MasterKeysDatasourceService)
    private datasource: MasterKeysDatasourceService,
  ) {}

  list(params: IListMasterKeysParamsEntity): Promise<IListMasterKeysResponseEntity> {
    return this.datasource.list(params);
  }

  create(params: ICreateMasterKeyParamsEntity): Promise<IEmptyResponse> {
    return this.datasource.create(params);
  }

  update(id: string, params: IUpdateMasterKeyParamsEntity): Promise<IEmptyResponse> {
    return this.datasource.update(id, params);
  }

  deactivate(id: string): Promise<IEmptyResponse> {
    return this.datasource.deactivate(id);
  }

  listLogs(params: IListMasterKeyLogsParamsEntity): Promise<IListMasterKeyLogsResponseEntity> {
    return this.datasource.listLogs(params);
  }
}
