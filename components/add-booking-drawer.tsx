'use client';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAppDispatch, useAppSelector } from '@/store';
import { createBooking } from '@/store/bookingsManagment';
import { selectCourts } from '@/store/courtsManagment';
import { Booking, BookingStatus, ShortDays } from '@/types/booking';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

const SHORT_DAY_BY_INDEX: ShortDays[] = [
	'Sun',
	'Mon',
	'Tue',
	'Wed',
	'Thu',
	'Fri',
	'Sat',
];

const RU_TO_SHORT_DAY_MAP: Record<string, ShortDays> = {
	Пн: 'Mon',
	Вт: 'Tue',
	Ср: 'Wed',
	Чт: 'Thu',
	Пт: 'Fri',
	Сб: 'Sat',
	Вс: 'Sun',
};

// Format date as "YYYY-MM-DD" in local timezone (not UTC)
const formatDateToISO = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const timeStringToMinutes = (value: string) => {
	const [hours, minutes] = value.split(':').map(Number);
	return hours * 60 + minutes;
};

// Parse date string "YYYY-MM-DD" as local date to avoid timezone issues
const parseLocalDate = (dateStr: string): Date | null => {
	const parts = dateStr.split('-');
	if (parts.length !== 3) return null;
	const year = Number.parseInt(parts[0], 10);
	const month = Number.parseInt(parts[1], 10) - 1; // Month is 0-indexed
	const day = Number.parseInt(parts[2], 10);
	if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
		return null;
	}
	return new Date(year, month, day, 0, 0, 0, 0);
};

const calculateWeeksBetween = (startDate: string, endDate: string) => {
	const start = parseLocalDate(startDate);
	const end = parseLocalDate(endDate);

	if (
		!start ||
		!end ||
		Number.isNaN(start.getTime()) ||
		Number.isNaN(end.getTime())
	)
		return 1;

	if (end < start) return 1;

	const diffMs = end.getTime() - start.getTime();
	const weekMs = 7 * 24 * 60 * 60 * 1000;

	return Math.max(1, Math.ceil((diffMs + 1) / weekMs));
};

const generateRecurringDates = (
	startDate: string,
	endDate: string,
	selectedRuDays: string[],
	fallbackDate: string
) => {
	const start = parseLocalDate(startDate);
	const end = parseLocalDate(endDate);

	if (
		!start ||
		!end ||
		Number.isNaN(start.getTime()) ||
		Number.isNaN(end.getTime())
	) {
		return [fallbackDate];
	}

	const shortDays = selectedRuDays
		.map((day) => RU_TO_SHORT_DAY_MAP[day])
		.filter((day): day is ShortDays => Boolean(day));

	if (!shortDays.length) {
		return [formatDateToISO(start)];
	}

	const daySet = new Set<ShortDays>(shortDays);
	const current = new Date(start);
	const dates: string[] = [];

	while (current <= end) {
		const shortDay = SHORT_DAY_BY_INDEX[current.getDay()];
		if (daySet.has(shortDay)) {
			dates.push(formatDateToISO(current));
		}

		current.setDate(current.getDate() + 1);
	}

	return dates.length ? dates : [formatDateToISO(start)];
};

const isWeekendDate = (date: string) => {
	const parsed = parseLocalDate(date);
	if (!parsed || Number.isNaN(parsed.getTime())) return false;
	const day = parsed.getDay();
	return day === 0 || day === 6;
};

interface AddBookingDrawerProps {
	slot: { courtId: string; courtName: string; time: string; date: string };
	open: boolean;
	onClose: () => void;
}

export function AddBookingDrawer({
	slot,
	open,
	onClose,
}: AddBookingDrawerProps) {
	const dispatch = useAppDispatch();
	const courts = useAppSelector(selectCourts);
	const [clientInfo, setClientInfo] = useState({
		firstName: '',
		lastName: '',
		phone: '',
		email: '',
	});
	const [isRecurring, setIsRecurring] = useState(false);
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [startTime, setStartTime] = useState('10:00');
	const [endTime, setEndTime] = useState('11:00');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

	const handleCreateBooking = (booking: Booking) => {
		dispatch(createBooking(booking));
		onClose();
	};

	useEffect(() => {
		if (open) {
			document.body.classList.add('drawer-open');
			if (slot?.time) {
				setStartTime(slot.time);
				// Default to 1 hour duration
				const [hours, minutes] = slot.time.split(':');
				const endHour = (Number.parseInt(hours) + 1)
					.toString()
					.padStart(2, '0');
				setEndTime(`${endHour}:${minutes}`);
			}
			if (slot?.date) {
				setStartDate(slot.date);
			}
		} else {
			document.body.classList.remove('drawer-open');
			// Reset state when drawer closes
			setIsRecurring(false);
			setSelectedDays([]);
			setStartDate('');
			setEndDate('');
		}
		return () => {
			document.body.classList.remove('drawer-open');
		};
	}, [open, slot]);

	useEffect(() => {
		if (isRecurring && startDate && !selectedDays.length) {
			// Auto-select the day corresponding to start date
			const parsedDate = parseLocalDate(startDate);
			if (!parsedDate) return;
			const dayOfWeek = parsedDate.getDay();
			const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert Sunday=0 to index 6
			const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
			setSelectedDays([weekDays[dayIndex]]);
		}
	}, [isRecurring, startDate, selectedDays.length]);

	useEffect(() => {
		if (isRecurring && endDate && startDate) {
			// Auto-add end date's day if not already selected
			const parsedEndDate = parseLocalDate(endDate);
			if (!parsedEndDate) return;
			const endDayOfWeek = parsedEndDate.getDay();
			const endDayIndex = endDayOfWeek === 0 ? 6 : endDayOfWeek - 1;
			const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
			const endDay = weekDays[endDayIndex];

			if (!selectedDays.includes(endDay)) {
				setSelectedDays((prev) => [...prev, endDay]);
			}
		}
	}, [endDate, startDate, isRecurring, selectedDays]);

	const generateTimeOptions = () => {
		const options = [];
		for (let hour = 8; hour < 23; hour++) {
			options.push(`${hour.toString().padStart(2, '0')}:00`);
			options.push(`${hour.toString().padStart(2, '0')}:30`);
		}
		options.push('23:00');
		return options;
	};

	const calculateDuration = () => {
		if (!startTime || !endTime) return 0;
		const [startHour, startMin] = startTime.split(':').map(Number);
		const [endHour, endMin] = endTime.split(':').map(Number);
		const startMinutes = startHour * 60 + startMin;
		const endMinutes = endHour * 60 + endMin;
		const durationMinutes = endMinutes - startMinutes;
		return durationMinutes / 60;
	};

	const calculateTotalBookings = () => {
		if (!isRecurring || !startDate || !endDate || selectedDays.length === 0)
			return 0;

		const start = parseLocalDate(startDate);
		const end = parseLocalDate(endDate);
		if (!start || !end) return 0;

		const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

		let count = 0;
		const current = new Date(start);

		while (current <= end) {
			const dayOfWeek = current.getDay();
			const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
			const dayName = weekDays[dayIndex];

			if (selectedDays.includes(dayName)) {
				count++;
			}

			current.setDate(current.getDate() + 1);
		}

		return count;
	};

	const getAllowedDays = () => {
		if (!startDate || !endDate)
			return ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

		const start = parseLocalDate(startDate);
		const end = parseLocalDate(endDate);
		if (!start || !end) return ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

		const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
		const allowedDays = new Set<string>();

		const current = new Date(start);
		while (current <= end) {
			const dayOfWeek = current.getDay();
			const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
			allowedDays.add(weekDays[dayIndex]);
			current.setDate(current.getDate() + 1);
		}

		return Array.from(allowedDays);
	};

	const duration = calculateDuration();
	const isValidDuration = duration >= 1;
	const totalBookings = calculateTotalBookings();
	const allowedDays = getAllowedDays();

	if (!slot) return null;

	const selectedCourt = courts.find((court) => court.id === slot.courtId);
	const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

	const toggleDay = (day: string) => {
		if (!allowedDays.includes(day)) return;
		setSelectedDays((prev) =>
			prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
		);
	};

	return (
		<>
			{/* Backdrop */}
			{open && (
				<div
					className="fixed inset-0 bg-black/50 z-40 transition-opacity"
					onClick={onClose}
				/>
			)}

			{/* Drawer */}
			<div
				className={`fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl z-50 transition-transform duration-300 ${
					open ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				<div className="flex flex-col h-full">
					{/* Header - Reduced padding */}
					<div className="flex items-center justify-between p-4 border-b border-border">
						<h2 className="text-lg font-bold text-primary">
							Добавить бронирование
						</h2>
						<button
							onClick={onClose}
							className="p-2 hover:bg-muted rounded-lg transition-colors"
						>
							<X className="h-5 w-5 text-muted-foreground" />
						</button>
					</div>

					{/* Content - Reduced spacing */}
					<div className="flex-1 overflow-y-auto p-4 space-y-4">
						{/* Pre-filled info */}
						<div className="p-3 bg-accent/5 rounded-lg border border-accent/20 space-y-2">
							<div className="flex items-center gap-2 text-sm">
								<MapPin className="h-4 w-4 text-accent" />
								<span className="font-medium text-foreground">
									{slot.courtName}
								</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<Calendar className="h-4 w-4 text-accent" />
								<span className="text-foreground">
									{new Date(slot.date).toLocaleDateString(
										'ru-RU'
									)}
								</span>
							</div>
						</div>

						{/* Client Information */}
						<div className="space-y-3">
							<h3 className="text-sm font-semibold text-primary">
								Информация о клиенте
							</h3>

							<div className="space-y-2">
								<Label htmlFor="firstName" className="text-sm">
									Имя
								</Label>
								<Input
									id="firstName"
									value={clientInfo.firstName}
									onChange={(event) =>
										setClientInfo((prev) => ({
											...prev,
											firstName: event.target.value,
										}))
									}
									placeholder="Введите имя"
									className="h-9"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="lastName" className="text-sm">
									Фамилия
								</Label>
								<Input
									id="lastName"
									value={clientInfo.lastName}
									onChange={(event) =>
										setClientInfo((prev) => ({
											...prev,
											lastName: event.target.value,
										}))
									}
									placeholder="Введите фамилию"
									className="h-9"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="phone" className="text-sm">
									Телефон
								</Label>
								<Input
									id="phone"
									type="tel"
									value={clientInfo.phone}
									onChange={(event) =>
										setClientInfo((prev) => ({
											...prev,
											phone: event.target.value,
										}))
									}
									placeholder="+7 (999) 123-45-67"
									className="h-9"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email" className="text-sm">
									Email
								</Label>
								<Input
									id="email"
									type="email"
									value={clientInfo.email}
									onChange={(event) =>
										setClientInfo((prev) => ({
											...prev,
											email: event.target.value,
										}))
									}
									placeholder="example@mail.ru"
									className="h-9"
								/>
							</div>
						</div>

						{/* Booking Details - Added editable time fields */}
						<div className="space-y-3">
							<h3 className="text-sm font-semibold text-primary">
								Детали бронирования
							</h3>

							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-2">
									<Label
										htmlFor="startTime"
										className="text-sm"
									>
										Начало
									</Label>
									<Select
										value={startTime}
										onValueChange={setStartTime}
									>
										<SelectTrigger
											id="startTime"
											className="h-9"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{generateTimeOptions().map(
												(time) => (
													<SelectItem
														key={time}
														value={time}
													>
														{time}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="endTime"
										className="text-sm"
									>
										Конец
									</Label>
									<Select
										value={endTime}
										onValueChange={setEndTime}
									>
										<SelectTrigger
											id="endTime"
											className="h-9"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{generateTimeOptions().map(
												(time) => (
													<SelectItem
														key={time}
														value={time}
													>
														{time}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Duration display and validation */}
							<div className="flex items-center gap-2 text-sm">
								<Clock className="h-4 w-4 text-muted-foreground" />
								<span
									className={cn(
										'text-foreground',
										!isValidDuration && 'text-destructive'
									)}
								>
									Длительность: {duration.toFixed(1)} ч
								</span>
							</div>
							{!isValidDuration && (
								<p className="text-xs text-destructive">
									Минимальная длительность: 1 час
								</p>
							)}
						</div>

						{/* Recurring Booking */}
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<label
									htmlFor="recurring"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
								>
									Повторяющееся бронирование
								</label>
								<Switch
									id="recurring"
									checked={isRecurring}
									onCheckedChange={setIsRecurring}
								/>
							</div>

							{isRecurring && (
								<div className="space-y-3 p-3 bg-muted/50 rounded-lg">
									<div className="space-y-2">
										<Label
											htmlFor="startDate"
											className="text-sm"
										>
											Дата начала
										</Label>
										<Input
											id="startDate"
											type="date"
											value={startDate}
											onChange={(e) =>
												setStartDate(e.target.value)
											}
											className="h-9"
										/>
									</div>

									<div className="space-y-2">
										<Label
											htmlFor="endDate"
											className="text-sm"
										>
											Дата окончания
										</Label>
										<Input
											id="endDate"
											type="date"
											value={endDate}
											onChange={(e) =>
												setEndDate(e.target.value)
											}
											className="h-9"
										/>
									</div>

									<div className="space-y-2">
										<Label className="text-sm">
											Дни недели
										</Label>
										<div className="flex flex-wrap gap-2">
											{weekDays.map((day) => {
												const isAllowed =
													allowedDays.includes(day);
												const isSelected =
													selectedDays.includes(day);

												return (
													<button
														key={day}
														type="button"
														onClick={() =>
															toggleDay(day)
														}
														disabled={!isAllowed}
														className={cn(
															'px-3 py-1 text-sm rounded-lg border transition-colors',
															isSelected &&
																isAllowed &&
																'bg-accent text-accent-foreground border-accent',
															!isSelected &&
																isAllowed &&
																'bg-card text-foreground border-border hover:bg-muted',
															!isAllowed &&
																'bg-muted/50 text-muted-foreground border-border cursor-not-allowed opacity-50'
														)}
													>
														{day}
													</button>
												);
											})}
										</div>
										{startDate && endDate && (
											<p className="text-xs text-muted-foreground mt-2">
												Доступны только дни между датой
												начала и окончания
											</p>
										)}
									</div>

									{totalBookings > 0 && (
										<div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
											<p className="text-sm font-medium text-foreground">
												Итого занятий:{' '}
												<span className="text-accent">
													{totalBookings}
												</span>
											</p>
										</div>
									)}
								</div>
							)}
						</div>
					</div>

					{/* Footer Actions - Reduced padding */}
					<div className="p-4 border-t border-border space-y-2">
						<Button
							className="w-full bg-[#1E7A4C] hover:bg-[#1E7A4C]/90 text-white"
							onClick={() => setConfirmDialogOpen(true)}
							disabled={!isValidDuration}
						>
							Создать бронирование
						</Button>
						<Button
							variant="outline"
							className="w-full bg-transparent"
							onClick={() => {
								setCancelDialogOpen(true);
							}}
						>
							Отмена
						</Button>
					</div>
				</div>
			</div>

			{/* Add Dialog */}
			<Dialog
				open={confirmDialogOpen}
				onOpenChange={setConfirmDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Добавить бронирование?</DialogTitle>
						<DialogDescription>
							Вы уверены, что хотите добавить это бронирование?
							Клиент получит уведомление.
						</DialogDescription>
					</DialogHeader>
					<div className="flex gap-3 justify-end mt-4">
						<Button
							variant="outline"
							onClick={() => setConfirmDialogOpen(false)}
						>
							Отмена
						</Button>
						<Button
							className="bg-[#1E7A4C] hover:bg-[#1E7A4C]/90 text-white"
							onClick={() => {
								const fallbackDate = startDate || slot.date;
								const bookingDates = isRecurring
									? generateRecurringDates(
											startDate || slot.date,
											endDate || startDate || slot.date,
											selectedDays,
											fallbackDate
									  )
									: fallbackDate
									? [fallbackDate]
									: [];

								const durationHours = duration;

								const baseDateForPrice =
									bookingDates[0] || slot.date;

								const pricePerHour = (() => {
									if (!selectedCourt || !baseDateForPrice)
										return 0;

									const dayGroup = isWeekendDate(
										baseDateForPrice
									)
										? 'weekends'
										: 'weekdays';
									const priceSlots =
										selectedCourt.prices?.[dayGroup] ?? [];

									const startMinutes =
										timeStringToMinutes(startTime);

									const matchedSlot = priceSlots.find(
										({ from, to }) => {
											const fromMinutes =
												timeStringToMinutes(from);
											const toMinutes =
												timeStringToMinutes(to);

											return (
												startMinutes >= fromMinutes &&
												startMinutes < toMinutes
											);
										}
									);

									return matchedSlot?.price ?? 0;
								})();

								const price = Math.round(
									durationHours * pricePerHour
								);

								let currentBooking: Booking = {
									id: crypto.randomUUID(),
									firstName: clientInfo.firstName,
									lastName: clientInfo.lastName,
									phone: clientInfo.phone,
									email: clientInfo.email,
									courtId: slot.courtId,
									date: bookingDates,
									time: startTime + '-' + endTime,
									duration: durationHours,
									price,
									status: 'pending-payment' as BookingStatus,
									isRecurring,
								};

								if (isRecurring) {
									const recurringStart =
										startDate || bookingDates[0] || '';
									const recurringEnd =
										endDate ||
										bookingDates[bookingDates.length - 1] ||
										recurringStart;
									const recurringDays = selectedDays
										.map((day) => RU_TO_SHORT_DAY_MAP[day])
										.filter((day): day is ShortDays =>
											Boolean(day)
										);

									currentBooking = {
										...currentBooking,
										recurringDetails: {
											startDate: recurringStart,
											endDate: recurringEnd,
											weeks: calculateWeeksBetween(
												recurringStart,
												recurringEnd
											),
											days: recurringDays,
										},
									};
								}

								handleCreateBooking(currentBooking);
								setConfirmDialogOpen(false);
								onClose();
							}}
						>
							Добавить
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Cancel Dialog */}
			<Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							Отменить добавление бронирования?
						</DialogTitle>
						<DialogDescription>
							Если вы отмените, все введённые данные будут
							потеряны. Вы уверены, что хотите прервать
							заполнение?
						</DialogDescription>
					</DialogHeader>
					<div className="flex gap-3 justify-end mt-4">
						<Button
							variant="outline"
							onClick={() => setCancelDialogOpen(false)}
						>
							Продолжить заполнение
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								setCancelDialogOpen(false);
								onClose();
							}}
						>
							Отменить добавление
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
