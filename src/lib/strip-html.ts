/**
 * Strip HTML tags and decode entities, returning plain text.
 * Useful for card excerpts where we need raw text, not rendered HTML.
 */
export default function stripHtml(html: string): string {
	const doc = new DOMParser().parseFromString(html, 'text/html');
	return doc.body.textContent?.trim() ?? '';
}
