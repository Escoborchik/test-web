import { configureStore } from '@reduxjs/toolkit';
import { bookingsManagmentReducer } from './bookingsManagment';
import { courtsManagmentReducer } from './courtsManagment';
import { extrasManagmentReducer } from './extrasManagment';
import { tariffsManagmentReducer } from './tariffsManagment';

export const store = configureStore({
	reducer: {
		courtsManagment: courtsManagmentReducer,
		bookingsManagment: bookingsManagmentReducer,
		tariffsManagment: tariffsManagmentReducer,
		extrasManagment: extrasManagmentReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
