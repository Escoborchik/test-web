import { configureStore } from '@reduxjs/toolkit';
import { courtsManagmentReducer } from './courtsManagment';

export const store = configureStore({
	reducer: {
		courtsManagment: courtsManagmentReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
