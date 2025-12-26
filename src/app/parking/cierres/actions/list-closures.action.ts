"use server";

import { serverContainer } from "@/server/di/container";
import { ClosureUsecase } from "@/server/domain/usecases/parking/closure.usecase";
import { IListClosureResponseEntity } from "@/server/domain/entities/parking/list-closure-response.entity";
import IActionResponse from "@/src/shared/interfaces/generic/action-response";
import IErrorResponse from "@/src/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";
import { IPageProps } from "@/src/shared/interfaces/generic/page-props.interface";
import { buildSearchParams } from "@/src/lib/search-params";
import { DEFAULT_PAGE, DEFAULT_LIMIT } from "@/src/shared/constants/pagination";
import { ClosureTypeEnum } from "@/src/shared/enums/parking/closure-type.enum";
import z from "zod";

const closureSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(DEFAULT_PAGE),
  limit: z.coerce.number().int().positive().default(DEFAULT_LIMIT),
  type: z.nativeEnum(ClosureTypeEnum).optional(),
  date: z.string().optional(),
});

export async function listClosuresAction(
    searchParams?: IPageProps["searchParams"]): Promise<IActionResponse<IListClosureResponseEntity>> {
  try {
    const params = buildSearchParams(closureSearchParamsSchema, searchParams);
    const closureUsecase = serverContainer.resolve(ClosureUsecase);
    const result = await closureUsecase.listClosures(params);
    
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.log(error)
    console.error("Error listing closures:", (error as AxiosError<IErrorResponse>).response?.data);
    return {
      success: false,
      error: (error as AxiosError<IErrorResponse>).response?.data.message || "Error al listar los cierres",
    };
  }
}