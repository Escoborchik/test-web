export type CoverType = 'hard' | 'ground' | 'grass' | 'terraflex';
export type SportType = 'tennis' | 'padel' | 'skvosh';
export type PriceDayGroup = 'weekdays' | 'weekends';

export interface PriceSlot {
	id: string;
	dayGroup: PriceDayGroup;
	from: string;
	to: string;
	price: number;
}

export interface Court {
	id: string;
	name: string;
	coverType: CoverType;
	sportType: SportType;
	isIndoor: boolean; // тип корта
	isVisible: boolean;
	street: string;
	image: string;
	prices: Record<'weekdays' | 'weekends', PriceSlot[]>;
	bookingIds: string[];
}
