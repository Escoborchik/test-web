'use client';

import { Court, CoverType, PriceDayGroup, PriceSlot, SportType } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { TimePicker } from '@/components/ui/timepicker';
import { COVER_TYPE_LABELS, SPORT_TYPE_LABELS } from '@/constants';
import { Building2, Plus, Upload, X } from 'lucide-react';

interface CourtFormEditProps {
	court: Court;
	onSave: (data: Court) => void;
	onCancel: () => void;
}

export const CourtFormEdit = ({
	court,
	onSave,
	onCancel,
}: CourtFormEditProps) => {
	const [formData, setFormData] = useState<Court>(court);

	const handleChangeData = <Field extends keyof Court>(
		field: Field,
		value: Court[Field]
	) => {
		setFormData((prevState) => ({
			...prevState,
			[field]: value,
		}));
	};

	const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setFormData({ ...formData, image: reader.result as string });
			};
			reader.readAsDataURL(file);
		}
	};

	const handleAddSlot = (dayGroup: PriceDayGroup) => {
		setFormData((prev) => ({
			...prev,
			prices: {
				...prev.prices,
				[dayGroup]: [
					...prev.prices[dayGroup],
					{
						id: crypto.randomUUID(),
						dayGroup,
						from: '08:00',
						to: '23:00',
						price: 1500,
					},
				],
			},
		}));
	};

	const removePriceSlot = (type: PriceDayGroup, id: string) => {
		setFormData((prev: any) => ({
			...prev,
			prices: {
				...prev.prices,
				[type]: prev.prices[type].filter(
					(slot: PriceSlot) => slot.id !== id
				),
			},
		}));
	};

	const updatePriceSlot = (
		type: PriceDayGroup,
		id: string,
		field: keyof PriceSlot,
		value: any
	) => {
		setFormData((prev: any) => ({
			...prev,
			prices: {
				...prev.prices,
				[type]: prev.prices[type].map((slot: PriceSlot) =>
					id === slot.id ? { ...slot, [field]: value } : slot
				),
			},
		}));
	};

	return (
		<div className="space-y-4 p-4 bg-white rounded-lg border-2 border-primary shadow-md">
			<Tabs defaultValue="basic" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="basic">Основная информация</TabsTrigger>
					<TabsTrigger value="pricing">Ценовая политика</TabsTrigger>
				</TabsList>

				<TabsContent value="basic" className="space-y-3 mt-4">
					<div className="flex gap-3">
						<div className="lg:w-64 shrink-0">
							<h3 className="text-base font-semibold text-primary mb-3">
								Фото корта
							</h3>
							<div className="flex flex-col items-center gap-3">
								<div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center border-2 border-accent/20">
									<Building2 className="h-12 w-12 text-muted-foreground" />
								</div>
								<Button className="gap-2 h-9 w-full">
									<Upload className="h-4 w-4" />
									Загрузить фото
								</Button>
								<p className="text-xs text-muted-foreground text-center">
									JPG, PNG. Макс 5MB
								</p>
							</div>
						</div>
						{/* <div className="md:col-span-2 space-y-2">
							<Label htmlFor="photo" className="text-sm">
								Фото корта
							</Label>
							<div className="flex flex-col items-center gap-3">
								<div className="w-32 h-32 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-border">
									{formData.image ? (
										<img
											src={
												formData.image ||
												'/placeholder.svg'
											}
											alt="Preview"
											className="w-full h-full object-cover rounded-lg"
										/>
									) : (
										<Building2 className="h-12 w-12 text-muted-foreground" />
									)}
								</div>
								<div className="flex gap-2 w-full">
									<Button
										type="button"
										size="sm"
										className="gap-2 flex-1"
										onClick={() =>
											document
												.getElementById('photo')
												?.click()
										}
									>
										<Upload className="h-4 w-4" />
										Загрузить фото
									</Button>
									{formData.image && (
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												setFormData({
													...formData,
													image: '',
												})
											}
										>
											<X className="h-4 w-4" />
										</Button>
									)}
								</div>
								<Input
									id="photo"
									type="file"
									accept="image/*"
									onChange={handlePhotoUpload}
									className="hidden"
								/>
								<p className="text-xs text-muted-foreground text-center">
									JPG, PNG. Макс 5MB
								</p>
							</div>
						</div> */}
						<div className="flex-1 flex-col">
							<h3 className="text-base font-semibold text-primary mb-3">
								Данные о корте
							</h3>
							<div className="flex flex-col gap-4">
								<div className="flex gap-2">
									<div className="flex-1 space-y-2">
										<Label
											htmlFor="courtName"
											className="text-sm"
										>
											Название
										</Label>
										<Input
											id="courtName"
											value={formData.name}
											onChange={(e) =>
												handleChangeData(
													'name',
													e.target.value
												)
											}
											placeholder="Корт №1"
											className="h-9"
										/>
									</div>

									<div className="flex-1 space-y-2">
										<Label
											htmlFor="address"
											className="text-sm"
										>
											Улица
										</Label>
										<Input
											id="address"
											value={formData.street}
											onChange={(e) =>
												handleChangeData(
													'street',
													e.target.value
												)
											}
											placeholder="ул. Спортивная, 12"
											className="h-9"
										/>
									</div>
								</div>

								<div className="flex justify-between">
									<div className="space-y-2">
										<Label
											htmlFor="sport"
											className="text-sm"
										>
											Вид спорта
										</Label>
										<Select
											value={formData.sportType}
											onValueChange={(value) =>
												handleChangeData(
													'sportType',
													value as SportType
												)
											}
										>
											<SelectTrigger
												id="sport"
												className="h-9 min-w-[120px]"
											>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{Object.keys(
													SPORT_TYPE_LABELS
												).map((variantOfSport) => (
													<SelectItem
														value={variantOfSport}
													>
														{
															SPORT_TYPE_LABELS[
																variantOfSport as SportType
															]
														}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label
											htmlFor="type"
											className="text-sm"
										>
											Тип
										</Label>
										<Select
											value={
												formData.isIndoor
													? 'open'
													: 'close'
											}
											onValueChange={(value) =>
												handleChangeData(
													'isIndoor',
													value === 'open'
														? true
														: false
												)
											}
										>
											<SelectTrigger
												id="type"
												className="h-9 min-w-[120px]"
											>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="open">
													Открытый
												</SelectItem>
												<SelectItem value="close">
													Закрытый
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label
											htmlFor="surface"
											className="text-sm"
										>
											Покрытие
										</Label>
										<Select
											value={formData.coverType}
											onValueChange={(value) =>
												handleChangeData(
													'coverType',
													value as CoverType
												)
											}
										>
											<SelectTrigger
												id="surface"
												className="h-9 min-w-[120px]"
											>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{Object.keys(
													COVER_TYPE_LABELS
												).map((variantOfCover) => (
													<SelectItem
														value={variantOfCover}
													>
														{
															COVER_TYPE_LABELS[
																variantOfCover as CoverType
															]
														}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
						</div>
					</div>
				</TabsContent>

				{/* Pricing */}
				<TabsContent value="pricing" className="space-y-3 mt-4">
					<div className="space-y-3">
						<div>
							<div className="flex items-center justify-between mb-2">
								<Label className="text-sm">Будни (Пн-Пт)</Label>
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleAddSlot('weekdays')}
									className="h-7 text-xs"
								>
									<Plus className="h-3 w-3 mr-1" />
									Добавить
								</Button>
							</div>
							{formData.prices.weekdays.map((slot: PriceSlot) => (
								<div key={slot.id} className="flex gap-2 mb-2">
									<div className="flex-1">
										<TimePicker
											value={slot.from}
											onChange={(value) =>
												updatePriceSlot(
													'weekdays',
													slot.id,
													'from',
													value
												)
											}
										/>
									</div>

									<div className="flex-1">
										<TimePicker
											value={slot.to}
											onChange={(value) =>
												updatePriceSlot(
													'weekdays',
													slot.id,
													'to',
													value
												)
											}
										/>
									</div>
									<Input
										value={slot.price}
										onChange={(e) =>
											updatePriceSlot(
												'weekdays',
												slot.id,
												'price',
												Number.parseInt(e.target.value)
											)
										}
										placeholder="Цена"
										className="h-9 flex-1"
									/>
									<Button
										size="sm"
										variant="ghost"
										onClick={() =>
											removePriceSlot('weekdays', slot.id)
										}
										className="h-8 w-8 p-0"
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>

						<div>
							<div className="flex items-center justify-between mb-2">
								<Label className="text-sm">
									Выходные (Сб-Вс)
								</Label>
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleAddSlot('weekends')}
									className="h-7 text-xs"
								>
									<Plus className="h-3 w-3 mr-1" />
									Добавить
								</Button>
							</div>
							{formData.prices.weekends.map((slot: PriceSlot) => (
								<div
									key={slot.id}
									className="flex items-center gap-2 mb-2"
								>
									<div className="flex-1">
										<TimePicker
											value={slot.from}
											onChange={(value) =>
												updatePriceSlot(
													'weekends',
													slot.id,
													'from',
													value
												)
											}
										/>
									</div>

									<div className="flex-1">
										<TimePicker
											value={slot.to}
											onChange={(value) =>
												updatePriceSlot(
													'weekends',
													slot.id,
													'to',
													value
												)
											}
										/>
									</div>
									<Input
										value={slot.price}
										onChange={(e) =>
											updatePriceSlot(
												'weekends',
												slot.id,
												'price',
												Number.parseInt(e.target.value)
											)
										}
										placeholder="Цена"
										className="h-9 flex-1"
									/>
									<Button
										size="sm"
										variant="ghost"
										onClick={() =>
											removePriceSlot('weekends', slot.id)
										}
										className="h-8 w-8 p-0"
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>
					</div>
				</TabsContent>
			</Tabs>

			<div className="flex gap-2 justify-end">
				<Button
					variant="outline"
					onClick={onCancel}
					className="h-8 bg-transparent"
				>
					Отмена
				</Button>
				<Button
					className="bg-[#1E7A4C] hover:bg-[#1E7A4C]/90 text-white h-8"
					onClick={() => onSave(formData)}
				>
					Сохранить
				</Button>
			</div>
		</div>
	);
};
