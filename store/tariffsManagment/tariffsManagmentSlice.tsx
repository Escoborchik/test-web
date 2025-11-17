import { Tariff } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TariffManagmentState {
	tariffs: Tariff[];
}

const initialState: TariffManagmentState = {
	tariffs: [
		{
			id: 'tariff-single-visit',
			title: 'Разовое посещение',
			prices: {
				weekdays: [
					{
						id: 'single-wd-any',
						dayGroup: 'weekdays',
						from: '08:00',
						to: '23:00',
						price: 2000,
					},
				],
				weekends: [
					{
						id: 'single-we-any',
						dayGroup: 'weekends',
						from: '08:00',
						to: '23:00',
						price: 2500,
					},
				],
			},
			isActive: true,
		},
		{
			id: 'tariff-student',
			title: 'Студенческий тариф',
			prices: {
				weekdays: [
					{
						id: 'student-wd-day',
						dayGroup: 'weekdays',
						from: '10:00',
						to: '17:00',
						price: 1000,
					},
				],
				weekends: [
					{
						id: 'student-we-day',
						dayGroup: 'weekends',
						from: '10:00',
						to: '17:00',
						price: 1400,
					},
				],
			},
			isActive: true,
		},
		{
			id: 'tariff-many-visit',
			title: 'Несколько визитов',
			prices: {
				weekdays: [
					{
						id: 'many-wd-day',
						dayGroup: 'weekdays',
						from: '10:00',
						to: '17:00',
						price: 1000,
					},
				],
				weekends: [
					{
						id: 'many-we-day',
						dayGroup: 'weekends',
						from: '10:00',
						to: '17:00',
						price: 1400,
					},
				],
			},
			isActive: true,
		},
		{
			id: 'tariff-subscription',
			title: 'Абонемент',
			prices: {
				weekdays: [
					{
						id: 'sub-wd-morning',
						dayGroup: 'weekdays',
						from: '08:00',
						to: '12:00',
						price: 1200,
					},
					{
						id: 'sub-wd-evening',
						dayGroup: 'weekdays',
						from: '18:00',
						to: '22:00',
						price: 1500,
					},
				],
				weekends: [
					{
						id: 'sub-we-day',
						dayGroup: 'weekends',
						from: '09:00',
						to: '21:00',
						price: 1800,
					},
				],
			},
			isActive: true,
		},
	],
};

const tariffsManagmentSlice = createSlice({
	name: 'tariffsManagment',
	initialState,
	reducers: {
		addTariff: (state, action: PayloadAction<Tariff>) => {
			state.tariffs.unshift(action.payload);
		},

		updateTariff: (state, action: PayloadAction<Tariff>) => {
			const curId = action.payload.id;

			const indexOfTariffForReplacing = state.tariffs.findIndex(
				(tariff) => tariff.id === curId
			);

			state.tariffs[indexOfTariffForReplacing] = action.payload;
		},

		deleteTariff: (state, action: PayloadAction<string>) => {
			state.tariffs = state.tariffs.filter(
				(tariff) => tariff.id !== action.payload
			);
		},

		updateActive: (state, action: PayloadAction<string>) => {
			const tariffIdForUpdate = action.payload;

			const tariffIdx = state.tariffs.findIndex(
				(tariff) => tariff.id === tariffIdForUpdate
			);

			const tariff = state.tariffs[tariffIdx];
			if (tariff) {
				tariff.isActive = !tariff.isActive;
			}
		},
	},
	selectors: {
		selectTariffs: (state) => state.tariffs,
	},
});

export const { addTariff, updateTariff, deleteTariff, updateActive } =
	tariffsManagmentSlice.actions;

export const { selectTariffs } = tariffsManagmentSlice.selectors;

export default tariffsManagmentSlice.reducer;
