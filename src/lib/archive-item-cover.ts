import placeholder from '@/lib/placeholder';
import type { TPostItem } from '@/types/item';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * URL for catalog/archive thumbnails: real asset when present, otherwise a generated placeholder image.
 */
export function archiveItemCoverSrc(
	item: Pick<TPostItem, 'title' | 'thumbnail' | 'image'>
): string {
	const raw = item.thumbnail || item.image;
	if (typeof raw === 'string' && raw.trim() !== '') {
		return raw;
	}
	return placeholder(decodeEntities(item.title || '—'));
}
