import { Booking, BookingStatus } from '@/types/booking';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookingManagmentState {
	bookings: Booking[];
}

const initialState: BookingManagmentState = {
	bookings: [
		{
			id: 'booking-1',
			firstName: 'Алексей',
			lastName: 'Иванов',
			phone: '+7 (900) 123-45-67',
			email: 'alexey.ivanov@example.com',
			courtId: 'court-1',
			date: '2025-11-22',
			time: '09:00-11:00',
			price: 3600,
			status: 'confirmed',
			isRecurring: false,
		},
		{
			id: 'booking-2',
			firstName: 'Мария',
			lastName: 'Соколова',
			phone: '+7 (921) 555-66-77',
			email: 'maria.sokolova@example.com',
			courtId: 'court-2',
			date: '2025-11-23',
			time: '18:00-20:00',
			price: 5200,
			status: 'pending',
			isRecurring: false,
		},
		{
			id: 'booking-3',
			firstName: 'Дмитрий',
			lastName: 'Кузнецов',
			phone: '+7 (916) 777-88-99',
			email: 'dmitry.k@example.com',
			courtId: 'court-3',
			date: '2025-11-24',
			time: '07:00-09:00',
			price: 3200,
			status: 'confirmed',
			isRecurring: true,
			recurringDetails: {
				startDate: '2025-11-24',
				endDate: '2025-12-22',
				weeks: 4,
				days: ['Mon', 'Wed', 'Fri'],
			},
		},
	],
};

const bookingsManagmentSlice = createSlice({
	name: 'bookingsManagment',
	initialState,
	reducers: {
		createBooking: (state, action: PayloadAction<Booking>) => {
			state.bookings.unshift(action.payload);
		},
		updateStatusBooking: (
			state,
			action: PayloadAction<{
				id: string;
				status: BookingStatus;
			}>
		) => {
			const rightBooking = state.bookings.find(
				(booking) => booking.id === action.payload.id
			);

			if (rightBooking) rightBooking.status = action.payload.status;
		},
	},
});

export const { createBooking, updateStatusBooking } =
	bookingsManagmentSlice.actions;

export default bookingsManagmentSlice.reducer;
