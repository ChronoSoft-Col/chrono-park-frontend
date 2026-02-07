"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { buildSearchParams } from "@/lib/search-params";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { SubscriptionUsecase, IListSubscriptionsResponseEntity } from "@/server/domain";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/shared/constants/pagination";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import { AxiosError } from "axios";
import z from "zod";

const subscriptionSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(DEFAULT_PAGE),
  limit: z.coerce.number().int().positive().default(DEFAULT_LIMIT),
  search: z.string().optional(),
  customerId: z.string().optional(),
  vehicleTypeId: z.string().optional(),
  monthlyPlanId: z.string().optional(),
  status: z.enum(["PENDIENTE", "ACTIVA", "PERIODO_GRACIA", "INACTIVA", "CANCELADA"]).optional(),
});

type ListSubscriptionsActionResponse = Promise<IActionResponse<IListSubscriptionsResponseEntity>>;

export default async function listSubscriptionsAction(
  searchParams?: IPageProps["searchParams"]
): ListSubscriptionsActionResponse {
  try {
    const params = buildSearchParams(subscriptionSearchParamsSchema, searchParams);
    const useCase = serverContainer.resolve<SubscriptionUsecase>(
      SERVER_TOKENS.SubscriptionUsecase
    );
    const response = await useCase.listSubscriptions(params);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error desconocido",
    };
  }
}
