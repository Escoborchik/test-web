'use client';

import { useState } from 'react';

import { Court, CoverType, PriceDayGroup, PriceSlot, SportType } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { TimePicker } from '@/components/ui/timepicker';
import { COVER_TYPE_LABELS, SPORT_TYPE_LABELS } from '@/constants';
import { Plus, X } from 'lucide-react';

interface CourtFormCreateProps {
	onSave: (data: Court) => void;
	onCancel: () => void;
}

export const CourtFormCreate = ({ onSave, onCancel }: CourtFormCreateProps) => {
	const [formData, setFormData] = useState<Court>({
		id: crypto.randomUUID(),
		name: 'Корт',
		coverType: 'hard',
		sportType: 'tennis',
		isIndoor: true,
		isVisible: true,
		street: 'просп. Панорамный, 8',
		image: '',
		prices: {
			weekdays: [],
			weekends: [],
		},
	});

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
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label htmlFor="courtName" className="text-sm">
						Название
					</Label>
					<Input
						id="courtName"
						value={formData.name}
						onChange={(e) =>
							handleChangeData('name', e.target.value)
						}
						placeholder="Корт №1"
						className="h-9"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="surface" className="text-sm">
						Покрытие
					</Label>
					<Select
						value={formData.coverType}
						onValueChange={(value) =>
							handleChangeData('coverType', value as CoverType)
						}
					>
						<SelectTrigger id="surface" className="h-9">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.keys(COVER_TYPE_LABELS).map(
								(variantOfCover) => (
									<SelectItem value={variantOfCover}>
										{
											COVER_TYPE_LABELS[
												variantOfCover as CoverType
											]
										}
									</SelectItem>
								)
							)}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="sport" className="text-sm">
						Вид спорта
					</Label>
					<Select
						value={formData.sportType}
						onValueChange={(value) =>
							handleChangeData('sportType', value as SportType)
						}
					>
						<SelectTrigger id="sport" className="h-9">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.keys(SPORT_TYPE_LABELS).map(
								(variantOfSport) => (
									<SelectItem value={variantOfSport}>
										{
											SPORT_TYPE_LABELS[
												variantOfSport as SportType
											]
										}
									</SelectItem>
								)
							)}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="type" className="text-sm">
						Тип
					</Label>
					<Select
						value={formData.isIndoor ? 'open' : 'close'}
						onValueChange={(value) =>
							handleChangeData(
								'isIndoor',
								value === 'open' ? true : false
							)
						}
					>
						<SelectTrigger id="type" className="h-9">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="open">Открытый</SelectItem>
							<SelectItem value="close">Закрытый</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="address" className="text-sm">
						Улица
					</Label>
					<Input
						id="address"
						value={formData.street}
						onChange={(e) =>
							handleChangeData('street', e.target.value)
						}
						placeholder="ул. Спортивная, 12"
						className="h-9"
					/>
				</div>

				<div className="md:col-span-2 space-y-2">
					<Label htmlFor="photo" className="text-sm">
						Фото корта
					</Label>
					<div className="flex gap-2">
						<Input
							id="photo"
							type="file"
							accept="image/*"
							onChange={handlePhotoUpload}
							className="h-9 cursor-pointer"
						/>
						{formData.image && (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => handleChangeData('image', '')}
								className="h-9"
							>
								<X className="h-4 w-4" />
							</Button>
						)}
					</div>
					{formData.image && (
						<div className="mt-2">
							<img
								src={formData.image || '/placeholder.svg'}
								alt="Preview"
								className="h-20 w-32 object-cover rounded border"
							/>
						</div>
					)}
				</div>
				{/* Pricing */}
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
									className="h-8"
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
							<Label className="text-sm">Выходные (Сб-Вс)</Label>
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
							<div key={slot.id} className="flex gap-2 mb-2">
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
									className="h-8"
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
			</div>

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
