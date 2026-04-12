export interface ColorStop {
	start: string;
	end: string;
	shadow: string;
}

export interface GameTheme {
	white: ColorStop;
	black: ColorStop;
	accent: string;
}

export const themes: Record<string, GameTheme> = {
	classic: {
		white: { start: '#82e19f', end: '#82b90a', shadow: '#00f5ff88' },
		black: { start: '#ff2d78bb', end: '#ff2d78', shadow: '#ff2d7888' },
		accent: '#00f5ff'
	},
	ocean: {
		white: { start: '#67e8f9', end: '#06b6d4', shadow: '#06b6d488' },
		black: { start: '#3b82f6', end: '#1d4ed8', shadow: '#1d4ed888' },
		accent: '#06b6d4'
	},
	sunset: {
		white: { start: '#fde047', end: '#f59e0b', shadow: '#f59e0b88' },
		black: { start: '#c084fc', end: '#9333ea', shadow: '#9333ea88' },
		accent: '#f59e0b'
	},
	synthwave: {
		white: { start: '#f9a8d4', end: '#db2777', shadow: '#db277788' },
		black: { start: '#818cf8', end: '#4f46e5', shadow: '#4f46e588' },
		accent: '#db2777'
	},
	monochrome: {
		white: { start: '#d1d5db', end: '#6b7280', shadow: '#6b728088' },
		black: { start: '#4b5563', end: '#1f2937', shadow: '#1f293788' },
		accent: '#9ca3af'
	},
	forest: {
		white: { start: '#4ade80', end: '#16a34a', shadow: '#16a34a88' },
		black: { start: '#166534', end: '#14532d', shadow: '#14532d88' },
		accent: '#16a34a'
	}
};
