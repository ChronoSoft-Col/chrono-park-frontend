import {
  IListWhiteListParamsEntity,
  IListWhiteListResponseEntity,
  ICreateWhiteListParamsEntity,
  IUpdateWhiteListParamsEntity,
} from "@/server/domain";
import IEmptyResponse from "@/src/shared/interfaces/generic/empty-response";

export abstract class WhiteListRepository {
  abstract list(params: IListWhiteListParamsEntity): Promise<IListWhiteListResponseEntity>;
  abstract create(params: ICreateWhiteListParamsEntity): Promise<IEmptyResponse>;
  abstract update(id: string, params: IUpdateWhiteListParamsEntity): Promise<IEmptyResponse>;
  abstract deactivate(id: string): Promise<IEmptyResponse>;
}
