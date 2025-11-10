'use client';

import { ReactNode } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru';
import { Provider } from 'react-redux';
import { store } from '@/store';

export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<Provider store={store}>
			<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
				{children}
			</LocalizationProvider>
		</Provider>
	);
}
