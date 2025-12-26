'use server'

import { serverContainer } from "@/server/di/container";

import { IListInOutResponseEntity, InOutUsecase } from "@/server/domain/index";
import { buildSearchParams } from "@/src/lib/search-params";
import { InOutStatusEnum } from "@/src/shared/enums/parking/in-out-status.enum";
import IActionResponse from "@/src/shared/interfaces/generic/action-response";
import IErrorResponse from "@/src/shared/interfaces/generic/error-response.interface";
import { IPageProps } from "@/src/shared/interfaces/generic/page-props.interface";
import { AxiosError } from "axios";
import { z } from "zod";
import { DEFAULT_PAGE, DEFAULT_LIMIT } from "@/src/shared/constants/pagination";

const inOutSearchParamsSchema = z.object({
    page: z.coerce.number().int().positive().default(DEFAULT_PAGE),
    limit: z.coerce.number().int().positive().default(DEFAULT_LIMIT),
    status: z.enum(Object.values(InOutStatusEnum)).default(InOutStatusEnum.ACTIVE),
    vehicleTypeId: z.string().optional(),
    search: z.string().optional(),
});

export async function getInOutsAction(
    searchParams?: IPageProps["searchParams"]
): Promise<IActionResponse<IListInOutResponseEntity>> {
    try {
        const params = buildSearchParams(inOutSearchParamsSchema, searchParams);
        const useCase = serverContainer.resolve(InOutUsecase);
        const response = await useCase.listInOuts(params);
        console.log("InOuts fetched with params:", params);
        return { success: true, data: response };
    } catch (error) {
        return {
            success: false,
            error:
                (error as AxiosError<IErrorResponse>).response?.data.message ??
                "Error desconocido",
        };
    }
}