export type ShortDays = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface RecurringDetails {
	startDate: string;
	endDate: string;
	weeks: number;
	days: ShortDays[];
}

export type BookingStatus =
	| 'rejected'
	| 'pending'
	| 'confirmed'
	| 'pending-payment';

export interface ExtraBooking {
	extraId: string;
	quantity: number;
}

export interface Booking {
	id: string;
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	courtId: string;
	date: string[];
	time: string;
	duration: number;
	price: number;
	status: BookingStatus;
	isRecurring: boolean;
	extras: ExtraBooking[];

	recurringDetails?: RecurringDetails;
}
