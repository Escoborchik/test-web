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
import { Booking } from '@/types/booking';
import { Clock, Mail, MapPin, Phone, User, X } from 'lucide-react';
import { useState } from 'react';

interface BookingSlotDrawerProps {
	booking: Booking & { courtName: string };
	open: boolean;
	onClose: () => void;
}

export function BookingSlotDrawer({
	booking,
	open,
	onClose,
}: BookingSlotDrawerProps) {
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

						<div className="space-y-4">
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
										+7 (999) 123-45-67
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
										client@example.com
									</p>
									<p className="text-xs text-muted-foreground">
										Email
									</p>
								</div>
							</div>

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

							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
									<Clock className="h-5 w-5 text-primary" />
								</div>
								<div>
									<p className="text-sm font-medium text-foreground">
										{booking.time} -{' '}
										{calculateEndTime(
											booking.time,
											booking.duration
										)}
									</p>
									<p className="text-xs text-muted-foreground">
										Время бронирования
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="p-6 border-t border-border space-y-3">
						<Button
							variant="destructive"
							className="w-full"
							onClick={() => setCancelDialogOpen(true)}
						>
							Отменить текущее
						</Button>
						{booking.isRepeated && (
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
