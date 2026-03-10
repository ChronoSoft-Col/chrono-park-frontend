import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import {
  IListMasterKeysParamsEntity,
  IListMasterKeysResponseEntity,
  ICreateMasterKeyParamsEntity,
  IUpdateMasterKeyParamsEntity,
  IListMasterKeyLogsParamsEntity,
  IListMasterKeyLogsResponseEntity,
  MasterKeysRepository,
} from "@/server/domain";
import IEmptyResponse from "@/shared/interfaces/generic/empty-response";

@injectable()
export class MasterKeysUsecase implements MasterKeysRepository {
  constructor(
    @inject(SERVER_TOKENS.MasterKeysRepository)
    private readonly masterKeysRepository: MasterKeysRepository,
  ) {}

  list(params: IListMasterKeysParamsEntity): Promise<IListMasterKeysResponseEntity> {
    return this.masterKeysRepository.list(params);
  }

  create(params: ICreateMasterKeyParamsEntity): Promise<IEmptyResponse> {
    return this.masterKeysRepository.create(params);
  }

  update(id: string, params: IUpdateMasterKeyParamsEntity): Promise<IEmptyResponse> {
    return this.masterKeysRepository.update(id, params);
  }

  deactivate(id: string): Promise<IEmptyResponse> {
    return this.masterKeysRepository.deactivate(id);
  }

  listLogs(params: IListMasterKeyLogsParamsEntity): Promise<IListMasterKeyLogsResponseEntity> {
    return this.masterKeysRepository.listLogs(params);
  }
}
