// src/types/ReservationDetail.ts

export interface ReservationDetail {
    reservationId: string;
    trainId: string;
    carriageNumber: number;
    seat: string;
    phoneNumber: string;
    passengerCount: {
        adult: number;
        senior: number;
        youth: number;
    };
    paymentMethod: string;
    cardNumber?: string;
}
