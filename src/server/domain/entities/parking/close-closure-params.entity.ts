import { ClosureTypeEnum } from "@/src/shared/enums/parking/closure-type.enum";

export interface ICloseClosureParamsEntity {
  type: ClosureTypeEnum;
  notes?: string;
}
