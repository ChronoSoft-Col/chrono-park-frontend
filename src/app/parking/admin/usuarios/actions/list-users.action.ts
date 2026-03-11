"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { buildSearchParams } from "@/lib/search-params";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { UserUsecase, IListUsersResponseEntity } from "@/server/domain";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/shared/constants/pagination";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import { AxiosError } from "axios";
import z from "zod";

const userSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(DEFAULT_PAGE),
  limit: z.coerce.number().int().positive().default(DEFAULT_LIMIT),
  search: z.string().optional(),
  roleId: z.string().optional(),
});

type listUsersActionResponse = Promise<IActionResponse<IListUsersResponseEntity>>

export default async function listUsersAction(
  searchParams?: IPageProps["searchParams"],
): listUsersActionResponse {
  try {
    const params = buildSearchParams(userSearchParamsSchema, searchParams);
    const useCase = serverContainer.resolve<UserUsecase>(SERVER_TOKENS.UserUsecase);
    const response = await useCase.listUsers(params);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error in listUsersAction:", error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error desconocido",
    };
  }
}
