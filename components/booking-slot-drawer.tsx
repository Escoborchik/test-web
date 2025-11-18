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
import {
	COVER_TYPE_LABELS,
	RuShortDays,
	SPORT_TYPE_LABELS,
	UNIT_TYPE_LABELS,
} from '@/constants';
import { useAppDispatch, useAppSelector } from '@/store';
import {
	deleteDateFromRecurringBooking,
	updateStatusBooking,
} from '@/store/bookingsManagment';
import { selectExtras } from '@/store/extrasManagment';
import { selectTariffs } from '@/store/tariffsManagment';
import { CoverType, SportType } from '@/types';
import { Booking, ShortDays } from '@/types/booking';
import { format } from 'date-fns';
import {
	Calendar,
	Clock,
	Mail,
	MapPin,
	Phone,
	RussianRuble,
	ShoppingBag,
	Tag,
	User,
	X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type BookingWithContext = Booking & {
	courtName: string;
	coverType: CoverType;
	sportType: SportType;
	isIndoor: boolean;
	street: string;
	currentDate: Date;
	pricePerSession: number;
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
	const extras = useAppSelector(selectExtras);
	const tariffs = useAppSelector(selectTariffs);
	const tariff = tariffs.find((tariff) => tariff.id === booking?.tariffId);
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

	const calculateDuration = () => {
		const [startTime, endTime] = booking?.time.split('-') ?? '08:00-23:00';

		if (!startTime || !endTime) return 0;
		const [startHour, startMin] = startTime.split(':').map(Number);
		const [endHour, endMin] = endTime.split(':').map(Number);
		const startMinutes = startHour * 60 + startMin;
		const endMinutes = endHour * 60 + endMin;
		const durationMinutes = endMinutes - startMinutes;
		return durationMinutes / 60;
	};

	const duration = calculateDuration();

	const calculateExtraPricePerSingle = () => {
		return booking?.extras.reduce((acc, selectedExtra) => {
			const rightExtra = extras.find(
				(extra) => extra.id === selectedExtra.extraId
			);

			if (rightExtra) {
				acc +=
					rightExtra.unit === 'hour'
						? selectedExtra.quantity * rightExtra.price * duration
						: selectedExtra.quantity * rightExtra.price;

				return acc;
			}

			return acc;
		}, 0);
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

	const totalBookings = booking?.isRecurring
		? totalSessions!
		: booking?.date.length;
	const totalPriceBooking = booking?.isRecurring
		? remainingSessions! * booking?.price
		: booking?.price;
	const extraPricePerSingle = calculateExtraPricePerSingle();
	const totalExtraPrice = booking?.isRecurring
		? remainingSessions! * extraPricePerSingle
		: extraPricePerSingle;

	const handleConfirm = () => {
		setConfirmDialogOpen(true);
	};

	useEffect(() => {
		if (open) {
			document.body.classList.add('drawer-open');
		} else {
			document.body.classList.remove('drawer-open');
		}
		return () => {
			document.body.classList.remove('drawer-open');
		};
	}, [open]);

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
						{booking.status === 'pending-payment' && (
							<Badge className="bg-gray-500 text-white hover:bg-gray-500/90">
								Ожидает оплаты
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
								{tariff && !booking.isRecurring && (
									<div className="flex items-center gap-3">
										<div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
											<Tag className="h-5 w-5 text-accent" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-foreground">
												«{tariff?.title}»
											</p>
											<p className="text-xs text-muted-foreground">
												Тариф
											</p>
										</div>
									</div>
								)}

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
											<div className="space-y-2.5 pl-1">
												{tariff && (
													<div className="flex items-center gap-3">
														<div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
															<Tag className="h-4 w-4 text-accent" />
														</div>
														<div className="flex-1 min-w-0">
															<p className="text-sm font-medium text-foreground">
																«{tariff?.title}
																»
															</p>
															<p className="text-xs text-muted-foreground">
																Тариф
															</p>
														</div>
													</div>
												)}

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

						{booking.extras && booking.extras.length > 0 && (
							<div className="space-y-3">
								<h3 className="text-sm font-semibold text-primary">
									Дополнительные услуги
								</h3>
								<div className="space-y-2 p-3 bg-accent/5 rounded-lg border border-accent/20">
									{extras.map((extra) => {
										const rightBookingExtra =
											booking.extras.find(
												(selectedExtra) =>
													selectedExtra.extraId ===
													extra.id
											);

										if (!rightBookingExtra) return null;

										return (
											<div
												key={rightBookingExtra.extraId}
												className="flex items-center gap-3 p-2 bg-muted/50 rounded"
											>
												<div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
													<ShoppingBag className="h-4 w-4 text-primary" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-foreground">
														{extra.title}
													</p>
													<p className="text-xs text-muted-foreground">
														{
															rightBookingExtra.quantity
														}{' '}
														× {extra.price} ₽/
														{
															UNIT_TYPE_LABELS[
																extra.unit
															]
														}
													</p>
												</div>
												<div className="text-sm font-semibold text-accent">
													{(
														rightBookingExtra.quantity *
														extra.price
													).toLocaleString()}{' '}
													₽
												</div>
											</div>
										);
									})}

									<div className="pt-2 mt-2 border-t border-accent/20">
										<div className="flex items-center justify-between">
											<p className="text-sm font-medium text-muted-foreground">
												Итого за услуги:
											</p>
											<p className="text-base font-semibold text-accent">
												{totalExtraPrice.toLocaleString()}{' '}
												₽
											</p>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>

					{booking.status !== 'pending-payment' && (
						<div className="p-6 border-t border-border space-y-3">
							{totalPriceBooking > 0 && (
								<div className="p-3 bg-primary/10 rounded-lg border border-primary/30 mb-3">
									<div className="space-y-1.5">
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">
												Бронирование:
											</span>
											<span className="font-medium">
												{totalPriceBooking.toLocaleString()}{' '}
												₽
											</span>
										</div>
										{booking?.extras.length > 0 && (
											<div className="space-y-1">
												<div className="flex items-center justify-between text-sm font-medium text-foreground pt-0.5">
													<span>Услуги:</span>
													<span>
														{totalExtraPrice.toLocaleString()}{' '}
														₽
													</span>
												</div>
												{booking?.extras.map(
													({ extraId, quantity }) => {
														const extra =
															extras.find(
																(ext) =>
																	ext.id ===
																	extraId
															);
														if (!extra) return null;

														const extraPrice =
															extra.unit ===
															'hour'
																? extra.price *
																  calculateDuration()
																: extra.price;
														const totalExtraPrice =
															booking?.isRecurring
																? extraPrice *
																  quantity *
																  remainingSessions!
																: extraPrice *
																  quantity;

														return (
															<div
																key={extraId}
																className="flex items-start justify-between text-xs text-muted-foreground pl-3"
															>
																<span className="flex-1">
																	•{' '}
																	{
																		extra.title
																	}{' '}
																	× {quantity}{' '}
																	{booking?.isRecurring &&
																		` × ${remainingSessions!} занятий`}
																</span>
																<span className="font-medium ml-2">
																	{totalExtraPrice.toLocaleString()}{' '}
																	₽
																</span>
															</div>
														);
													}
												)}
											</div>
										)}
										<div className="pt-1.5 mt-1.5 border-t border-primary/20 flex items-center justify-between">
											<span className="text-sm font-semibold text-foreground">
												Итоговая сумма:
											</span>
											<span className="text-base font-bold text-primary">
												{(
													totalExtraPrice +
													totalPriceBooking
												).toLocaleString()}{' '}
												₽
											</span>
										</div>
									</div>
								</div>
							)}

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
					)}
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
