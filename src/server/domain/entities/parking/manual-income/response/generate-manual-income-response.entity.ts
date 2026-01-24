import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import { TPrintIncomeBody } from "@/src/shared/types/parking/print-income-body.type";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IGenerateManualIncomeResponse extends IGeneralResponse<TPrintIncomeBody> {}