'use client';

import { AddBookingDrawer } from '@/components/add-booking-drawer';
import { AdminLayout } from '@/components/admin-layout';
import { BookingSlotDrawer } from '@/components/booking-slot-drawer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { MultiSelectWithAll } from '@/components/ui/multi-select-with-all';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { COVER_TYPE_LABELS, SPORT_TYPE_LABELS } from '@/constants';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store';
import { selectCourts } from '@/store/courtsManagment';
import { Court, CoverType, SportType } from '@/types';
import { Booking } from '@/types/booking';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

const timeSlots = Array.from({ length: 30 }, (_, i) => {
	const totalMinutes = 8 * 60 + i * 30;
	const hour = Math.floor(totalMinutes / 60);
	const minute = totalMinutes % 60;

	const startTime = `${hour.toString().padStart(2, '0')}:${minute
		.toString()
		.padStart(2, '0')}`;

	const endTotalMinutes = totalMinutes + 30;
	const endHour = Math.floor(endTotalMinutes / 60);
	const endMinute = endTotalMinutes % 60;
	const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute
		.toString()
		.padStart(2, '0')}`;

	return { display: `${startTime} - ${endTime}`, value: startTime };
});

export default function SchedulePage() {
	const allCourts = useAppSelector(selectCourts);
	const bookings = useAppSelector(
		(state) => state.bookingsManagment.bookings
	);

	const bookingsForShedule = useMemo(
		() =>
			bookings.reduce<Record<string, Record<string, Booking[]>>>(
				(acc, booking) => {
					booking.date.forEach((date) => {
						if (!acc[date]) {
							acc[date] = {};
						}
						if (!acc[date][booking.courtId]) {
							acc[date][booking.courtId] = [];
						}
						acc[date][booking.courtId].push(booking);
					});
					return acc;
				},
				{}
			),
		[bookings]
	);

	const [selectedDate, setSelectedDate] = useState<Date>(
		new Date('2025-11-22')
	);
	const [selectedLocation, setSelectedLocation] = useState('all');
	const [selectedCourtType, setSelectedCourtType] = useState('all');
	const [selectedSport, setSelectedSport] = useState('all');
	const [selectedCoverType, setSelectedCoverType] = useState('all');
	const [selectedCourts, setSelectedCourts] = useState<string[]>(
		allCourts.map((court) => court.id)
	);
	const [addBookingDrawerOpen, setAddBookingDrawerOpen] = useState(false);
	const [selectedSlot, setSelectedSlot] = useState<any>(null);
	const [bookingSlotDrawerOpen, setBookingSlotDrawerOpen] = useState(false);
	const [newBookingSlot, setNewBookingSlot] = useState<any>(null);

	const filteredCourts = allCourts.filter((court) => {
		if (selectedLocation !== 'all' && court.street !== selectedLocation)
			return false;
		if (
			selectedCourtType !== 'all' &&
			court.isIndoor !== (selectedCourtType === 'open' ? true : false)
		)
			return false;
		if (selectedSport !== 'all' && court.sportType !== selectedSport)
			return false;
		if (
			selectedCoverType !== 'all' &&
			court.coverType !== selectedCoverType
		)
			return false;
		if (selectedCourts.length > 0 && !selectedCourts.includes(court.id))
			return false;
		return true;
	});

	const getBookingForSlot = useCallback(
		(courtId: string, time: string) => {
			const dateStr = format(selectedDate, 'yyyy-MM-dd');
			const bookings = bookingsForShedule[dateStr]?.[courtId] || [];

			for (const booking of bookings) {
				if (booking.status === 'rejected') continue;
				const bookingStartTime = booking.time.split('-')[0];

				const bookingStartMinutes =
					Number.parseInt(bookingStartTime.split(':')[0]) * 60 +
					Number.parseInt(bookingStartTime.split(':')[1]);
				const slotMinutes =
					Number.parseInt(time.split(':')[0]) * 60 +
					Number.parseInt(time.split(':')[1]);
				const bookingEndMinutes =
					bookingStartMinutes + booking.duration * 60;

				if (
					slotMinutes >= bookingStartMinutes &&
					slotMinutes < bookingEndMinutes
				) {
					return {
						...booking,
						isStart: slotMinutes === bookingStartMinutes,
						slotCount: (booking.duration * 60) / 30,
					};
				}
			}

			return null;
		},
		[selectedDate, bookingsForShedule]
	);

	const changeDate = (days: number) => {
		const date = new Date(selectedDate);
		date.setDate(date.getDate() + days);
		setSelectedDate(date);
	};

	const handleSlotClick = (courtId: string, time: string, court: Court) => {
		const bookingInfo = getBookingForSlot(courtId, time);
		if (bookingInfo) {
			const startMinutes =
				Number.parseInt(bookingInfo.time.split(':')[0]) * 60 +
				Number.parseInt(bookingInfo.time.split(':')[1]);
			const endMinutes = startMinutes + bookingInfo.duration * 60;
			const endHour = Math.floor(endMinutes / 60);
			const endMinute = endMinutes % 60;
			const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute
				.toString()
				.padStart(2, '0')}`;

			// Определяем, выходной день или будний
			const dayOfWeek = selectedDate.getDay();
			const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 = воскресенье, 6 = суббота
			const dayGroup = isWeekend ? 'weekends' : 'weekdays';
			const priceSlots = court.prices[dayGroup] || [];

			// Находим подходящий ценовой слот по времени
			const timeToMinutes = (timeStr: string) => {
				const [hours, minutes] = timeStr.split(':').map(Number);
				return hours * 60 + minutes;
			};

			const timeMinutes = timeToMinutes(time);
			const matchedSlot = priceSlots.find((slot) => {
				const fromMinutes = timeToMinutes(slot.from);
				const toMinutes = timeToMinutes(slot.to);
				return timeMinutes >= fromMinutes && timeMinutes < toMinutes;
			});

			setSelectedSlot({
				...bookingInfo,
				courtName: court.name,
				coverType: court.coverType,
				sportType: court.sportType,
				isIndoor: court.isIndoor,
				street: court.street,
				time: bookingInfo.time,
				endTime,
				courtId: court.id,
				currentDate: selectedDate,
				pricePerSession: matchedSlot?.price ?? 0,
			});
			setBookingSlotDrawerOpen(true);
		} else {
			// Определяем, выходной день или будний
			const dayOfWeek = selectedDate.getDay();
			const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 = воскресенье, 6 = суббота
			const dayGroup = isWeekend ? 'weekends' : 'weekdays';
			const priceSlots = court.prices[dayGroup] || [];

			// Находим подходящий ценовой слот по времени
			const timeToMinutes = (timeStr: string) => {
				const [hours, minutes] = timeStr.split(':').map(Number);
				return hours * 60 + minutes;
			};

			const timeMinutes = timeToMinutes(time);
			const matchedSlot = priceSlots.find((slot) => {
				const fromMinutes = timeToMinutes(slot.from);
				const toMinutes = timeToMinutes(slot.to);
				return timeMinutes >= fromMinutes && timeMinutes < toMinutes;
			});

			setNewBookingSlot({
				courtId: court.id,
				courtName: court.name,
				coverType: court.coverType,
				sportType: court.sportType,
				isIndoor: court.isIndoor,
				street: court.street,
				time,
				date: format(selectedDate, 'yyyy-MM-dd'),
				pricePerSession: matchedSlot?.price ?? 0,
			});
			setAddBookingDrawerOpen(true);
		}
	};

	return (
		<AdminLayout>
			<div className="space-y-4">
				<div>
					<p className="text-xl font-bold text-primary mt-1">
						Управление расписанием и бронированием кортов
					</p>
				</div>

				<Card className="p-3">
					<div className="flex gap-3 items-center">
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="icon"
								onClick={() => changeDate(-1)}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											'group w-fit justify-start text-left font-normal',
											!selectedDate &&
												'text-muted-foreground'
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4 text-accent transition-colors group-hover:text-primary" />
										{selectedDate ? (
											format(selectedDate, 'PPP', {
												locale: ru,
											})
										) : (
											<span>Выберите дату</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-auto p-0"
									align="center"
								>
									<Calendar
										mode="single"
										selected={selectedDate}
										onSelect={(date) =>
											date && setSelectedDate(date)
										}
										initialFocus
										locale={ru}
									/>
								</PopoverContent>
							</Popover>
							<Button
								variant="outline"
								size="icon"
								onClick={() => changeDate(1)}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>

						<div className=" min-w-[250px]">
							<MultiSelectWithAll
								defaultToAll
								options={allCourts.map((court) => ({
									label: court.name,
									value: court.id,
								}))}
								selected={selectedCourts}
								onChange={setSelectedCourts}
								placeholder="Все корты"
								className="w-[200px] h-9"
							/>
							{/* <MultiSelect
								options={allCourts.map((court) => ({
									label: court.name,
									value: court.id,
								}))}
								selected={selectedCourts}
								onChange={setSelectedCourts}
								placeholder="Все корты"
								className="h-9"
							/> */}
						</div>

						<div className="flex flex-1 items-center justify-end">
							<div className="grid grid-cols-2 gap-y-2 gap-x-7 w-fit">
								<Select
									value={selectedLocation}
									onValueChange={setSelectedLocation}
								>
									<SelectTrigger className="text-sm w-[180px]">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											Все адреса
										</SelectItem>
										{allCourts.map((court, index) => (
											<SelectItem
												key={`location${index}`}
												value={court.street}
											>
												{court.street}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Select
									value={selectedCourtType}
									onValueChange={setSelectedCourtType}
								>
									<SelectTrigger className="text-sm w-[180px]">
										<SelectValue placeholder="Тип корта" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											Все типы
										</SelectItem>
										<SelectItem value="open">
											Открытые
										</SelectItem>
										<SelectItem value="closed">
											Закрытые
										</SelectItem>
									</SelectContent>
								</Select>

								<Select
									value={selectedSport}
									onValueChange={setSelectedSport}
								>
									<SelectTrigger className="text-sm w-[180px]">
										<SelectValue placeholder="Вид спорта" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											Все виды спорта
										</SelectItem>
										{Object.keys(SPORT_TYPE_LABELS).map(
											(sportType) => (
												<SelectItem value={sportType}>
													{
														SPORT_TYPE_LABELS[
															sportType as SportType
														]
													}
												</SelectItem>
											)
										)}
									</SelectContent>
								</Select>

								<Select
									value={selectedCoverType}
									onValueChange={setSelectedCoverType}
								>
									<SelectTrigger className="text-sm w-[180px]">
										<SelectValue placeholder="Тип повехности" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											Все поверхности
										</SelectItem>
										{Object.keys(COVER_TYPE_LABELS).map(
											(coverType) => (
												<SelectItem value={coverType}>
													{
														COVER_TYPE_LABELS[
															coverType as CoverType
														]
													}
												</SelectItem>
											)
										)}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
				</Card>

				<Card className="overflow-hidden">
					<div className="overflow-x-auto overflow-y-hidden">
						<div className="min-w-[800px]">
							<div className="flex border-b border-border bg-secondary">
								<div className="w-22 p-2 font-semibold text-sm text-primary sticky left-0 bg-secondary z-10">
									Время
								</div>
								{filteredCourts.map((court) => (
									<div
										key={court.id}
										className="flex-1 p-2 text-center border-l border-border min-w-[120px]"
									>
										<p className="font-semibold text-sm text-primary">
											{court.name}
										</p>
										<p className="text-xs text-muted-foreground mt-0.5">
											{court.isIndoor
												? 'Открытый'
												: 'Закрытый'}{' '}
											•{' '}
											{SPORT_TYPE_LABELS[court.sportType]}{' '}
											•{' '}
											{COVER_TYPE_LABELS[court.coverType]}
										</p>
									</div>
								))}
							</div>

							<div className="relative">
								{timeSlots.map((timeSlot, timeIndex) => {
									const time = timeSlot.value;

									return (
										<div
											key={time}
											className="flex border-b border-border h-8"
										>
											<div className="w-22 px-2 py-1 text-xs font-medium text-muted-foreground sticky left-0 bg-card z-10 border-r border-border flex items-center font-mono tabular-nums">
												{timeSlot.display}
											</div>

											{filteredCourts.map((court) => {
												const bookingInfo =
													getBookingForSlot(
														court.id,
														time
													);

												return (
													<div
														key={`${court.id}-${time}`}
														className="flex-1 border-l border-border min-w-[120px] relative"
													>
														{bookingInfo &&
														bookingInfo.isStart ? (
															<div
																className={cn(
																	'absolute inset-0 rounded px-2 flex items-center justify-center transition-colors cursor-pointer z-10',
																	bookingInfo.status ===
																		'confirmed'
																		? 'bg-[#1E7A4C]/40 hover:bg-[#1E7A4C]/50 border-2 border-[#1E7A4C]/60'
																		: bookingInfo.status ===
																		  'pending'
																		? 'bg-[#E6B800]/40 hover:bg-[#E6B800]/50 border-2 border-[#E6B800]/60'
																		: 'bg-gray-500 hover:bg-gray-500/85'
																)}
																style={{
																	height: `${
																		bookingInfo.slotCount *
																			32 -
																		1
																	}px`,
																}}
																onClick={() =>
																	handleSlotClick(
																		court.id,
																		time,
																		court
																	)
																}
															>
																<p className="text-xs font-medium text-foreground truncate">
																	{bookingInfo.lastName +
																		' ' +
																		bookingInfo
																			.firstName[0] +
																		'.'}
																</p>
															</div>
														) : !bookingInfo ? (
															<div
																className="h-full cursor-pointer"
																onClick={() =>
																	handleSlotClick(
																		court.id,
																		time,
																		court
																	)
																}
															>
																<div className="h-full m-0.5 rounded hover:bg-accent/10 transition-colors" />
															</div>
														) : null}
													</div>
												);
											})}
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</Card>
			</div>

			<AddBookingDrawer
				slot={newBookingSlot}
				open={addBookingDrawerOpen}
				onClose={() => {
					setAddBookingDrawerOpen(false);
					setNewBookingSlot(null);
				}}
			/>

			<BookingSlotDrawer
				booking={selectedSlot}
				open={bookingSlotDrawerOpen}
				onClose={() => {
					setBookingSlotDrawerOpen(false);
					setSelectedSlot(null);
				}}
			/>
		</AdminLayout>
	);
}
