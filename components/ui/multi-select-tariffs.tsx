'use client';

import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, X } from 'lucide-react';
import * as React from 'react';

export interface MultiSelectOption {
	label: string;
	value: string;
}

interface MultiSelectTariffsProps {
	options: MultiSelectOption[];
	selected: string[];
	onChange: (selected: string[]) => void;
	placeholder?: string;
	className?: string;
	defaultToAll?: boolean;
}

export function MultiSelectTariffs({
	options,
	selected,
	onChange,
	defaultToAll,
	placeholder = 'Выберите...',
	className,
}: MultiSelectTariffsProps) {
	const [open, setOpen] = React.useState(false);

	// Если ничего не выбрано и defaultToAll включен, автоматически выбираем все
	React.useEffect(() => {
		if (selected.length === 0 && defaultToAll && options.length > 0) {
			onChange(options.map((opt) => opt.value));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selected.length, defaultToAll, options.length]);

	// Если ничего не выбрано и defaultToAll включен, считаем что все выбраны
	const isAllSelectedByDefault =
		selected.length === 0 && defaultToAll === true;
	const isAllSelectedExplicitly = selected.length === options.length;
	const allSelected = isAllSelectedExplicitly || isAllSelectedByDefault;

	const handleSelectAll = () => {
		if (allSelected && !defaultToAll) {
			// Если все выбраны (явно или по умолчанию), очищаем массив
			onChange([]);
		} else {
			// Иначе выбираем все
			onChange(options.map((opt) => opt.value));
		}
	};

	const handleSelect = (value: string) => {
		// Если ничего не выбрано и defaultToAll включен, добавляем элемент
		// (тем самым убирая состояние "все по умолчанию")
		if (isAllSelectedByDefault) {
			onChange([value]);
		} else {
			const newSelected = selected.includes(value)
				? selected.filter((item) => item !== value)
				: [...selected, value];
			// Если после удаления массив стал пустым и defaultToAll включен, выбираем все
			if (newSelected.length === 0 && defaultToAll) {
				onChange(options.map((opt) => opt.value));
			} else {
				onChange(newSelected);
			}
		}
	};

	const handleRemove = (value: string, e: React.MouseEvent) => {
		e.stopPropagation();
		const newSelected = selected.filter((item) => item !== value);
		// Если после удаления массив стал пустым и defaultToAll включен, выбираем все
		if (newSelected.length === 0 && defaultToAll) {
			onChange(options.map((opt) => opt.value));
		} else {
			onChange(newSelected);
		}
	};

	const handleClearAll = (e: React.MouseEvent) => {
		e.stopPropagation();
		// Если defaultToAll включен, выбираем все вместо очистки
		if (defaultToAll) {
			onChange(options.map((opt) => opt.value));
		} else {
			onChange([]);
		}
	};

	const selectedOptions = options.filter((option) =>
		selected.includes(option.value)
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						'group justify-between font-normal bg-white hover:bg-accent/50 transition-colors py-2',
						className
					)}
				>
					<div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
						{selected.length === 0 && !defaultToAll ? (
							<span className="text-muted-foreground">
								{placeholder}
							</span>
						) : allSelected ? (
							<span className="text-foreground font-medium">
								Все тарифы
							</span>
						) : (
							<span className="text-foreground font-medium">
								{selected.length} из {options.length} тарифов
							</span>
						)}
					</div>
					<div className="flex items-center gap-1 ml-2 shrink-0">
						{allSelected && !defaultToAll && (
							<div
								onClick={handleClearAll}
								onPointerDown={(e) => {
									e.stopPropagation();
								}}
								onMouseDown={(e) => {
									e.stopPropagation();
								}}
								className="flex items-center justify-center rounded-sm p-0.5 hover:bg-destructive/20 hover:border hover:border-destructive/30 transition-colors group/clear cursor-pointer"
							>
								<X className="h-4 w-4 text-muted-foreground group-hover/clear:text-red-600 dark:group-hover/clear:text-red-500 group-hover/clear:scale-110 transition-all cursor-pointer" />
							</div>
						)}
						<ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-2" align="start">
				<div className="space-y-1">
					<div
						className={cn(
							'flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors border-b border-border mb-2',
							allSelected
								? 'bg-accent/60 text-accent-foreground'
								: 'hover:bg-accent/30 hover:text-accent-foreground'
						)}
						onClick={handleSelectAll}
					>
						<div
							className={cn(
								'h-4 w-4 rounded border flex items-center justify-center transition-colors',
								allSelected
									? 'bg-primary border-primary'
									: 'border-input hover:border-accent'
							)}
						>
							{allSelected && (
								<Check className="h-3 w-3 text-primary-foreground" />
							)}
						</div>
						<span className="text-sm flex-1 font-medium">Все</span>
					</div>

					{options.map((option) => {
						const isSelected = selected.includes(option.value);
						return (
							<div
								key={option.value}
								className={cn(
									'flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors',
									isSelected
										? 'bg-accent/60 text-accent-foreground'
										: 'hover:bg-accent/30 hover:text-accent-foreground'
								)}
								onClick={() => handleSelect(option.value)}
							>
								<div
									className={cn(
										'h-4 w-4 rounded border flex items-center justify-center transition-colors',
										isSelected
											? 'bg-primary border-primary'
											: 'border-input hover:border-accent'
									)}
								>
									{isSelected && (
										<Check className="h-3 w-3 text-primary-foreground" />
									)}
								</div>
								<span className="text-sm flex-1">
									{option.label}
								</span>
							</div>
						);
					})}
				</div>
			</PopoverContent>
		</Popover>
	);
}
