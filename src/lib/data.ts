export type Category = 'dev-front' | 'dev-back' | 'algo-paradigms' | 'dev-tools';

export type Card = {
	theme: string;
	category: Category;
	questions: [string, string, string, string, string];
	answers: [string, string, string, string, string];
};

export const categoryToColor = {
	'dev-front': '#FF46B5',
	'dev-back': '#A96EF4',
	'algo-paradigms': '#A7ED34',
	'dev-tools': '#3FEDE3'
};

export const categoryToText = {
	'dev-front': 'Dev Front',
	'dev-back': 'Dev Back',
	'algo-paradigms': 'Algo et paradigms',
	'dev-tools': 'Dev tools'
};

export const board: Category[] = [
	'dev-back',
	'dev-tools',
	'algo-paradigms',
	'dev-back',
	'dev-tools',
	'algo-paradigms',
	'dev-front',
	'dev-back',
	'dev-front',
	'algo-paradigms',
	'dev-back',
	'dev-tools',
	'algo-paradigms',
	'dev-front',
	'dev-tools',
	'dev-back',
	'algo-paradigms',
	'dev-front',
	'dev-back',
	'dev-front',
	'dev-tools',
	'algo-paradigms',
	'dev-front',
	'dev-back',
	'dev-tools',
	'algo-paradigms',
	'dev-front',
	'algo-paradigms',
	'dev-tools',
	'dev-back',
	'dev-front',
	'algo-paradigms',
	'dev-tools',
	'dev-back',
	'dev-front'
];

export type Team = { name: string; position: number; color: string };
