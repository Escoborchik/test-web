'use client';

import {
	Select,
	SelectGroup,
	SelectPortal,
	SelectValue,
} from '@radix-ui/react-select';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SelectContent } from './selectcontent';
import { SelectItem } from './selectitem';
import { SelectItemText } from './selectitemtext';
import { SelectTrigger } from './selecttrigger';
import { SelectViewport } from './selectviewport';

interface TimePickerProps {
	value?: string;
	onChange?: (value: string) => void;
	since?: string;
	maxHour?: number; // Максимальный час (по умолчанию 23)
}

export const TimePicker = ({
	value = '07:00',
	onChange,
	since,
	maxHour = 23,
}: TimePickerProps) => {
	const [selectedHour, setSelectedHour] = useState('07');
	const [selectedMinute, setSelectedMinute] = useState('00');

	const reallySince = useMemo(() => {
		const splittedHoursStr = since ? since.split(':')[0] : '07';
		const splittedHoursStrWithoutZero = splittedHoursStr.replace(/^0+/, '');

		const hour = Number(splittedHoursStrWithoutZero);
		// Ограничиваем максимальный час до maxHour
		return Math.min(hour, maxHour);
	}, [since, maxHour]);

	const hourOptions = useMemo(() => {
		const options = [];
		// Начинаем с reallySince и идем до maxHour
		const startHour = Math.min(reallySince, maxHour);
		for (let i = startHour; i <= maxHour; i++) {
			options.push({
				value: i.toString().padStart(2, '0'),
				label: i.toString().padStart(2, '0'),
			});
		}
		return options;
	}, [reallySince, maxHour]);

	// Array.from({ length: 24 }, (_, i) => ({
	// 	value: i.toString().padStart(2, '0'),
	// 	label: i.toString().padStart(2, '0'),
	// }));

	const minuteOptions = useMemo(() => {
		return [
			{ value: '00', label: '00' },
			{ value: '30', label: '30' },
		];
	}, []);

	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;

	const selectedHourRef = useRef(selectedHour);
	const selectedMinuteRef = useRef(selectedMinute);

	useEffect(() => {
		selectedHourRef.current = selectedHour;
	}, [selectedHour]);

	useEffect(() => {
		selectedMinuteRef.current = selectedMinute;
	}, [selectedMinute]);

	useEffect(() => {
		if (value) {
			const [hour, minute] = value.split(':');
			const hourNum = Number.parseInt(hour || '08', 10);

			// Если час больше максимального доступного (maxHour), обновляем на максимальный
			if (hourNum > maxHour) {
				const maxTime = `${maxHour.toString().padStart(2, '0')}:00`;
				if (onChangeRef.current && value !== maxTime) {
					onChangeRef.current(maxTime);
				}
				setSelectedHour(maxHour.toString().padStart(2, '0'));
				setSelectedMinute('00');
				return;
			}

			// Если час меньше минимального доступного (since), обновляем на минимальный
			if (since && hourNum < reallySince) {
				const minTime = `${reallySince.toString().padStart(2, '0')}:00`;
				if (onChangeRef.current && value !== minTime) {
					onChangeRef.current(minTime);
				}
				setSelectedHour(reallySince.toString().padStart(2, '0'));
				setSelectedMinute('00');
			} else {
				const newTime = `${hour || '08'}:${minute || '00'}`;
				const currentTime = `${selectedHourRef.current}:${selectedMinuteRef.current}`;

				if (newTime !== currentTime) {
					setSelectedHour(hour || '08');
					setSelectedMinute(minute || '00');
				}
			}
		}
	}, [value, since, reallySince, maxHour]);

	const handleHourChange = useCallback(
		(hour: string) => {
			setSelectedHour(hour);
			const newTime = `${hour}:${selectedMinuteRef.current}`;
			if (newTime !== value) {
				onChangeRef.current?.(newTime);
			}
		},
		[value]
	);

	const handleMinuteChange = useCallback(
		(minute: string) => {
			setSelectedMinute(minute);
			const newTime = `${selectedHourRef.current}:${minute}`;
			if (newTime !== value) {
				onChangeRef.current?.(newTime);
			}
		},
		[value]
	);

	return (
		<div className="flex gap-2">
			{/* Выбор часов */}
			<Select value={selectedHour} onValueChange={handleHourChange}>
				<SelectTrigger className="w-16">
					<SelectValue placeholder="ЧЧ" />
				</SelectTrigger>
				<SelectPortal>
					<SelectContent
						className="min-w-[4rem] z-[60]"
						position="popper"
						sideOffset={4}
					>
						<SelectViewport className="max-h-48 overflow-y-auto">
							<SelectGroup>
								{hourOptions.map(
									({ value: optionValue, label }) => (
										<SelectItem
											key={optionValue}
											value={optionValue}
										>
											<SelectItemText>
												{label}
											</SelectItemText>
										</SelectItem>
									)
								)}
							</SelectGroup>
						</SelectViewport>
					</SelectContent>
				</SelectPortal>
			</Select>

			<div className="flex h-10 items-center text-lg font-semibold text-muted-foreground">
				:
			</div>

			{/* Выбор минут */}
			<Select value={selectedMinute} onValueChange={handleMinuteChange}>
				<SelectTrigger className="w-16">
					<SelectValue placeholder="ММ" />
				</SelectTrigger>
				<SelectPortal>
					<SelectContent
						className="min-w-[4rem] z-[60]"
						position="popper"
						sideOffset={4}
					>
						<SelectViewport>
							<SelectGroup>
								{minuteOptions.map(
									({ value: optionValue, label }) => (
										<SelectItem
											key={optionValue}
											value={optionValue}
										>
											<SelectItemText>
												{label}
											</SelectItemText>
										</SelectItem>
									)
								)}
							</SelectGroup>
						</SelectViewport>
					</SelectContent>
				</SelectPortal>
			</Select>
		</div>
	);
};
