import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import {
  IListWhiteListParamsEntity,
  IListWhiteListResponseEntity,
  ICreateWhiteListParamsEntity,
  IUpdateWhiteListParamsEntity,
  WhiteListRepository,
} from "@/server/domain";
import IEmptyResponse from "@/shared/interfaces/generic/empty-response";

@injectable()
export class WhiteListUsecase implements WhiteListRepository {
  constructor(
    @inject(SERVER_TOKENS.WhiteListRepository)
    private readonly whiteListRepository: WhiteListRepository,
  ) {}

  list(params: IListWhiteListParamsEntity): Promise<IListWhiteListResponseEntity> {
    return this.whiteListRepository.list(params);
  }

  create(params: ICreateWhiteListParamsEntity): Promise<IEmptyResponse> {
    return this.whiteListRepository.create(params);
  }

  update(id: string, params: IUpdateWhiteListParamsEntity): Promise<IEmptyResponse> {
    return this.whiteListRepository.update(id, params);
  }

  deactivate(id: string): Promise<IEmptyResponse> {
    return this.whiteListRepository.deactivate(id);
  }
}
