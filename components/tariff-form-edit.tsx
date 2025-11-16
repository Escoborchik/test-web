'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelectWithAll } from '@/components/ui/multi-select-with-all';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimePicker } from '@/components/ui/timepicker';
import { useAppSelector } from '@/store';
import { selectCourts } from '@/store/courtsManagment';
import { PriceDayGroup, PriceSlot, Tariff } from '@/types';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface TariffFromEditProps {
	tariff: Tariff;
	onSave: (tariffData: Tariff) => void;
	onCancel: () => void;
}

export const TariffFormEdit = ({
	tariff,
	onSave,
	onCancel,
}: TariffFromEditProps) => {
	const courts = useAppSelector(selectCourts);

	const [formData, setFormData] = useState(tariff);

	const addPriceSlot = (dayGroup: PriceDayGroup) => {
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
					<div className="grid grid-cols-1 gap-3">
						<div className="space-y-2">
							<Label htmlFor="tariffTitle" className="text-sm">
								Название тарифа
							</Label>
							<Input
								id="tariffTitle"
								value={formData.title}
								onChange={(e) =>
									setFormData({
										...formData,
										title: e.target.value,
									})
								}
								placeholder="Базовый тариф"
								className="h-9"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="courts" className="text-sm">
								Применить к кортам
							</Label>
							<MultiSelectWithAll
								options={courts.map((court) => ({
									label: court.name,
									value: court.id,
								}))}
								selected={formData.courtIds}
								onChange={(selected) =>
									setFormData({
										...formData,
										courtIds: selected,
									})
								}
								placeholder="Выберите корты"
								className="w-full"
							/>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="pricing" className="space-y-3 mt-4">
					<div>
						<div className="flex items-center justify-between mb-2">
							<Label className="text-sm">Будни (Пн-Пт)</Label>
							<Button
								size="sm"
								variant="outline"
								onClick={() => addPriceSlot('weekdays')}
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
									type="number"
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
									className="h-9 w-9 p-0"
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
								onClick={() => addPriceSlot('weekends')}
								className="h-7 text-xs"
							>
								<Plus className="h-3 w-3 mr-1" />
								Добавить
							</Button>
						</div>
						{formData.prices.weekends.map((slot: PriceSlot) => (
							<div key={slot.id} className="flex gap-2 mb-2">
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
									className="h-9 w-9 p-0"
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						))}
					</div>
				</TabsContent>
			</Tabs>

			<div className="flex gap-2 justify-end pt-2 border-t border-border">
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
					{tariff ? 'Сохранить' : 'Добавить'}
				</Button>
			</div>
		</div>
	);
};
