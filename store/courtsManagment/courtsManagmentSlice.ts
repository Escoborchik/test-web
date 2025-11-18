import { Court } from '@/types';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface CourtsManagmentState {
	courts: Court[];
}

const initialState: CourtsManagmentState = {
	courts: [
		{
			id: 'court-1',
			name: 'Корт №1',
			coverType: 'hard',
			sportType: 'tennis',
			isIndoor: false,
			isVisible: true,
			street: 'Сибирский тракт, 34Б',
			image: '',
			prices: {
				weekdays: [
					{
						id: 'court-1-wd-morning',
						dayGroup: 'weekdays',
						from: '08:00',
						to: '16:00',
						price: 1700,
					},
					{
						id: 'court-1-wd-evening',
						dayGroup: 'weekdays',
						from: '16:00',
						to: '21:00',
						price: 2000,
					},
					{
						id: 'court-1-wd-night',
						dayGroup: 'weekdays',
						from: '21:00',
						to: '23:00',
						price: 1700,
					},
				],
				weekends: [
					{
						id: 'court-1-we-prime',
						dayGroup: 'weekends',
						from: '08:00',
						to: '23:00',
						price: 1700,
					},
				],
			},
			bookingIds: ['booking-1'],
		},
		{
			id: 'court-2',
			name: 'Корт №2',
			coverType: 'hard',
			sportType: 'tennis',
			isIndoor: false,
			isVisible: true,
			street: 'Сибирский тракт, 34Б',
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
			bookingIds: ['booking-2'],
		},
		{
			id: 'court-3',
			name: 'Корт №3',
			coverType: 'hard',
			sportType: 'tennis',
			isIndoor: false,
			isVisible: true,
			street: 'Сибирский тракт, 34Б',
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
			bookingIds: ['booking-3'],
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

		addCourt: (state, action: PayloadAction<Court>) => {
			state.courts.unshift(action.payload);
		},

		deleteCourt: (state, action: PayloadAction<string>) => {
			state.courts = state.courts.filter(
				(court) => court.id !== action.payload
			);
		},

		updateVisible: (state, action: PayloadAction<string>) => {
			const courtIdForUpdate = action.payload;

			const courtIdx = state.courts.findIndex(
				(court) => court.id === courtIdForUpdate
			);

			const court = state.courts[courtIdx];
			if (court) {
				court.isVisible = !court.isVisible;
			}
		},
	},
});

export const { updateCourt, addCourt, updateVisible, deleteCourt } =
	courtsManagmentSlice.actions;

// selectors
const selectCourtsState = (state: RootState) => state.courtsManagment;
export const selectCourts = createSelector(
	selectCourtsState,
	(state) => state.courts
);

// const selectCourtsEntities = createSelector(selectCourtsState, ({ courts }) =>
// 	courts.reduce<Record<string, Court>>((acc, court) => {
// 		acc[court.id] = court;
// 		return acc;
// 	}, {})
// );

// const selectCourtId = (_: RootState, id: string) => id;

// export const selectCourtById = createSelector(
// 	[selectCourtsEntities, selectCourtId],
// 	(entities, id) => {
// 		const court = entities[id];
// 		if (!court) {
// 			throw new Error(`Court with id "${id}" not found`);
// 		}
// 		return court;
// 	}
// );

const selectCourtIdParam = (_state: RootState, id: string) => id;

export const selectCourtById = createSelector(
	[selectCourts, selectCourtIdParam],
	(courts, id) => courts.find((court) => court.id === id) ?? null
);

export default courtsManagmentSlice.reducer;
