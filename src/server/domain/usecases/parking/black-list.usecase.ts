import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import {
  IListBlackListParamsEntity,
  IListBlackListResponseEntity,
  ICreateBlackListParamsEntity,
  IUpdateBlackListParamsEntity,
  BlackListRepository,
} from "@/server/domain";
import IEmptyResponse from "@/shared/interfaces/generic/empty-response";

@injectable()
export class BlackListUsecase implements BlackListRepository {
  constructor(
    @inject(SERVER_TOKENS.BlackListRepository)
    private readonly blackListRepository: BlackListRepository,
  ) {}

  list(params: IListBlackListParamsEntity): Promise<IListBlackListResponseEntity> {
    return this.blackListRepository.list(params);
  }

  create(params: ICreateBlackListParamsEntity): Promise<IEmptyResponse> {
    return this.blackListRepository.create(params);
  }

  update(id: string, params: IUpdateBlackListParamsEntity): Promise<IEmptyResponse> {
    return this.blackListRepository.update(id, params);
  }

  deactivate(id: string): Promise<IEmptyResponse> {
    return this.blackListRepository.deactivate(id);
  }
}
