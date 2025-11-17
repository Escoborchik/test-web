'use client';

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
import { Extra, ExtraUnit } from '@/types';
import { useState } from 'react';

interface ExtraFormEditProps {
	extra: Extra;
	onSave: (data: Extra) => void;
	onCancel: () => void;
}

export const ExtraFormEdit = ({
	extra,
	onSave,
	onCancel,
}: ExtraFormEditProps) => {
	const [formData, setFormData] = useState(extra);

	return (
		<div className="space-y-4 p-4 bg-white rounded-lg border-2 border-primary shadow-md">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
				<div className="space-y-2">
					<Label htmlFor="serviceTitle" className="text-sm">
						Название услуги
					</Label>
					<Input
						id="serviceTitle"
						value={formData.title}
						onChange={(e) =>
							setFormData({ ...formData, title: e.target.value })
						}
						placeholder="Аренда ракеток"
						className="h-9"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="price" className="text-sm">
						Цена (₽)
					</Label>
					<Input
						id="price"
						type="number"
						value={formData.price}
						onChange={(e) =>
							setFormData({
								...formData,
								price: Number.parseInt(e.target.value) || 0,
							})
						}
						placeholder="200"
						className="h-9"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="unit" className="text-sm">
						Единица измерения
					</Label>
					<Select
						value={formData.unit}
						onValueChange={(value) =>
							setFormData({
								...formData,
								unit: value as ExtraUnit,
							})
						}
					>
						<SelectTrigger className="h-9">
							<SelectValue placeholder="Выберите единицу" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="hour">₽/час</SelectItem>
							<SelectItem value="day">₽/день</SelectItem>
							<SelectItem value="month">₽/месяц</SelectItem>
							<SelectItem value="pcs">₽/шт</SelectItem>
							<SelectItem value="service">₽/услуга</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="amount" className="text-sm">
						Количество
					</Label>
					<Input
						id="amount"
						type="number"
						value={formData.amount}
						onChange={(e) =>
							setFormData({
								...formData,
								amount: Number.parseInt(e.target.value) || 1,
							})
						}
						placeholder="1"
						className="h-9"
					/>
				</div>
			</div>

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
					Сохранить
				</Button>
			</div>
		</div>
	);
};
