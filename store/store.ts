import { configureStore } from '@reduxjs/toolkit';
import { bookingsManagmentReducer } from './bookingsManagment';
import { courtsManagmentReducer } from './courtsManagment';

export const store = configureStore({
	reducer: {
		courtsManagment: courtsManagmentReducer,
		bookingsManagment: bookingsManagmentReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
