'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Building2,
	Upload,
	Plus,
	Edit2,
	Trash2,
	Eye,
	EyeOff,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { CourtForm } from '@/components/court-form';
import { cn } from '@/lib/utils';
import { TimePicker } from '@/components/ui/timepicker';

// Mock courts data
const mockCourts = [
	{
		id: 1,
		name: 'Корт №1',
		surface: 'Хард',
		sport: 'Теннис',
		type: 'Открытый',
		address: 'ул. Спортивная, 12',
		visible: true,
		pricing: {
			weekday: [
				{ start: '10:00', end: '12:00', price: 1500 },
				{ start: '12:00', end: '18:00', price: 2000 },
			],
			weekend: [
				{ start: '10:00', end: '12:00', price: 2500 },
				{ start: '12:00', end: '18:00', price: 3000 },
			],
		},
	},
	{
		id: 2,
		name: 'Корт №2',
		surface: 'Грунт',
		sport: 'Теннис',
		type: 'Закрытый',
		address: 'ул. Спортивная, 12',
		visible: true,
		pricing: {
			weekday: [{ start: '10:00', end: '18:00', price: 2500 }],
			weekend: [{ start: '10:00', end: '18:00', price: 3500 }],
		},
	},
];

const amenities = [
	{ id: 'parking', label: 'Парковка' },
	{ id: 'wifi', label: 'Wi-Fi' },
	{ id: 'shower', label: 'Душ' },
	{ id: 'cafe', label: 'Кафе' },
	{ id: 'water', label: 'Вода' },
	{ id: 'cloakroom', label: 'Раздевалка' },
	{ id: 'sauna', label: 'Сауна' },
];

export default function OrganizationPage() {
	const [activeTab, setActiveTab] = useState('info');
	const [courts, setCourts] = useState(mockCourts);
	const [editingCourt, setEditingCourt] = useState<any>(null);
	const [isAddingCourt, setIsAddingCourt] = useState(false);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [courtToDelete, setCourtToDelete] = useState<any>(null);

	const [selectedAmenitiesId, setSelectedAmenitiesId] = useState([
		'parking',
		'wifi',
	]);

	const handleChangeAmenity = (id: string) => {
		if (selectedAmenitiesId.includes(id)) {
			setSelectedAmenitiesId((prev) =>
				prev.filter((amenityId) => amenityId != id)
			);
		} else {
			setSelectedAmenitiesId((prev) => [...prev, id]);
		}
	};

	const handleSaveCourt = (courtData: any) => {
		if (editingCourt) {
			setCourts(
				courts.map((c) =>
					c.id === editingCourt.id
						? {
								...courtData,
								id: editingCourt.id,
								visible: editingCourt.visible,
						  }
						: c
				)
			);
			setEditingCourt(null);
		} else {
			setCourts([
				...courts,
				{ ...courtData, id: courts.length + 1, visible: true },
			]);
			setIsAddingCourt(false);
		}
	};

	const toggleCourtVisibility = (courtId: number) => {
		setCourts(
			courts.map((c) =>
				c.id === courtId ? { ...c, visible: !c.visible } : c
			)
		);
	};

	const handleDeleteCourt = (court: any) => {
		setCourtToDelete(court);
		setDeleteConfirmOpen(true);
	};

	const confirmDelete = () => {
		if (courtToDelete) {
			setCourts(courts.filter((c) => c.id !== courtToDelete.id));
			setDeleteConfirmOpen(false);
			setCourtToDelete(null);
		}
	};

	return (
		<AdminLayout>
			<div className="space-y-4">
				{/* Header - Reduced spacing */}
				<div>
					<p className="text-xl font-bold text-primary mt-1">
						Управление информацией об организации и кортах
					</p>
				</div>

				{/* Tabs */}
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="bg-card border border-border">
						<TabsTrigger
							value="info"
							className="data-[state=active]:border-b-2 data-[state=active]:border-accent"
						>
							Общая информация
						</TabsTrigger>
						<TabsTrigger
							value="courts"
							className="data-[state=active]:border-b-2 data-[state=active]:border-accent"
						>
							Корты
						</TabsTrigger>
					</TabsList>

					{/* General Information Tab */}
					<TabsContent value="info" className="mt-4 space-y-4">
						<Card className="p-6">
							<h3 className="text-lg font-semibold text-primary mb-4">
								Основная информация
							</h3>
							<div className="flex flex-col md:flex-row gap-6">
								{/* Photo Section */}
								<div className="flex flex-col items-center gap-3 md:w-48">
									<div className="w-32 h-32 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-border">
										<Building2 className="h-12 w-12 text-muted-foreground" />
									</div>
									<Button size="sm" className="gap-2 w-full">
										<Upload className="h-4 w-4" />
										Загрузить фото
									</Button>
									<p className="text-xs text-muted-foreground text-center">
										JPG, PNG. Макс 5MB
									</p>
								</div>

								{/* Basic Info Fields */}
								<div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="orgName">
											Название организации
										</Label>
										<Input
											id="orgName"
											defaultValue="Book&Play Tennis Club"
										/>
									</div>

									<div className="md:col-span-2 space-y-2">
										<Label htmlFor="description">
											Описание
										</Label>
										<Textarea
											id="description"
											rows={3}
											defaultValue="Современный теннисный клуб с открытыми и закрытыми кортами"
										/>
									</div>
								</div>
							</div>
						</Card>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Card className="p-6">
								<h3 className="text-lg font-semibold text-primary mb-4">
									Адрес
								</h3>
								<div className="space-y-4">
									<div className="w-fit space-y-2">
										<Label htmlFor="city">Город</Label>
										<Input
											id="city"
											defaultValue="Москва"
										/>
									</div>

									<div className="w-fit space-y-2">
										<Label htmlFor="street">Улица</Label>
										<Input
											id="street"
											defaultValue="ул. Спортивная"
										/>
									</div>

									<div className="w-fit space-y-2">
										<Label htmlFor="building">Дом</Label>
										<Input
											id="building"
											defaultValue="12"
										/>
									</div>

									<div className="w-fit space-y-2">
										<Label htmlFor="district">Район</Label>
										<Input
											id="district"
											defaultValue="Центральный"
										/>
									</div>
								</div>
							</Card>

							<Card className="p-6">
								<h3 className="text-lg font-semibold text-primary mb-4">
									Контактная информация
								</h3>
								<div className="space-y-4">
									<div className="w-fit space-y-2">
										<Label htmlFor="phone">Телефон</Label>
										<Input
											id="phone"
											type="tel"
											defaultValue="+7 (495) 123-45-67"
										/>
									</div>

									<div className="w-fit space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											defaultValue="info@bookplay.ru"
										/>
									</div>

									<div className="w-fit space-y-2">
										<Label htmlFor="telegram">
											Telegram
										</Label>
										<Input
											id="telegram"
											defaultValue="@bookplay"
										/>
									</div>

									<div className="w-fit space-y-2">
										<Label htmlFor="whatsapp">
											WhatsApp
										</Label>
										<Input
											id="whatsapp"
											defaultValue="+7 (495) 123-45-67"
										/>
									</div>
								</div>
							</Card>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Card className="p-6">
								<h3 className="text-lg font-semibold text-primary mb-4">
									Время работы
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="openTime">
											Открытие
										</Label>
										<TimePicker />
									</div>

									<div className="space-y-2">
										<Label htmlFor="closeTime">
											Закрытие
										</Label>
										<TimePicker value="23:00" />
									</div>
								</div>
							</Card>

							<Card className="p-6">
								<h3 className="text-lg font-semibold text-primary mb-4">
									Политика возврата
								</h3>
								<div className="space-y-2">
									<Label htmlFor="refundHours">
										Часов до начала
									</Label>
									<Input
										id="refundHours"
										type="number"
										defaultValue="24"
									/>
									<p className="text-xs text-muted-foreground">
										За сколько часов можно вернуть средства
									</p>
								</div>
							</Card>
						</div>

						<Card className="p-6">
							<h3 className="text-lg font-semibold text-primary mb-4">
								Реквизиты
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="account">
										Расчетный счет
									</Label>
									<Input
										id="account"
										defaultValue="40702810123456789012"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="bik">БИК</Label>
									<Input id="bik" defaultValue="044525225" />
								</div>

								<div className="md:col-span-2 space-y-2">
									<Label htmlFor="bank">Банк</Label>
									<Input
										id="bank"
										defaultValue="ПАО Сбербанк"
									/>
								</div>
							</div>
						</Card>

						{/* Amenities */}
						<Card className="p-6">
							<h3 className="text-lg font-semibold text-primary mb-4">
								Удобства
							</h3>
							<div className="grid grid-cols-4 gap-3">
								{amenities.map(({ id, label }) => {
									const className =
										selectedAmenitiesId.includes(id)
											? 'bg-accent border border-transparent transition-all hover:bg-accent/50'
											: 'bg-transparent border border-gray transition-all hover:border-accent/50 ';
									return (
										<div
											onClick={() =>
												handleChangeAmenity(id)
											}
											key={id}
											className={cn(
												'px-4 py-3 rounded-lg text-sm font-medium text-center cursor-pointer',
												className
											)}
										>
											{label}
										</div>
									);
								})}
							</div>
						</Card>

						{/* Save Button */}
						<div className="flex justify-end">
							<Button className="bg-[#1E7A4C] hover:bg-[#1E7A4C]/90 text-white">
								Сохранить изменения
							</Button>
						</div>
					</TabsContent>

					{/* Courts Tab */}
					<TabsContent value="courts" className="mt-4 space-y-4">
						{/* Add Court Button */}
						<div className="flex justify-end">
							<Button
								className="gap-2 bg-[#1E7A4C] hover:bg-[#1E7A4C]/90 text-white"
								onClick={() => setIsAddingCourt(true)}
								disabled={isAddingCourt || editingCourt}
							>
								<Plus className="h-4 w-4" />
								Добавить корт
							</Button>
						</div>

						{/* Add Court Form */}
						{isAddingCourt && (
							<CourtForm
								onSave={handleSaveCourt}
								onCancel={() => setIsAddingCourt(false)}
							/>
						)}

						{/* Courts List - Improved appearance with reduced height */}
						<div className="space-y-3">
							{courts.map((court) => (
								<div key={court.id}>
									{editingCourt?.id === court.id ? (
										<CourtForm
											court={court}
											onSave={handleSaveCourt}
											onCancel={() =>
												setEditingCourt(null)
											}
										/>
									) : (
										<Card className="p-4">
											<div className="flex items-start justify-between mb-2">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
														<Building2 className="h-5 w-5 text-accent" />
													</div>
													<div>
														<h4 className="text-base font-semibold text-primary">
															{court.name}
														</h4>
														<p className="text-sm text-muted-foreground">
															{court.type} •{' '}
															{court.surface} •{' '}
															{court.sport} •{' '}
															{court.address}
														</p>
													</div>
												</div>
												<div className="flex gap-2">
													<Button
														variant="outline"
														size="icon"
														className="h-8 w-8 bg-transparent"
														onClick={() =>
															setEditingCourt(
																court
															)
														}
													>
														<Edit2 className="h-4 w-4" />
													</Button>
													<Button
														variant="outline"
														size="icon"
														className="h-8 w-8 bg-transparent"
														onClick={() =>
															toggleCourtVisibility(
																court.id
															)
														}
													>
														{court.visible ? (
															<Eye className="h-4 w-4" />
														) : (
															<EyeOff className="h-4 w-4" />
														)}
													</Button>
													<Button
														variant="outline"
														size="icon"
														className="text-destructive hover:text-destructive bg-transparent h-8 w-8"
														onClick={() =>
															handleDeleteCourt(
																court
															)
														}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</div>

											<div className="space-y-2 text-sm">
												{/* Court Details */}

												{/* Pricing - Side by side layout */}
												<div className="grid grid-cols-2 gap-4 pt-2">
													<div>
														<p className="text-sm font-medium text-foreground mb-1">
															Будни (Пн-Пт)
														</p>
														{court.pricing.weekday.map(
															(
																slot: any,
																idx: number
															) => (
																<p
																	key={idx}
																	className="text-xs text-muted-foreground"
																>
																	{slot.start}{' '}
																	- {slot.end}
																	:{' '}
																	{slot.price}{' '}
																	₽
																</p>
															)
														)}
													</div>
													<div>
														<p className="text-sm font-medium text-foreground mb-1">
															Выходные (Сб-Вс)
														</p>
														{court.pricing.weekend.map(
															(
																slot: any,
																idx: number
															) => (
																<p
																	key={idx}
																	className="text-xs text-muted-foreground"
																>
																	{slot.start}{' '}
																	- {slot.end}
																	:{' '}
																	{slot.price}{' '}
																	₽
																</p>
															)
														)}
													</div>
												</div>
											</div>
										</Card>
									)}
								</div>
							))}
						</div>
					</TabsContent>
				</Tabs>
			</div>

			<Dialog
				open={deleteConfirmOpen}
				onOpenChange={setDeleteConfirmOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Удалить корт?</DialogTitle>
						<DialogDescription>
							Вы уверены, что хотите удалить {courtToDelete?.name}
							? Это действие нельзя отменить.
						</DialogDescription>
					</DialogHeader>
					<div className="flex gap-3 justify-end mt-4">
						<Button
							variant="outline"
							onClick={() => setDeleteConfirmOpen(false)}
						>
							Отмена
						</Button>
						<Button variant="destructive" onClick={confirmDelete}>
							Удалить
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</AdminLayout>
	);
}
