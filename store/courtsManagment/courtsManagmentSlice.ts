import { Court } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface CourtsManagmentState {
	courts: Court[];
}

const initialState: CourtsManagmentState = {
	courts: [
		{
			id: 'court-1',
			name: 'Central Court A',
			coverType: 'hard',
			sportType: 'tennis',
			isIndoor: false,
			isVisible: true,
			street: 'ул. Спортивная, 15',
			image: '',
			prices: {
				weekdays: [
					{
						id: 'court-1-wd-morning',
						dayGroup: 'weekdays',
						from: '08:00',
						to: '12:00',
						price: 1800,
					},
					{
						id: 'court-1-wd-evening',
						dayGroup: 'weekdays',
						from: '18:00',
						to: '22:00',
						price: 2400,
					},
				],
				weekends: [
					{
						id: 'court-1-we-prime',
						dayGroup: 'weekends',
						from: '09:00',
						to: '21:00',
						price: 2800,
					},
				],
			},
		},
		{
			id: 'court-2',
			name: 'Panorama Indoor',
			coverType: 'terraflex',
			sportType: 'padel',
			isIndoor: true,
			isVisible: true,
			street: 'просп. Панорамный, 8',
			image: '',
			prices: {
				weekdays: [
					{
						id: 'court-2-wd-day',
						dayGroup: 'weekdays',
						from: '10:00',
						to: '16:00',
						price: 2200,
					},
					{
						id: 'court-2-wd-evening',
						dayGroup: 'weekdays',
						from: '16:00',
						to: '22:00',
						price: 2600,
					},
				],
				weekends: [
					{
						id: 'court-2-we-full',
						dayGroup: 'weekends',
						from: '09:00',
						to: '23:00',
						price: 3200,
					},
				],
			},
		},
		{
			id: 'court-3',
			name: 'Green Park Court',
			coverType: 'grass',
			sportType: 'tennis',
			isIndoor: false,
			isVisible: true,
			street: 'ул. Парковая, 3к2',
			image: '',
			prices: {
				weekdays: [
					{
						id: 'court-3-wd-morning',
						dayGroup: 'weekdays',
						from: '07:00',
						to: '11:00',
						price: 1600,
					},
					{
						id: 'court-3-wd-day',
						dayGroup: 'weekdays',
						from: '11:00',
						to: '17:00',
						price: 1900,
					},
				],
				weekends: [
					{
						id: 'court-3-we-day',
						dayGroup: 'weekends',
						from: '08:00',
						to: '20:00',
						price: 2500,
					},
				],
			},
		},
	],
};

const courtsManagmentSlice = createSlice({
	name: 'courtsManagment',
	initialState,
	reducers: {
		updateCourt: (state, action: PayloadAction<Court>) => {
			const curId = action.payload.id;

			const indexOfCourtForReplacing = state.courts.findIndex(
				(court) => court.id === curId
			);

			state.courts[indexOfCourtForReplacing] = action.payload;
		},
	},
});

export const { updateCourt } = courtsManagmentSlice.actions;

// selectors
export const selectCourts = (state: RootState) => state.courtsManagment.courts;

export default courtsManagmentSlice.reducer;
