import { CoverType, SportType } from '@/types';

export const SPORT_TYPE_LABELS: Record<SportType, string> = {
	tennis: 'Теннис',
	padel: 'Падел',
	skvosh: 'Сквош',
};

export const COVER_TYPE_LABELS: Record<CoverType, string> = {
	hard: 'Хард',
	ground: 'Грунт',
	grass: 'Трава',
	terraflex: 'Резина',
};
