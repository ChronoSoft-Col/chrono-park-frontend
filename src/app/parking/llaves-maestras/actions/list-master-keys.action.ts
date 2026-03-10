"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { buildSearchParams } from "@/lib/search-params";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { MasterKeysUsecase, IListMasterKeysResponseEntity } from "@/server/domain";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/shared/constants/pagination";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import { AxiosError } from "axios";
import z from "zod";

const masterKeysSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(DEFAULT_PAGE),
  limit: z.coerce.number().int().positive().default(DEFAULT_LIMIT),
  search: z.string().optional(),
});

type ListMasterKeysActionResponse = Promise<IActionResponse<IListMasterKeysResponseEntity>>;

export default async function listMasterKeysAction(
  searchParams?: IPageProps["searchParams"],
): ListMasterKeysActionResponse {
  try {
    const params = buildSearchParams(masterKeysSearchParamsSchema, searchParams);
    const useCase = serverContainer.resolve<MasterKeysUsecase>(SERVER_TOKENS.MasterKeysUsecase);
    const response = await useCase.list(params);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error in listMasterKeysAction:", error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error desconocido",
    };
  }
}
