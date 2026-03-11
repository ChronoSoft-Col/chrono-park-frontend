"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { buildSearchParams } from "@/lib/search-params";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { RoleUsecase, IListRolesResponseEntity } from "@/server/domain";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/shared/constants/pagination";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import { AxiosError } from "axios";
import z from "zod";

const roleSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(DEFAULT_PAGE),
  limit: z.coerce.number().int().positive().default(DEFAULT_LIMIT),
  search: z.string().optional(),
  isActive: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : undefined),
    z.boolean().optional(),
  ),
});

export default async function listRolesAction(
  searchParams?: IPageProps["searchParams"],
): Promise<IActionResponse<IListRolesResponseEntity>> {
  try {
    const params = buildSearchParams(roleSearchParamsSchema, searchParams);
    const useCase = serverContainer.resolve<RoleUsecase>(SERVER_TOKENS.RoleUsecase);
    const response = await useCase.listRoles(params);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error in listRolesAction:", error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error desconocido",
    };
  }
}
