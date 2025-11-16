import { PriceSlot } from '@/types/court';

export interface Tariff {
	id: string;
	title: string;
	prices: Record<'weekdays' | 'weekends', PriceSlot[]>;
	courtIds: string[];
}
