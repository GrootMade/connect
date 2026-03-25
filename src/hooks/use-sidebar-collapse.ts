import { useCallback, useState } from '@wordpress/element';

const STORAGE_KEY = 'grootmade_sidebar_collapsed';

function readStorage(): boolean {
	try {
		return localStorage.getItem(STORAGE_KEY) === '1';
	} catch {
		return false;
	}
}

export default function useSidebarCollapse() {
	const [collapsed, setCollapsed] = useState(readStorage);

	const toggle = useCallback(() => {
		setCollapsed((prev) => {
			const next = !prev;
			try {
				localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
			} catch {
				// localStorage unavailable
			}
			return next;
		});
	}, []);

	return { collapsed, toggle } as const;
}
