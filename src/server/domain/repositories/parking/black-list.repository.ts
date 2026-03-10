import {
  IListBlackListParamsEntity,
  IListBlackListResponseEntity,
  ICreateBlackListParamsEntity,
  IUpdateBlackListParamsEntity,
} from "@/server/domain";
import IEmptyResponse from "@/src/shared/interfaces/generic/empty-response";

export abstract class BlackListRepository {
  abstract list(params: IListBlackListParamsEntity): Promise<IListBlackListResponseEntity>;
  abstract create(params: ICreateBlackListParamsEntity): Promise<IEmptyResponse>;
  abstract update(id: string, params: IUpdateBlackListParamsEntity): Promise<IEmptyResponse>;
  abstract deactivate(id: string): Promise<IEmptyResponse>;
}
