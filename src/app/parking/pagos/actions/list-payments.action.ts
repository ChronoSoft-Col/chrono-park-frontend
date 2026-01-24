"use server";

import { serverContainer } from "@/server/di/container";
import { PaymentUsecase, type IListPaymentsResponseEntity } from "@/server/domain";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { buildSearchParams } from "@/lib/search-params";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/shared/constants/pagination";
import type IActionResponse from "@/shared/interfaces/generic/action-response";
import type IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import type { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { AxiosError } from "axios";
import { z } from "zod";

const paymentsSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(DEFAULT_PAGE),
  limit: z.coerce.number().int().positive().default(DEFAULT_LIMIT),
  search: z.string().optional(),
  date: z.string().optional(),
});

export async function listPaymentsAction(
  searchParams?: IPageProps["searchParams"],
): Promise<IActionResponse<IListPaymentsResponseEntity>> {
  try {
    const params = buildSearchParams(paymentsSearchParamsSchema, searchParams);

    const startEnd = params.date ? { startDate: params.date, endDate: params.date } : {};

    const useCase = serverContainer.resolve<PaymentUsecase>(SERVER_TOKENS.PaymentUsecase);
    const response = await useCase.listPayments({
      page: params.page,
      limit: params.limit,
      search: params.search,
      ...startEnd,
    });

    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ||
        "Error al listar los pagos",
    };
  }
}
