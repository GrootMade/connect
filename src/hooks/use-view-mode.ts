import { useCallback, useState } from '@wordpress/element';

export type ViewMode = 'grid' | 'list';

const STORAGE_KEY = 'grootmade_view_mode';

function readStorage(): ViewMode {
	try {
		const v = localStorage.getItem(STORAGE_KEY);
		return v === 'list' ? 'list' : 'grid';
	} catch {
		return 'grid';
	}
}

export default function useViewMode() {
	const [mode, setMode] = useState<ViewMode>(readStorage);

	const setViewMode = useCallback((m: ViewMode) => {
		setMode(m);
		try {
			localStorage.setItem(STORAGE_KEY, m);
		} catch {
			/* noop */
		}
	}, []);

	return { mode, setViewMode } as const;
}
