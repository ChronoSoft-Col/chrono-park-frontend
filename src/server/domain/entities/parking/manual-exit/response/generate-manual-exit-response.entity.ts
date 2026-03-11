import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

export interface IManualExitData {
    parkingSessionId: string
    licensePlate?: string
    entryTime: string
    exitTime: string
    status: string
    finalAmount?: number
    message: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IGenerateManualExitResponse extends IGeneralResponse<IManualExitData> {}
