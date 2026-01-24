"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { buildSearchParams } from "@/lib/search-params";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { CustomerUsecase, IListCustomersResponseEntity } from "@/server/domain";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/shared/constants/pagination";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import { AxiosError } from "axios";
import z from "zod";

const customerSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(DEFAULT_PAGE),
  limit: z.coerce.number().int().positive().default(DEFAULT_LIMIT),
  search: z.string().optional(),
});

type listCustomersActionResponse = Promise<IActionResponse<IListCustomersResponseEntity>>

export default async function listCustomersAction(
  searchParams?: IPageProps["searchParams"],
): listCustomersActionResponse {
  try {
    const params = buildSearchParams(customerSearchParamsSchema, searchParams);
    const useCase = serverContainer.resolve<CustomerUsecase>(SERVER_TOKENS.CustomerUsecase);
    const response = await useCase.listCustomers(params);
    console.log("Customers fetched with params:", params);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error in listCustomersAction:", error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error desconocido",
    };
  }
}
