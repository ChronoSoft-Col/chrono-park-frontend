"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { buildSearchParams } from "@/lib/search-params";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { MasterKeysUsecase, IListMasterKeyLogsResponseEntity } from "@/server/domain";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/shared/constants/pagination";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import { AxiosError } from "axios";
import z from "zod";

const masterKeyLogsSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(DEFAULT_PAGE),
  limit: z.coerce.number().int().positive().default(DEFAULT_LIMIT),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  keyId: z.string().optional(),
  registerDeviceId: z.string().optional(),
});

type ListMasterKeyLogsActionResponse = Promise<IActionResponse<IListMasterKeyLogsResponseEntity>>;

export default async function listMasterKeyLogsAction(
  searchParams?: IPageProps["searchParams"],
): ListMasterKeyLogsActionResponse {
  try {
    const params = buildSearchParams(masterKeyLogsSearchParamsSchema, searchParams);
    const useCase = serverContainer.resolve<MasterKeysUsecase>(SERVER_TOKENS.MasterKeysUsecase);
    const response = await useCase.listLogs(params);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error in listMasterKeyLogsAction:", error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error desconocido",
    };
  }
}
