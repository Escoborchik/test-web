import { Extra } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface extrasManagmentState {
	extras: Extra[];
}

const initialState: extrasManagmentState = {
	extras: [
		{
			id: 'extra-racket-rental',
			title: 'Аренда ракетки',
			price: 300,
			unit: 'hour',
			amount: 5,
		},
		{
			id: 'extra-coach-session',
			title: 'Услуга тренера',
			price: 2000,
			unit: 'service',
			amount: 1,
		},
		{
			id: 'extra-ball-set',
			title: 'Набор мячей',
			price: 150,
			unit: 'pcs',
			amount: 1,
		},
		{
			id: 'extra-locker-rental',
			title: 'Аренда ячейки',
			price: 200,
			unit: 'day',
			amount: 1,
		},
		{
			id: 'extra-monthly-parking',
			title: 'Парковка (месяц)',
			price: 5000,
			unit: 'month',
			amount: 1,
		},
	],
};

const extrasManagmentSlice = createSlice({
	name: 'extrasManagment',
	initialState,
	reducers: {
		addExtra: (state, action: PayloadAction<Extra>) => {
			state.extras.unshift(action.payload);
		},

		updateExtra: (state, action: PayloadAction<Extra>) => {
			const curId = action.payload.id;

			const indexOfExtraForReplacing = state.extras.findIndex(
				(extra) => extra.id === curId
			);

			state.extras[indexOfExtraForReplacing] = action.payload;
		},

		deleteExtra: (state, action: PayloadAction<string>) => {
			state.extras = state.extras.filter(
				(extra) => extra.id !== action.payload
			);
		},
	},
	selectors: {
		selectExtras: (state) => state.extras,
	},
});

export const { addExtra, updateExtra, deleteExtra } =
	extrasManagmentSlice.actions;

export const { selectExtras } = extrasManagmentSlice.selectors;

export default extrasManagmentSlice.reducer;
