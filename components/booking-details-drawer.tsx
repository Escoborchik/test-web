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
import { RuShortDays } from '@/constants';
import { useAppDispatch } from '@/store';
import { updateStatusBooking } from '@/store/bookingsManagment';
import { Booking } from '@/types/booking';
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
import { useEffect, useState } from 'react';

interface BookingDetailsDrawerProps {
	booking: Booking & { courtName: string };
	open: boolean;
	onClose: () => void;
}

export function BookingDetailsDrawer({
	booking,
	open,
	onClose,
}: BookingDetailsDrawerProps) {
	const dispatch = useAppDispatch();
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

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

	if (!booking) return null;

	const handleConfirm = () => {
		setConfirmDialogOpen(true);
	};

	const handleReject = () => {
		setRejectDialogOpen(true);
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
				className={`fixed right-0 top-0 h-full w-full max-w-lg bg-card shadow-2xl z-50 transition-transform duration-300 ${
					open ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				<div className="flex flex-col h-full">
					{/* Header - Reduced padding */}
					<div className="flex items-center justify-between p-4 border-b border-border">
						<h2 className="text-lg font-bold text-primary">
							Детали бронирования
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
						{/* Status Badge */}
						{booking.status === 'pending' && (
							<Badge className="bg-[#E6B800] text-white hover:bg-[#E6B800]/90">
								Ожидает подтверждения
							</Badge>
						)}
						{booking.status === 'confirmed' && (
							<Badge className="bg-[#1E7A4C] text-white hover:bg-[#1E7A4C]/90">
								Подтверждено
							</Badge>
						)}

						{/* Client Info */}
						<div className="space-y-4">
							<h3 className="text-sm font-semibold text-primary">
								Информация о клиенте
							</h3>

							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
									<User className="h-5 w-5 text-accent" />
								</div>
								<div>
									<p className="text-sm font-medium text-foreground">
										{booking.firstName} {booking.lastName}
									</p>
									<p className="text-xs text-muted-foreground">
										Клиент
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
									<Phone className="h-5 w-5 text-primary" />
								</div>
								<div>
									<p className="text-sm font-medium text-foreground">
										{booking.phone}
									</p>
									<p className="text-xs text-muted-foreground">
										Телефон
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
									<Mail className="h-5 w-5 text-primary" />
								</div>
								<div>
									<p className="text-sm font-medium text-foreground">
										{booking.email}
									</p>
									<p className="text-xs text-muted-foreground">
										Email
									</p>
								</div>
							</div>
						</div>

						{/* Booking Info */}
						<div className="space-y-4">
							<h3 className="text-sm font-semibold text-primary">
								Информация о бронировании
							</h3>

							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
									<MapPin className="h-5 w-5 text-primary" />
								</div>
								<div>
									<p className="text-sm font-medium text-foreground">
										{booking.courtName}
									</p>
									<p className="text-xs text-muted-foreground">
										Корт
									</p>
								</div>
							</div>

							{!booking.isRecurring && (
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
										<Calendar className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="text-sm font-medium text-foreground">
											{new Date(
												booking.date
											).toLocaleDateString('ru-RU', {
												weekday: 'long',
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
										</p>
										<p className="text-xs text-muted-foreground">
											Дата
										</p>
									</div>
								</div>
							)}

							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
									<Clock className="h-5 w-5 text-primary" />
								</div>
								<div>
									<p className="text-sm font-medium text-foreground">
										{booking.time}
									</p>
									<p className="text-xs text-muted-foreground">
										Время
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
									<RussianRuble className="h-5 w-5 text-accent" />
								</div>
								<div>
									<p className="text-sm font-medium text-foreground">
										{booking.price} ₽
									</p>
									<p className="text-xs text-muted-foreground">
										Стоимость
									</p>
								</div>
							</div>
						</div>

						{/* Recurring Info */}
						{booking.isRecurring && booking.recurringDetails && (
							<div className="space-y-4 p-4 bg-accent/5 rounded-lg border border-accent/20">
								<div className="flex items-center gap-2">
									<Repeat className="h-5 w-5 text-accent" />
									<h3 className="text-sm font-semibold text-primary">
										Повторяющееся бронирование
									</h3>
								</div>

								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Начало:
										</span>
										<span className="font-medium text-foreground">
											{new Date(
												booking.recurringDetails.startDate
											).toLocaleDateString('ru-RU')}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Окончание:
										</span>
										<span className="font-medium text-foreground">
											{new Date(
												booking.recurringDetails.endDate
											).toLocaleDateString('ru-RU')}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Количество недель:
										</span>
										<span className="font-medium text-foreground">
											{booking.recurringDetails.weeks}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Дни недели:
										</span>
										<span className="font-medium text-foreground">
											{booking.recurringDetails.days
												.map((day) => RuShortDays[day])
												.join(', ')}
										</span>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Footer Actions - Reduced padding */}
					{booking.status === 'pending' && (
						<div className="p-4 border-t border-border space-y-2">
							<Button
								className="w-full bg-[#1E7A4C] hover:bg-[#1E7A4C]/90 text-white"
								onClick={handleConfirm}
							>
								Подтвердить бронирование
							</Button>
							<Button
								variant="destructive"
								className="w-full"
								onClick={handleReject}
							>
								Отклонить
							</Button>
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

			{/* Reject Dialog */}
			<Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Отклонить бронирование?</DialogTitle>
						<DialogDescription>
							Вы уверены, что хотите отклонить это бронирование?
							Это действие нельзя отменить.
						</DialogDescription>
					</DialogHeader>
					<div className="flex gap-3 justify-end mt-4">
						<Button
							variant="outline"
							onClick={() => setRejectDialogOpen(false)}
						>
							Отмена
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
								setRejectDialogOpen(false);
								onClose();
							}}
						>
							Отклонить
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
