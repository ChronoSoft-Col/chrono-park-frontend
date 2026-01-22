import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import IIdName from "@/src/shared/interfaces/generic/id-name.interface";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IGeneratePaymentResponseEntity extends IGeneralResponse<IPaymentResponseContent> {
}

export interface IPaymentResponseContent {
success: boolean;
totalAmount: number;
amountReceived: number;
change: number;
// Some backend versions return the generated payment id at top-level.
paymentId?: string;
session: {
    id: string;
    entryTime: string;
    exitTime: string;
    status: string;
    vehicle: {
        id: string;
        licensePlate: string;
        owner: {
            id: string;
            firstName: string;
            lastName: string;
            documentNumber: string;
        };
        vehicleType: IIdName
    };
    rateProfile: IIdName
    calculatedAmount: number;
    finalAmount: number;
    discount: number;
    notes: string;
    // Some backend versions return the generated payment id inside the session.
    paymentId?: string;
}}