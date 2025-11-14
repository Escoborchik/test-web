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

interface MultiSelectProps {
	options: MultiSelectOption[];
	selected: string[];
	onChange: (selected: string[]) => void;
	placeholder?: string;
	className?: string;
}

export function MultiSelect({
	options,
	selected,
	onChange,
	placeholder = 'Выберите...',
	className,
}: MultiSelectProps) {
	const [open, setOpen] = React.useState(false);

	const handleSelect = (value: string) => {
		const newSelected = selected.includes(value)
			? selected.filter((item) => item !== value)
			: [...selected, value];
		onChange(newSelected);
	};

	const handleClearAll = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		onChange([]);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						'group justify-between font-normal hover:bg-accent/50 transition-colors',
						className
					)}
				>
					<div className="flex items-center gap-1 flex-1 min-w-0">
						{selected.length === 0 ? (
							<span className="text-muted-foreground">
								{placeholder}
							</span>
						) : (
							<span className="text-foreground">
								Выбрано: {selected.length}
							</span>
						)}
					</div>
					<div className="flex items-center gap-1 ml-2 shrink-0">
						{selected.length > 0 && (
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
