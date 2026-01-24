"use server";

import { serverContainer } from "@/server/di/container";
import { ClosureUsecase } from "@/server/domain/usecases/parking/closure.usecase";
import { IListClosureResponseEntity } from "@/server/domain/entities/parking/closures/response/list-closure-response.entity";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";
import { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import { buildSearchParams } from "@/lib/search-params";
import { DEFAULT_PAGE, DEFAULT_LIMIT } from "@/shared/constants/pagination";
import { ClosureTypeEnum } from "@/shared/enums/parking/closure-type.enum";
import z from "zod";
import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";

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
    const closureUsecase = serverContainer.resolve<ClosureUsecase>(SERVER_TOKENS.ClosureUsecase);
    const result = await closureUsecase.listClosures(params);
    
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    return {
      success: false,
      error: (error as AxiosError<IErrorResponse>).response?.data.message || "Error al listar los cierres",
    };
  }
}