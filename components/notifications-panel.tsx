'use client';

import { X, AtSign, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationsPanelProps {
	open: boolean;
	onClose: () => void;
}

// Mock notifications data
const notifications = [
	{
		id: 1,
		type: 'new_booking',
		icon: Calendar,
		title: 'Новая заявка на бронирование',
		description: 'Иванов Иван хочет забронировать корт №2 на 15.01.2025',
		time: '5 минут назад',
		unread: true,
	},
	{
		id: 2,
		type: 'confirmed',
		icon: CheckCircle2,
		title: 'Бронирование подтверждено',
		description: 'Бронирование корта №1 для Петрова П.П. подтверждено',
		time: '1 час назад',
		unread: true,
	},
	{
		id: 3,
		type: 'cancelled',
		icon: AlertCircle,
		title: 'Бронирование отменено',
		description: 'Сидоров С.С. отменил бронирование на 20.01.2025',
		time: '2 часа назад',
		unread: true,
	},
];

export function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
	if (!open) return null;

	return (
		<>
			{/* Backdrop overlay */}
			<div
				className="fixed inset-0 z-50 transition-opacity"
				onClick={onClose}
			/>

			{/* Notifications panel - slides from top right like in the reference */}
			<div
				className={cn(
					'fixed top-16 right-50 z-50 w-full max-w-md bg-card rounded-xl shadow-2xl transition-transform',
					'max-h-[calc(100vh-5rem)] overflow-hidden flex flex-col',
					open
						? 'translate-y-0 opacity-100'
						: 'translate-y-[-10px] opacity-0'
				)}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-border">
					<div className="flex items-center gap-2">
						<AtSign className="h-5 w-5 text-accent" />
						<h2 className="text-lg font-semibold text-foreground">
							Уведомления
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-1 hover:bg-muted rounded-lg transition-colors"
					>
						<X className="h-5 w-5 text-muted-foreground" />
					</button>
				</div>

				{/* Notifications list */}
				<div className="flex-1 overflow-y-auto p-2">
					{notifications.length > 0 ? (
						<div className="space-y-1">
							{notifications.map((notification) => {
								const Icon = notification.icon;
								return (
									<button
										key={notification.id}
										className={cn(
											'w-full text-left p-3 rounded-lg transition-colors hover:bg-muted',
											notification.unread && 'bg-accent/5'
										)}
									>
										<div className="flex gap-3">
											<div
												className={cn(
													'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
													notification.type ===
														'new_booking' &&
														'bg-[#E6B800]/10 text-[#E6B800]',
													notification.type ===
														'confirmed' &&
														'bg-[#1E7A4C]/10 text-[#1E7A4C]',
													notification.type ===
														'cancelled' &&
														'bg-destructive/10 text-destructive'
												)}
											>
												<Icon className="h-5 w-5" />
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-start justify-between gap-2">
													<p className="text-sm font-medium text-foreground">
														{notification.title}
													</p>
													{notification.unread && (
														<div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-1.5" />
													)}
												</div>
												<p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
													{notification.description}
												</p>
												<p className="text-xs text-muted-foreground mt-1">
													{notification.time}
												</p>
											</div>
										</div>
									</button>
								);
							})}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<AtSign className="h-12 w-12 text-muted-foreground/50 mb-3" />
							<p className="text-sm font-medium text-foreground">
								Нет уведомлений
							</p>
							<p className="text-sm text-muted-foreground mt-1">
								Здесь будут отображаться ваши уведомления
							</p>
						</div>
					)}
				</div>

				{/* Footer */}
				{/* <div className="p-3 border-t border-border">
          <button className="w-full text-center text-sm font-medium text-accent hover:text-accent/80 transition-colors py-2">
            Показать все
          </button>
        </div> */}
			</div>
		</>
	);
}
