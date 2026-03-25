import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isLinkActive(
	pathname: string,
	href: string | null,
	search: string = ''
) {
	if (!href) return false;

	const qIndex = href.indexOf('?');
	const path = qIndex === -1 ? href : href.slice(0, qIndex);
	const hrefQuery = qIndex === -1 ? null : href.slice(qIndex + 1);

	const pathMatches =
		pathname === path || (path !== '/' && pathname.startsWith(path + '/'));

	if (!pathMatches) return false;

	if (hrefQuery === null) {
		if (path !== '/browse') {
			return true;
		}
		const q = search.startsWith('?') ? search.slice(1) : search;
		return !new URLSearchParams(q).has('order_by');
	}

	const want = new URLSearchParams(hrefQuery);
	const cur = new URLSearchParams(
		search.startsWith('?') ? search.slice(1) : search
	);
	return (
		want.get('order_by') === cur.get('order_by') &&
		(want.get('order') ?? 'desc') === (cur.get('order') ?? 'desc')
	);
}

export function removeEmptyParams(params: Record<string, string | string[]>) {
	return Object.entries(params).reduce(function (acc, [key, val]) {
		if (val.length > 0) {
			acc[key] = val;
		}
		return acc;
	}, {});
}
