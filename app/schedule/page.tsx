'use client';

import { AddBookingDrawer } from '@/components/add-booking-drawer';
import { AdminLayout } from '@/components/admin-layout';
import { BookingSlotDrawer } from '@/components/booking-slot-drawer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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
import { SPORT_TYPE_LABELS } from '@/constants';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store';
import { selectCourts } from '@/store/courtsManagment';
import { Court } from '@/types';
import { Booking } from '@/types/booking';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

const timeSlots = Array.from({ length: 30 }, (_, i) => {
	const totalMinutes = 8 * 60 + i * 30;
	const hour = Math.floor(totalMinutes / 60);
	const minute = totalMinutes % 60;
	return `${hour.toString().padStart(2, '0')}:${minute
		.toString()
		.padStart(2, '0')}`;
});

const allCourts = [
	{
		id: 1,
		name: 'Корт №1',
		type: 'open',
		sport: 'tennis',
		location: 'location1',
	},
	{
		id: 2,
		name: 'Корт №2',
		type: 'closed',
		sport: 'tennis',
		location: 'location1',
	},
	{
		id: 3,
		name: 'Корт №3',
		type: 'open',
		sport: 'padel',
		location: 'location1',
	},
	{
		id: 4,
		name: 'Корт №4',
		type: 'closed',
		sport: 'tennis',
		location: 'location2',
	},
	{
		id: 5,
		name: 'Корт №5',
		type: 'open',
		sport: 'padel',
		location: 'location2',
	},
	{
		id: 6,
		name: 'Корт №6',
		type: 'closed',
		sport: 'tennis',
		location: 'location1',
	},
	{
		id: 7,
		name: 'Корт №7',
		type: 'open',
		sport: 'tennis',
		location: 'location2',
	},
	{
		id: 8,
		name: 'Корт №8',
		type: 'closed',
		sport: 'padel',
		location: 'location2',
	},
];

// Mock bookings data
const mockBookings: any = {
	'2025-01-15': {
		1: [
			{
				time: '10:00',
				duration: 2,
				client: 'Иванов И.И.',
				email: 'ivanov@mail.ru',
				phone: '+7 (999) 123-45-67',
				status: 'confirmed',
				isRepeated: false,
			},
			{
				time: '14:00',
				duration: 4,
				client: 'Петров П.П.',
				email: 'petrov@mail.ru',
				phone: '+7 (999) 234-56-78',
				status: 'confirmed',
				isRepeated: false,
			},
		],
		2: [
			{
				time: '09:00',
				duration: 2,
				client: 'Сидоров С.С.',
				email: 'sidorov@mail.ru',
				phone: '+7 (999) 345-67-89',
				status: 'pending',
				isRepeated: false,
			},
			{
				time: '18:00',
				duration: 2,
				client: 'Смирнова А.А.',
				email: 'smirnova@mail.ru',
				phone: '+7 (999) 456-78-90',
				status: 'confirmed',
				isRepeated: false,
			},
		],
		3: [
			{
				time: '16:00',
				duration: 2,
				client: 'Козлов К.К.',
				email: 'kozlov@mail.ru',
				phone: '+7 (999) 567-89-01',
				status: 'confirmed',
				isRepeated: false,
			},
		],
	},
};

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
	const [courtRangeFrom, setCourtRangeFrom] = useState('1');
	const [courtRangeTo, setCourtRangeTo] = useState('8');
	const [addBookingDrawerOpen, setAddBookingDrawerOpen] = useState(false);
	const [selectedSlot, setSelectedSlot] = useState<any>(null);
	const [bookingSlotDrawerOpen, setBookingSlotDrawerOpen] = useState(false);
	const [newBookingSlot, setNewBookingSlot] = useState<any>(null);

	const filteredCourts = allCourts.filter((court) => {
		if (selectedLocation !== 'all' && court.street !== selectedLocation)
			return false;
		// if (selectedCourtType !== 'all' && court.isIndoor !== selectedCourtType)
		// 	return false;
		if (selectedSport !== 'all' && court.sportType !== selectedSport)
			return false;
		// if (
		// 	courtRangeFrom !== 'all' &&
		// 	court.id < Number.parseInt(courtRangeFrom)
		// )
		// 	return false;
		// if (courtRangeTo !== 'all' && court.id > Number.parseInt(courtRangeTo))
		// 	return false;
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
		[bookingsForShedule]
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
			});
			setBookingSlotDrawerOpen(true);
		} else {
			setNewBookingSlot({
				courtId: court.id,
				courtName: court.name,
				time,
				date: format(selectedDate, 'yyyy-MM-dd'),
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
					<div className="flex gap-3">
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

						<div className="flex items-center gap-2">
							<Select
								value={selectedLocation}
								onValueChange={setSelectedLocation}
							>
								<SelectTrigger className="text-sm">
									<SelectValue placeholder="Локация" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Адрес</SelectItem>
									<SelectItem value="location1">
										ул. Спортивная, 12
									</SelectItem>
									<SelectItem value="location2">
										пр. Ленина, 45
									</SelectItem>
								</SelectContent>
							</Select>

							<Select
								value={selectedCourtType}
								onValueChange={setSelectedCourtType}
							>
								<SelectTrigger className="text-sm">
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
								<SelectTrigger className="text-sm">
									<SelectValue placeholder="Вид спорта" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">
										Все виды
									</SelectItem>
									<SelectItem value="tennis">
										Теннис
									</SelectItem>
									<SelectItem value="padel">Падел</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex flex-1 justify-end gap-2">
							<div className="space-y-1">
								<Label className="text-xs text-muted-foreground">
									От корта
								</Label>
								<Select
									value={courtRangeFrom}
									onValueChange={setCourtRangeFrom}
								>
									<SelectTrigger className="text-sm h-9">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{allCourts.map((court) => (
											<SelectItem
												key={court.id}
												value={court.id.toString()}
											>
												Корт №{court.id}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1">
								<Label className="text-xs text-muted-foreground">
									До корта
								</Label>
								<Select
									value={courtRangeTo}
									onValueChange={setCourtRangeTo}
								>
									<SelectTrigger className="text-sm h-9">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{allCourts.map((court) => (
											<SelectItem
												key={court.id}
												value={court.id.toString()}
											>
												Корт №{court.id}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
				</Card>

				<Card className="overflow-hidden">
					<div className="overflow-x-auto">
						<div className="min-w-[800px]">
							<div className="flex border-b border-border bg-secondary">
								<div className="w-20 p-2 font-semibold text-sm text-primary sticky left-0 bg-secondary z-10">
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
											{SPORT_TYPE_LABELS[court.sportType]}
										</p>
									</div>
								))}
							</div>

							<div className="relative">
								{timeSlots.map((time, timeIndex) => (
									<div
										key={time}
										className="flex border-b border-border h-8"
									>
										<div className="w-20 p-2 text-xs font-medium text-muted-foreground sticky left-0 bg-card z-10 border-r border-border flex items-center">
											{time}
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
																'absolute inset-0 m-0.5 rounded px-2 flex items-center justify-center transition-colors cursor-pointer z-10',
																bookingInfo.status ===
																	'confirmed'
																	? 'bg-[#1E7A4C]/20 hover:bg-[#1E7A4C]/30 border border-[#1E7A4C]/40'
																	: bookingInfo.status ===
																	  'pending'
																	? 'bg-[#E6B800]/20 hover:bg-[#E6B800]/30 border border-[#E6B800]/40'
																	: 'bg-gray-400 hover:bg-gray-500'
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
								))}
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
