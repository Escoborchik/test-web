'use client';

import type React from 'react';

import { AdminLayout } from '@/components/admin-layout';
import { BookingDetailsDrawer } from '@/components/booking-details-drawer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/store';
import { Booking } from '@/types/booking';
import { Check, ChevronLeft, ChevronRight, Repeat, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { updateStatusBooking } from '@/store/bookingsManagment';
import { selectCourts } from '@/store/courtsManagment';

// Mock data
// const pendingBookings = [
// 	{
// 		id: 1,
// 		firstName: 'Иван',
// 		lastName: 'Иванов',
// 		phone: '+7 (999) 123-45-67',
// 		email: 'ivanov@mail.ru',
// 		court: 'Корт №1',
// 		date: '2025-01-15',
// 		time: '10:00 - 11:00',
// 		price: 2000,
// 		status: 'pending',
// 		isRecurring: false,
// 	},
// 	{
// 		id: 2,
// 		firstName: 'Петр',
// 		lastName: 'Петров',
// 		phone: '+7 (999) 234-56-78',
// 		email: 'petrov@mail.ru',
// 		court: 'Корт №2',
// 		date: '2025-01-16',
// 		time: '14:00 - 15:00',
// 		price: 2500,
// 		status: 'pending',
// 		isRecurring: true,
// 		recurringDetails: {
// 			startDate: '2025-01-16',
// 			endDate: '2025-03-16',
// 			weeks: 8,
// 			days: ['Пн', 'Ср', 'Пт'],
// 		},
// 	},
// 	{
// 		id: 3,
// 		firstName: 'Сидор',
// 		lastName: 'Сидоров',
// 		phone: '+7 (999) 345-67-89',
// 		email: 'sidorov@mail.ru',
// 		court: 'Корт №1',
// 		date: '2025-01-17',
// 		time: '18:00 - 19:00',
// 		price: 3000,
// 		status: 'pending',
// 		isRecurring: false,
// 	},
// ];

// const confirmedBookings = [
// 	{
// 		id: 4,
// 		firstName: 'Анна',
// 		lastName: 'Смирнова',
// 		phone: '+7 (999) 456-78-90',
// 		email: 'smirnova@mail.ru',
// 		court: 'Корт №3',
// 		date: '2025-01-14',
// 		time: '16:00 - 17:00',
// 		price: 2500,
// 		status: 'confirmed',
// 		isRecurring: false,
// 	},
// ];

export default function BookingsPage() {
	const dispatch = useAppDispatch();
	const bookings = useAppSelector(
		(state) => state.bookingsManagment.bookings
	);
	const courts = useAppSelector(selectCourts);
	// const [selectedDate, setSelectedDate] = useState<Date | undefined>();
	const [selectedCourtId, setSelectedCourtId] = useState<string>('all');
	const [showOnlyRecurring, setShowOnlyRecurring] = useState(false);

	const filteredBookings = useMemo(() => {
		return bookings.filter((booking) => {
			const matchesCourt =
				selectedCourtId === 'all' ||
				booking.courtId === selectedCourtId;

			const matchesRecurring = !showOnlyRecurring || booking.isRecurring;

			return matchesCourt && matchesRecurring;
		});
	}, [bookings, selectedCourtId, showOnlyRecurring]);

	const pendingBookings = useMemo(
		() =>
			filteredBookings.filter((booking) => booking.status === 'pending'),
		[filteredBookings]
	);

	const confirmedBookings = useMemo(
		() =>
			filteredBookings.filter(
				(booking) => booking.status === 'confirmed'
			),
		[filteredBookings]
	);

	const [selectedBooking, setSelectedBooking] = useState<any>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('pending');
	const [currentPage, setCurrentPage] = useState(1);
	const [confirmModalOpen, setConfirmModalOpen] = useState(false);
	const [rejectModalOpen, setRejectModalOpen] = useState(false);
	const [actionBooking, setActionBooking] = useState<any>(null);
	const itemsPerPage = 10;

	const handleBookingClick = (booking: Booking & { courtName: string }) => {
		setSelectedBooking(booking);
		setDrawerOpen(true);
	};

	const handleConfirmClick = (booking: Booking, e: React.MouseEvent) => {
		e.stopPropagation();
		setActionBooking(booking);
		setConfirmModalOpen(true);
	};

	const handleRejectClick = (booking: any, e: React.MouseEvent) => {
		e.stopPropagation();
		setActionBooking(booking);
		setRejectModalOpen(true);
	};

	const confirmBooking = () => {
		dispatch(
			updateStatusBooking({ id: actionBooking.id, status: 'confirmed' })
		);
		setConfirmModalOpen(false);
		setActionBooking(null);
	};

	const rejectBooking = () => {
		dispatch(
			updateStatusBooking({ id: actionBooking.id, status: 'rejected' })
		);
		setRejectModalOpen(false);
		setActionBooking(null);
	};

	return (
		<AdminLayout>
			<div className="space-y-4">
				<div>
					<p className="text-xl font-bold text-primary mt-1">
						Управление заявками на бронирование кортов
					</p>
				</div>

				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="bg-card border border-border">
						<TabsTrigger
							value="pending"
							className="data-[state=active]:bg-white"
						>
							Ожидающие
							<Badge
								variant="secondary"
								className="ml-2 bg-[#E6B800]/10 text-[#E6B800] border-[#E6B800]/20"
							>
								{pendingBookings.length}
							</Badge>
						</TabsTrigger>
						<TabsTrigger
							value="confirmed"
							className="data-[state=active]:bg-white"
						>
							Подтверждённые
						</TabsTrigger>
					</TabsList>

					<Card className="mt-4 p-3 w-fit">
						<div className="flex flex-col sm:flex-row gap-3">
							{/* <div>
								<label className="text-sm font-medium text-foreground mb-1 block">
									Дата
								</label>
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
							</div> */}

							<div>
								<label className="text-sm font-medium text-foreground mb-1 block">
									Корт
								</label>
								<Select
									value={selectedCourtId}
									onValueChange={setSelectedCourtId}
								>
									<SelectTrigger className="h-9 w-[180px]">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											Все корты
										</SelectItem>
										{courts.map((court) => (
											<SelectItem
												key={court.id}
												value={court.id}
											>
												{court.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div>
								<label className="text-sm font-medium text-foreground mb-1 block">
									Тип брони
								</label>
								<Select
									defaultValue="one-time"
									onValueChange={(value) =>
										value === 'one-time'
											? setShowOnlyRecurring(false)
											: setShowOnlyRecurring(true)
									}
								>
									<SelectTrigger className="h-9 w-[180px]">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="one-time">
											Разовое
										</SelectItem>
										<SelectItem value="repeat">
											Повторяющееся
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</Card>

					<TabsContent value="pending" className="mt-4 space-y-4">
						<Card>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b border-border bg-secondary">
											<th className="text-left p-3 text-sm font-semibold text-primary">
												ФИО
											</th>
											<th className="text-left p-3 text-sm font-semibold text-primary">
												Телефон
											</th>
											<th className="text-left p-3 text-sm font-semibold text-primary">
												Email
											</th>
											<th className="text-left p-3 text-sm font-semibold text-primary">
												Корт
											</th>
											<th className="text-left p-3 text-sm font-semibold text-primary">
												Дата
											</th>
											<th className="text-left p-3 text-sm font-semibold text-primary">
												Время
											</th>
											<th className="text-left p-3 text-sm font-semibold text-primary">
												Цена
											</th>
											<th className="text-left p-3 text-sm font-semibold text-primary">
												Действия
											</th>
										</tr>
									</thead>
									<tbody>
										{pendingBookings.map((booking) => {
											const court =
												courts.find(
													(item) =>
														item.id ===
														booking.courtId
												) ?? null;

											return (
												<tr
													key={booking.id}
													className="border-b border-border hover:bg-secondary/50 cursor-pointer transition-colors"
													onClick={() =>
														handleBookingClick({
															...booking,
															courtName:
																court!.name,
														})
													}
												>
													<td className="p-3">
														<div className="flex items-center gap-2">
															<div>
																<p className="text-sm font-medium text-foreground">
																	{
																		booking.firstName
																	}{' '}
																	{
																		booking.lastName
																	}
																</p>
																{booking.isRecurring && (
																	<Badge className="mt-1 text-xs bg-accent text-accent-foreground font-semibold">
																		Повторяющееся
																	</Badge>
																)}
															</div>
														</div>
													</td>
													<td className="p-3 text-sm text-foreground">
														{booking.phone}
													</td>
													<td className="p-3 text-sm text-foreground">
														{booking.email}
													</td>
													<td className="p-3 text-sm text-foreground">
														{court?.name}
													</td>
													<td className="p-3 text-sm text-foreground">
														{new Date(
															booking.date[0]
														).toLocaleDateString(
															'ru-RU'
														)}
													</td>
													<td className="p-3 text-sm text-foreground">
														{booking.time}
													</td>
													<td className="p-3 text-sm font-medium text-foreground">
														{booking.price} ₽
													</td>
													<td className="p-3">
														<div className="flex gap-2">
															<Button
																size="sm"
																className="bg-[#1E7A4C] hover:bg-[#1E7A4C]/90 text-white h-8"
																onClick={(e) =>
																	handleConfirmClick(
																		booking,
																		e
																	)
																}
															>
																<Check className="h-4 w-4" />
															</Button>
															<Button
																size="sm"
																variant="destructive"
																className="h-8"
																onClick={(e) =>
																	handleRejectClick(
																		booking,
																		e
																	)
																}
															>
																<X className="h-4 w-4" />
															</Button>
														</div>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>

							<div className="flex items-center justify-between p-3 border-t border-border">
								<p className="text-sm text-muted-foreground">
									Показано 1-
									{Math.min(
										itemsPerPage,
										pendingBookings.length
									)}{' '}
									из {pendingBookings.length}
								</p>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										disabled={currentPage === 1}
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>
									<Button variant="outline" size="sm">
										1
									</Button>
									<Button
										variant="outline"
										size="sm"
										disabled={
											currentPage * itemsPerPage >=
											pendingBookings.length
										}
									>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</Card>
					</TabsContent>

					<TabsContent value="confirmed" className="mt-4 space-y-4">
						<Card>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b border-border bg-secondary">
											<th className="text-left p-4 text-sm font-semibold text-primary">
												ФИО
											</th>
											<th className="text-left p-4 text-sm font-semibold text-primary">
												Телефон
											</th>
											<th className="text-left p-4 text-sm font-semibold text-primary">
												Email
											</th>
											<th className="text-left p-4 text-sm font-semibold text-primary">
												Корт
											</th>
											<th className="text-left p-4 text-sm font-semibold text-primary">
												Дата
											</th>
											<th className="text-left p-4 text-sm font-semibold text-primary">
												Время
											</th>
											<th className="text-left p-4 text-sm font-semibold text-primary">
												Цена
											</th>
											<th className="text-left p-4 text-sm font-semibold text-primary">
												Статус
											</th>
										</tr>
									</thead>
									<tbody>
										{confirmedBookings.map((booking) => {
											const court =
												courts.find(
													(item) =>
														item.id ===
														booking.courtId
												) ?? null;

											return (
												<tr
													key={booking.id}
													className="border-b border-border hover:bg-secondary/50 cursor-pointer transition-colors"
													onClick={() =>
														handleBookingClick({
															...booking,
															courtName:
																court!.name,
														})
													}
												>
													<td className="p-4 relative">
														<p className="text-sm font-medium text-foreground">
															{booking.firstName}{' '}
															{booking.lastName}
														</p>
														{booking.isRecurring && (
															<div className="absolute top-2 right-2 w-4.5 h-4.5 rounded-full bg-accent flex items-center justify-center">
																<Repeat className="w-2.5 h-2.5 text-white" />
															</div>
														)}
													</td>
													<td className="p-4 text-sm text-foreground">
														{booking.phone}
													</td>
													<td className="p-4 text-sm text-foreground">
														{booking.email}
													</td>
													<td className="p-4 text-sm text-foreground">
														{court?.name ??
															'Корт не найден'}
													</td>
													<td className="p-4 text-sm text-foreground">
														{new Date(
															booking.date[0]
														).toLocaleDateString(
															'ru-RU'
														)}
													</td>
													<td className="p-4 text-sm text-foreground">
														{booking.time}
													</td>
													<td className="p-4 text-sm font-medium text-foreground">
														{booking.price} ₽
													</td>
													<td className="p-4">
														<Badge className="bg-[#1E7A4C] text-white hover:bg-[#1E7A4C]/90">
															Подтверждено
														</Badge>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>

							<div className="flex items-center justify-between p-4 border-t border-border">
								<p className="text-sm text-muted-foreground">
									Показано 1-{confirmedBookings.length} из{' '}
									{confirmedBookings.length}
								</p>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										disabled
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>
									<Button variant="outline" size="sm">
										1
									</Button>
									<Button
										variant="outline"
										size="sm"
										disabled
									>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</Card>
					</TabsContent>
				</Tabs>
			</div>

			<BookingDetailsDrawer
				booking={selectedBooking}
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
			/>

			<Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Подтвердить бронирование?</DialogTitle>
						<DialogDescription>
							Вы уверены, что хотите подтвердить бронирование для{' '}
							{actionBooking?.firstName} {actionBooking?.lastName}
							? Клиент получит уведомление.
						</DialogDescription>
					</DialogHeader>
					<div className="flex gap-3 justify-end mt-4">
						<Button
							variant="outline"
							onClick={() => setConfirmModalOpen(false)}
						>
							Отмена
						</Button>
						<Button
							className="bg-[#1E7A4C] hover:bg-[#1E7A4C]/90 text-white"
							onClick={confirmBooking}
						>
							Подтвердить
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Отклонить бронирование?</DialogTitle>
						<DialogDescription>
							Вы уверены, что хотите отклонить бронирование для{' '}
							{actionBooking?.firstName} {actionBooking?.lastName}
							? Это действие нельзя отменить.
						</DialogDescription>
					</DialogHeader>
					<div className="flex gap-3 justify-end mt-4">
						<Button
							variant="outline"
							onClick={() => setRejectModalOpen(false)}
						>
							Отмена
						</Button>
						<Button variant="destructive" onClick={rejectBooking}>
							Отклонить
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</AdminLayout>
	);
}
