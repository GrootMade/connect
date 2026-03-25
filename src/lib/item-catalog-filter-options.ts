import type { FilterOption } from '@/hooks/use-data-collection';
import { __ } from '@/lib/i18n';
import type { TTerm } from '@/types/item';
import { decodeEntities } from '@wordpress/html-entities';

function sortBySlug(a: TTerm, b: TTerm) {
	return a.slug.localeCompare(b.slug);
}

function mapTaxonomyOptions(terms: TTerm[], taxonomy: string) {
	return terms
		.filter((i) => i.taxonomy === taxonomy)
		.sort(sortBySlug)
		.map((i) => ({
			label: decodeEntities(i.name),
			value: i.slug
		}));
}

function hasTaxonomy(terms: TTerm[], taxonomy: string) {
	return terms.some((i) => i.taxonomy === taxonomy);
}

/**
 * Shared taxonomy filters for item list / browse (same keys the list API expects).
 */
export function buildCatalogFilterOptions(
	terms: TTerm[] | undefined | null,
	opts: { includeAddContent: boolean }
): FilterOption[] {
	if (!terms?.length) {
		return [];
	}
	return [
		{
			id: 'category',
			label: __('Category'),
			enabled: hasTaxonomy(terms, 'fv_category'),
			onBarView: true,
			isMulti: true,
			showAll: true,
			options: mapTaxonomyOptions(terms, 'fv_category')
		},
		{
			id: 'tag',
			label: __('Tag'),
			isMulti: true,
			enabled: hasTaxonomy(terms, 'fv_tag'),
			options: mapTaxonomyOptions(terms, 'fv_tag')
		},
		{
			id: 'compatible_with',
			label: __('Compatible With'),
			isMulti: false,
			enabled: hasTaxonomy(terms, 'fv_compatible_with'),
			options: mapTaxonomyOptions(terms, 'fv_compatible_with')
		},
		{
			id: 'compatible_browsers',
			label: __('Compatible Browsers'),
			isMulti: false,
			enabled: hasTaxonomy(terms, 'fv_compatible_browsers'),
			options: mapTaxonomyOptions(terms, 'fv_compatible_browsers')
		},
		{
			id: 'documentation',
			label: __('Documentation'),
			isMulti: false,
			enabled: hasTaxonomy(terms, 'fv_documentation'),
			options: mapTaxonomyOptions(terms, 'fv_documentation')
		},
		{
			id: 'files_included',
			label: __('Files Included'),
			enabled: hasTaxonomy(terms, 'fv_files_included'),
			isMulti: false,
			options: mapTaxonomyOptions(terms, 'fv_files_included')
		},
		{
			id: 'gutenberg_optimized',
			label: __('Gutenberg Optimized'),
			enabled: hasTaxonomy(terms, 'fv_gutenberg_optimized'),
			isMulti: false,
			options: mapTaxonomyOptions(terms, 'fv_gutenberg_optimized')
		},
		{
			id: 'high_resolution',
			label: __('High Resolution'),
			enabled: hasTaxonomy(terms, 'fv_high_resolution'),
			isMulti: false,
			options: mapTaxonomyOptions(terms, 'fv_high_resolution')
		},
		{
			id: 'product_status',
			label: __('Product Status'),
			enabled: hasTaxonomy(terms, 'fv_product_status'),
			isMulti: false,
			options: mapTaxonomyOptions(terms, 'fv_product_status')
		},
		{
			id: 'software_version',
			label: __('Software Versions'),
			enabled: hasTaxonomy(terms, 'fv_software_version'),
			isMulti: false,
			options: mapTaxonomyOptions(terms, 'fv_software_version')
		},
		{
			id: 'update_status',
			label: __('Update Status'),
			enabled: hasTaxonomy(terms, 'fv_update_status'),
			isMulti: false,
			options: mapTaxonomyOptions(terms, 'fv_update_status')
		},
		{
			id: 'widget_ready',
			label: __('Widget Ready'),
			enabled: hasTaxonomy(terms, 'fv_widget_ready'),
			isMulti: false,
			options: mapTaxonomyOptions(terms, 'fv_widget_ready')
		},
		{
			id: 'access_level',
			label: __('Access'),
			isMulti: true,
			onBarView: true,
			enabled: hasTaxonomy(terms, 'fv_access_level'),
			options: mapTaxonomyOptions(terms, 'fv_access_level')
		},
		{
			id: 'original_author',
			label: __('Access'),
			isMulti: true,
			enabled: hasTaxonomy(terms, 'original_author_tax'),
			options: mapTaxonomyOptions(terms, 'original_author_tax')
		},
		...(opts.includeAddContent
			? ([
					{
						id: 'add_content',
						label: __('Additional Content'),
						isMulti: false,
						enabled: true,
						options: [
							{ label: __('Yes'), value: 'yes' },
							{ label: __('No'), value: 'no' }
						]
					}
				] satisfies FilterOption[])
			: [])
	];
}
