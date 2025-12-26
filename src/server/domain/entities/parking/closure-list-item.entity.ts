import { ClosureTypeEnum } from "@/src/shared/enums/parking/closure-type.enum";

export interface IClosureListItemEntity {
  id: string;
  operatorName: string;
  closureType: ClosureTypeEnum;
  startedAt: string;
  finishedAt: string;
  createdOn: string;
  createdAt?: string;
}
