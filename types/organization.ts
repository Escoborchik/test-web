import { Address } from './address';
import { Amenities } from './amenities';
import { Contacts } from './contacts';
import { Requisites } from './requisites';

export interface Organization {
	name: string;
	desc: string;
	image: string;
	address: Address;
	contacts: Contacts;
	openTime: string;
	closeTime: string;
	refundHour: number;
	requisites: Requisites;
	amenities: Amenities;
}
