'use client';

import { ReactNode } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru';

export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
			{children}
		</LocalizationProvider>
	);
}
