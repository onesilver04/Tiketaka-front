export interface Reservation {
    reservationId: string;
    departure: string;
    arrival: string;
    departureDate: string; // "YYYY-MM-DD"
    departureTime: string; // "HH:MM"
    arrivalTime: string; // "HH:MM"
    passengerCount: {
        adult: number;
        senior: number;
        youth: number;
    };
    seat?: string;
}
