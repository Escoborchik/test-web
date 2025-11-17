export type ExtraUnit = 'hour' | 'month' | 'day' | 'pcs' | 'service';

export interface Extra {
	id: string;
	title: string;
	price: number;
	unit: ExtraUnit;
	amount: number;
}
