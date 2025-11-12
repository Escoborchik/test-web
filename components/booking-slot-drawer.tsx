'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { COVER_TYPE_LABELS, RuShortDays, SPORT_TYPE_LABELS } from '@/constants';
import { useAppDispatch } from '@/store';
import {
	deleteDateFromRecurringBooking,
	updateStatusBooking,
} from '@/store/bookingsManagment';
import { CoverType, SportType } from '@/types';
import { Booking, ShortDays } from '@/types/booking';
import { format } from 'date-fns';
import {
	Calendar,
	Clock,
	Mail,
	MapPin,
	Phone,
	Repeat,
	RussianRuble,
	User,
	X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type BookingWithContext = Booking & {
	courtName: string;
	coverType: CoverType;
	sportType: SportType;
	isIndoor: boolean;
	street: string;
	currentDate: Date;
};

interface BookingSlotDrawerProps {
	booking: BookingWithContext;
	open: boolean;
	onClose: () => void;
}

export function BookingSlotDrawer({
	booking,
	open,
	onClose,
}: BookingSlotDrawerProps) {
	const dispatch = useAppDispatch();
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const handleConfirm = () => {
		dispatch(updateStatusBooking({ id: booking.id, status: 'confirmed' }));
		setConfirmDialogOpen(true);
	};

	const refundHour = 24;
	const totalSessions = useMemo(() => {
		if (booking?.recurringDetails)
			return (
				booking.recurringDetails.weeks *
				booking.recurringDetails.days.length
			);
		return null;
	}, [booking?.recurringDetails]);

	const remainingSessions = useMemo(() => {
		if (!booking?.isRecurring || !booking.recurringDetails || !booking.time)
			return null;

		const { startDate, endDate, days } = booking.recurringDetails;
		if (!startDate || !endDate || !days.length) return null;

		const shortDayMap: ShortDays[] = [
			'Sun',
			'Mon',
			'Tue',
			'Wed',
			'Thu',
			'Fri',
			'Sat',
		];

		const start = new Date(startDate);
		const end = new Date(endDate);
		const current = new Date(booking.currentDate);
		const now = new Date();

		if (
			Number.isNaN(start.getTime()) ||
			Number.isNaN(end.getTime()) ||
			Number.isNaN(current.getTime())
		)
			return null;

		start.setHours(0, 0, 0, 0);
		end.setHours(0, 0, 0, 0);
		current.setHours(0, 0, 0, 0);

		now.setHours(0, 0, 0, 0);

		const iterationStart = current > start ? current : start;
		const loopStart = iterationStart > now ? iterationStart : now;

		if (loopStart > end) return 0;

		const [startTime] = booking.time.split('-');
		const [startHour, startMinute] = startTime.split(':').map(Number);
		if (Number.isNaN(startHour) || Number.isNaN(startMinute)) return null;

		const daySet = new Set<ShortDays>(days);
		const refundWindowMs = refundHour * 60 * 60 * 1000;

		let remaining = 0;

		for (
			let cursor = new Date(loopStart);
			cursor <= end;
			cursor.setDate(cursor.getDate() + 1)
		) {
			const dayKey = shortDayMap[cursor.getDay()];
			if (!daySet.has(dayKey)) continue;

			const sessionStart = new Date(cursor);
			sessionStart.setHours(startHour, startMinute, 0, 0);

			const diffMs = sessionStart.getTime() - now.getTime();
			if (diffMs >= refundWindowMs) remaining += 1;
		}

		return remaining;
	}, [booking]);

	// const remainingSessions = useMemo(() => {
	// 	if (!booking?.isRecurring || !booking.recurringDetails) return null;

	// 	const { startDate, endDate, days } = booking.recurringDetails;
	// 	if (!startDate || !endDate || !days?.length) return null;

	// 	const shortDayMap: ShortDays[] = [
	// 		'Mon',
	// 		'Tue',
	// 		'Wed',
	// 		'Thu',
	// 		'Fri',
	// 		'Sat',
	// 		'Sun',
	// 	];

	// 	const start = new Date(startDate);
	// 	const end = new Date(endDate);
	// 	const current = new Date(booking.currentDate);

	// 	if (
	// 		Number.isNaN(start.getTime()) ||
	// 		Number.isNaN(end.getTime()) ||
	// 		Number.isNaN(current.getTime())
	// 	)
	// 		return null;

	// 	start.setHours(0, 0, 0, 0);
	// 	end.setHours(0, 0, 0, 0);
	// 	current.setHours(0, 0, 0, 0);

	// 	if (current > end) return 0;

	// 	const effectiveStart =
	// 		current > start ? new Date(current) : new Date(start);
	// 	const daySet = new Set<ShortDays>(days);

	// 	let remaining = 0;
	// 	for (
	// 		let cursor = new Date(effectiveStart);
	// 		cursor <= end;
	// 		cursor.setDate(cursor.getDate() + 1)
	// 	) {
	// 		const dayKey = shortDayMap[cursor.getDay()];
	// 		if (daySet.has(dayKey)) remaining += 1;
	// 	}

	// 	return remaining;
	// }, [booking]);

	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
	const [cancelAllDialogOpen, setCancelAllDialogOpen] = useState(false);

	if (!booking) return null;

	const calculateEndTime = (startTime: string, duration: number) => {
		const [hours, minutes] = startTime.split(':').map(Number);
		const totalMinutes = hours * 60 + minutes + duration * 60;
		const endHours = Math.floor(totalMinutes / 60);
		const endMinutes = totalMinutes % 60;
		return `${endHours.toString().padStart(2, '0')}:${endMinutes
			.toString()
			.padStart(2, '0')}`;
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
					{/* Header */}
					<div className="flex items-center justify-between p-6 border-b border-border">
						<h2 className="text-xl font-bold text-primary">
							Детали бронирования
						</h2>
						<button
							onClick={onClose}
							className="p-2 hover:bg-muted rounded-lg transition-colors"
						>
							<X className="h-5 w-5 text-muted-foreground" />
						</button>
					</div>

					{/* Content */}
					<div className="flex-1 overflow-y-auto p-6 space-y-6">
						{/* Status Badge */}
						{booking.status === 'confirmed' && (
							<Badge className="bg-[#1E7A4C] text-white hover:bg-[#1E7A4C]/90">
								Подтверждено
							</Badge>
						)}
						{booking.status === 'pending' && (
							<Badge className="bg-[#E6B800] text-white hover:bg-[#E6B800]/90">
								Ожидает подтверждения
							</Badge>
						)}

						<div className="space-y-3">
							<h3 className="text-sm font-semibold text-primary">
								Информация о клиенте
							</h3>
							<div className="space-y-3 p-3 bg-accent/5 rounded-lg border border-accent/20">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
										<User className="h-5 w-5 text-accent" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-foreground">
											{booking.lastName}{' '}
											{booking.firstName}
										</p>
										<p className="text-xs text-muted-foreground">
											Имя клиента
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
										<Phone className="h-5 w-5 text-primary" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-foreground">
											{booking.phone}
										</p>
										<p className="text-xs text-muted-foreground">
											Телефон
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
										<Mail className="h-5 w-5 text-primary" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-foreground break-all">
											{booking.email}
										</p>
										<p className="text-xs text-muted-foreground">
											Email
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Booking Information Section */}
						<div className="space-y-3">
							<h3 className="text-sm font-semibold text-primary">
								Информация о бронировании
							</h3>
							<div className="space-y-3 p-3 bg-accent/5 rounded-lg border border-accent/20">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
										<Clock className="h-5 w-5 text-primary" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-foreground">
											{booking.time}
										</p>
										<p className="text-xs text-muted-foreground">
											Время бронирования (
											{booking.duration} ч)
										</p>
									</div>
								</div>

								{booking.date && !booking.isRecurring && (
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
											<Calendar className="h-5 w-5 text-primary" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-foreground">
												{new Date(
													booking.date[0]
												).toLocaleDateString('ru-RU', {
													day: 'numeric',
													month: 'long',
													year: 'numeric',
												})}
											</p>
											<p className="text-xs text-muted-foreground">
												Дата бронирования
											</p>
										</div>
									</div>
								)}

								{!booking.isRecurring && booking.price && (
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
											<RussianRuble className="h-5 w-5 text-accent" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-foreground">
												{booking.price} ₽
											</p>
											<p className="text-xs text-muted-foreground">
												Цена
											</p>
										</div>
									</div>
								)}

								{booking.isRecurring && (
									<>
										<div className="pt-2 border-t border-accent/20">
											<div className="flex items-start gap-3 mb-3">
												<div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
													<Repeat className="h-5 w-5 text-accent" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-semibold text-accent mb-1">
														Повторяющееся
														бронирование
													</p>
												</div>
											</div>

											<div className="space-y-2.5 pl-1">
												{booking.price && (
													<div className="flex items-center gap-3">
														<div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
															<RussianRuble className="h-4 w-4 text-primary" />
														</div>
														<div className="flex-1 min-w-0">
															<p className="text-sm font-medium text-foreground">
																{booking.price}{' '}
																₽
															</p>
															<p className="text-xs text-muted-foreground">
																Цена за одно
																занятие
															</p>
														</div>
													</div>
												)}

												{booking.recurringDetails!
													.startDate && (
													<div className="flex items-center gap-3">
														<div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
															<Calendar className="h-4 w-4 text-primary" />
														</div>
														<div className="flex-1 min-w-0">
															<p className="text-sm font-medium text-foreground">
																{new Date(
																	booking.recurringDetails!.startDate
																).toLocaleDateString(
																	'ru-RU',
																	{
																		day: 'numeric',
																		month: 'long',
																		year: 'numeric',
																	}
																)}
															</p>
															<p className="text-xs text-muted-foreground">
																Дата начала
															</p>
														</div>
													</div>
												)}

												{booking.recurringDetails!
													.endDate && (
													<div className="flex items-center gap-3">
														<div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
															<Calendar className="h-4 w-4 text-primary" />
														</div>
														<div className="flex-1 min-w-0">
															<p className="text-sm font-medium text-foreground">
																{new Date(
																	booking.recurringDetails!.endDate
																).toLocaleDateString(
																	'ru-RU',
																	{
																		day: 'numeric',
																		month: 'long',
																		year: 'numeric',
																	}
																)}
															</p>
															<p className="text-xs text-muted-foreground">
																Дата окончания
															</p>
														</div>
													</div>
												)}

												{booking.recurringDetails!
													.days &&
													booking.recurringDetails!
														.days.length > 0 && (
														<div className="p-2 bg-muted/50 rounded">
															<p className="text-xs text-muted-foreground mb-1">
																Дни недели
															</p>
															<div className="flex flex-wrap gap-1">
																{booking.recurringDetails!.days.map(
																	(
																		day: ShortDays
																	) => (
																		<Badge
																			key={
																				day
																			}
																			variant="outline"
																			className="text-xs bg-accent/10 border-accent/30 text-accent"
																		>
																			{
																				RuShortDays[
																					day
																				]
																			}
																		</Badge>
																	)
																)}
															</div>
														</div>
													)}

												{totalSessions !== null && (
													<div className="grid grid-cols-2 gap-2">
														<div className="p-2 bg-muted/50 rounded">
															<p className="text-xs text-muted-foreground">
																Всего занятий
															</p>
															<p className="text-sm font-medium text-foreground mt-0.5">
																{totalSessions}
															</p>
														</div>
														<div className="p-2 bg-primary/10 rounded">
															<p className="text-xs text-muted-foreground">
																Осталось
															</p>
															<p className="text-sm font-medium text-primary mt-0.5">
																{remainingSessions ??
																	'—'}
															</p>
														</div>
													</div>
												)}

												{booking.price &&
													remainingSessions &&
													remainingSessions > 0 && (
														<div className="p-2.5 bg-accent/10 rounded border border-accent/30">
															<p className="text-xs text-muted-foreground mb-1">
																Цена за
																оставшиеся
																занятия
															</p>
															<p className="text-base font-semibold text-accent">
																{(
																	booking.price *
																	remainingSessions
																).toLocaleString()}{' '}
																₽
															</p>
														</div>
													)}
											</div>
										</div>
									</>
								)}
							</div>
						</div>

						{/* Court Information Section */}
						<div className="space-y-3">
							<h3 className="text-sm font-semibold text-primary">
								Информация о корте
							</h3>
							<div className="space-y-3 p-3 bg-accent/5 rounded-lg border border-accent/20">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
										<MapPin className="h-5 w-5 text-primary" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-foreground">
											{booking.courtName}
										</p>
										<p className="text-xs text-muted-foreground">
											Название корта
										</p>
									</div>
								</div>

								{booking.coverType && (
									<div className="grid grid-cols-2 gap-2 text-sm">
										<div className="p-2 bg-muted/50 rounded">
											<p className="text-xs text-muted-foreground">
												Тип поверхности
											</p>
											<p className="font-medium text-foreground mt-0.5">
												{
													COVER_TYPE_LABELS[
														booking.coverType
													]
												}
											</p>
										</div>
										<div className="p-2 bg-muted/50 rounded">
											<p className="text-xs text-muted-foreground">
												Тип корта
											</p>
											<p className="font-medium text-foreground mt-0.5">
												{booking.isIndoor
													? 'Открытый'
													: 'Закрытый'}
											</p>
										</div>
									</div>
								)}

								{booking.sportType && (
									<div className="p-2 bg-muted/50 rounded">
										<p className="text-xs text-muted-foreground">
											Вид спорта
										</p>
										<p className="text-sm font-medium text-foreground mt-0.5">
											{
												SPORT_TYPE_LABELS[
													booking.sportType
												]
											}
										</p>
									</div>
								)}

								{booking.street && (
									<div className="p-2 bg-muted/50 rounded">
										<p className="text-xs text-muted-foreground">
											Улица
										</p>
										<p className="text-sm font-medium text-foreground mt-0.5">
											{booking.street}
										</p>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="p-6 border-t border-border space-y-3">
						{booking.status === 'pending' && (
							<Button
								onClick={handleConfirm}
								className="w-full bg-[#1E7A4C] hover:bg-[#1E7A4C]/90 text-white"
							>
								Подтвердить бронирование
							</Button>
						)}
						<Button
							variant="destructive"
							className="w-full"
							onClick={() => setCancelDialogOpen(true)}
						>
							Отменить текущее
						</Button>
						{booking.isRecurring && (
							<Button
								variant="outline"
								className="w-full text-destructive hover:text-destructive bg-transparent"
								onClick={() => setCancelAllDialogOpen(true)}
							>
								Отменить все повторения
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* Confirm Dialog */}
			<Dialog
				open={confirmDialogOpen}
				onOpenChange={setConfirmDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Подтвердить бронирование?</DialogTitle>
						<DialogDescription>
							Вы уверены, что хотите подтвердить это бронирование?
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
								dispatch(
									updateStatusBooking({
										id: booking.id,
										status: 'confirmed',
									})
								);
								setConfirmDialogOpen(false);
								onClose();
							}}
						>
							Подтвердить
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Cancel Current Dialog */}
			<Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Отменить бронирование?</DialogTitle>
						<DialogDescription>
							Вы уверены, что хотите отменить это бронирование?
							Клиент получит уведомление об отмене.
						</DialogDescription>
					</DialogHeader>
					<div className="flex gap-3 justify-end mt-4">
						<Button
							variant="outline"
							onClick={() => setCancelDialogOpen(false)}
						>
							Назад
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								if (booking.isRecurring) {
									dispatch(
										deleteDateFromRecurringBooking({
											id: booking.id,
											date: format(
												booking.currentDate,
												'yyyy-MM-dd'
											),
										})
									);
								} else {
									dispatch(
										updateStatusBooking({
											id: booking.id,
											status: 'rejected',
										})
									);
								}

								setCancelDialogOpen(false);
								onClose();
							}}
						>
							Отменить бронирование
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Cancel All Dialog */}
			<Dialog
				open={cancelAllDialogOpen}
				onOpenChange={setCancelAllDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Отменить все повторения?</DialogTitle>
						<DialogDescription>
							Вы уверены, что хотите отменить все повторяющиеся
							бронирования? Это действие нельзя отменить.
						</DialogDescription>
					</DialogHeader>
					<div className="flex gap-3 justify-end mt-4">
						<Button
							variant="outline"
							onClick={() => setCancelAllDialogOpen(false)}
						>
							Назад
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								dispatch(
									updateStatusBooking({
										id: booking.id,
										status: 'rejected',
									})
								);
								setCancelAllDialogOpen(false);
								onClose();
							}}
						>
							Отменить все
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
