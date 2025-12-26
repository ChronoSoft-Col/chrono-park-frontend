
export interface IGeneratePaymentParamsEntity {
    parkingSessionId: string;
    paymentMethodId: string;
    amountReceived: number;
    notes?: string;
}
