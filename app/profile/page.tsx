'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { User, Upload, Mail, Phone, Lock, Bell } from 'lucide-react';

export default function ProfilePage() {
	const [notifications, setNotifications] = useState({
		email: true,
		push: true,
	});

	return (
		<AdminLayout>
			<div className="space-y-4">
				{/* Header - Reduced spacing */}
				<div>
					<p className="text-xl font-bold text-primary mt-1">
						Управление личными данными и настройками
					</p>
				</div>

				<Card className="p-4">
					<div className="flex flex-col lg:flex-row gap-6">
						{/* Profile Photo Section */}
						<div className="lg:w-64 shrink-0">
							<h3 className="text-base font-semibold text-primary mb-3">
								Фото профиля
							</h3>
							<div className="flex flex-col items-center gap-3">
								<div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center border-2 border-accent/20">
									<User className="h-10 w-10 text-accent" />
								</div>
								<Button className="gap-2 h-9 w-full">
									<Upload className="h-4 w-4" />
									Загрузить фото
								</Button>
								<p className="text-xs text-muted-foreground text-center">
									JPG или PNG. Размер: 200x200px
								</p>
							</div>
						</div>

						{/* Personal Information Section */}
						<div className="flex-1">
							<h3 className="text-base font-semibold text-primary mb-3">
								Персональные данные
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<div className="space-y-2">
									<Label
										htmlFor="firstName"
										className="text-sm"
									>
										Имя
									</Label>
									<Input
										id="firstName"
										defaultValue="Иван"
										className="h-9"
									/>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="lastName"
										className="text-sm"
									>
										Фамилия
									</Label>
									<Input
										id="lastName"
										defaultValue="Администраторов"
										className="h-9"
									/>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="profileEmail"
										className="text-sm"
									>
										Email
									</Label>
									<div className="relative">
										<Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											id="profileEmail"
											type="email"
											className="pl-10 h-9"
											defaultValue="admin@bookplay.ru"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="profilePhone"
										className="text-sm"
									>
										Телефон
									</Label>
									<div className="relative">
										<Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											id="profilePhone"
											type="tel"
											className="pl-10 h-9"
											defaultValue="+7 (999) 123-45-67"
										/>
									</div>
								</div>
							</div>

							<div className="flex justify-end mt-4">
								<Button className="bg-[#1E7A4C] hover:bg-[#1E7A4C]/90 text-white h-9">
									Сохранить изменения
								</Button>
							</div>
						</div>
					</div>
				</Card>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{/* Change Password */}
					<Card className="p-4">
						<h3 className="text-base font-semibold text-primary mb-3">
							Смена пароля
						</h3>
						<div className="space-y-3">
							<div className="space-y-2">
								<Label
									htmlFor="currentPassword"
									className="text-sm"
								>
									Текущий пароль
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										id="currentPassword"
										type="password"
										className="pl-10 h-9"
										placeholder="Введите текущий пароль"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="newPassword"
									className="text-sm"
								>
									Новый пароль
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										id="newPassword"
										type="password"
										className="pl-10 h-9"
										placeholder="Введите новый пароль"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="confirmPassword"
									className="text-sm"
								>
									Подтверждение пароля
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										id="confirmPassword"
										type="password"
										className="pl-10 h-9"
										placeholder="Повторите новый пароль"
									/>
								</div>
							</div>
						</div>

						<div className="flex justify-end mt-4">
							<Button className="bg-[#1E7A4C] hover:bg-[#1E7A4C]/90 text-white h-9">
								Изменить пароль
							</Button>
						</div>
					</Card>

					{/* Notification Settings */}
					<Card className="p-4">
						<div className="flex items-center gap-2 mb-4">
							<Bell className="h-5 w-5 text-accent" />
							<h3 className="text-base font-semibold text-primary">
								Настройки уведомлений
							</h3>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
								<div className="flex-1">
									<p className="text-sm font-medium text-foreground">
										Email уведомления
									</p>
									<p className="text-xs text-muted-foreground mt-0.5">
										Получать уведомления о бронированиях и
										событиях на email
									</p>
								</div>
								<Switch
									checked={notifications.email}
									onCheckedChange={(checked) =>
										setNotifications((prev) => ({
											...prev,
											email: checked,
										}))
									}
								/>
							</div>

							<div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
								<div className="flex-1">
									<p className="text-sm font-medium text-foreground">
										Push уведомления
									</p>
									<p className="text-xs text-muted-foreground mt-0.5">
										Получать мгновенные уведомления о важных
										событиях
									</p>
								</div>
								<Switch
									checked={notifications.push}
									onCheckedChange={(checked) =>
										setNotifications((prev) => ({
											...prev,
											push: checked,
										}))
									}
								/>
							</div>
						</div>

						<div className="mt-4 p-3 bg-accent/5 rounded-lg border border-accent/20">
							<p className="text-sm text-foreground">
								<span className="font-medium">Примечание:</span>{' '}
								Изменения настроек уведомлений применяются
								немедленно
							</p>
						</div>
					</Card>
				</div>
			</div>
		</AdminLayout>
	);
}
