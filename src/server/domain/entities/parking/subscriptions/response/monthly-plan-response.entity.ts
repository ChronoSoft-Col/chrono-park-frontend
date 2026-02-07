import { IMonthlyPlanEntity } from "../subscription.entity";
import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

// Respuesta para listar planes
export interface IListMonthlyPlansResponseEntity {
  plans: IMonthlyPlanEntity[];
  total: number;
}

// Respuesta envuelta de un solo plan
export type IMonthlyPlanResponseEntity = IGeneralResponse<IMonthlyPlanEntity>;

// Respuesta de lista de planes
export type IMonthlyPlansListResponseEntity = IGeneralResponse<IListMonthlyPlansResponseEntity>;

// Respuesta de planes por tipo de vehículo (array directo)
export type IMonthlyPlansByVehicleTypeResponseEntity = IGeneralResponse<IMonthlyPlanEntity[], false>;
