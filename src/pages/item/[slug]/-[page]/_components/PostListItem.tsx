import BulkButton from '@/components/bulk-button';
import CollectionButton from '@/components/collection-button';
import DownloadButton from '@/components/download-button';
import InstallButton from '@/components/install-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Skeleton } from '@/components/ui/skeleton';
import { archiveItemCoverSrc } from '@/lib/archive-item-cover';
import { __ } from '@/lib/i18n';
import { TypeToItemType } from '@/lib/type-to-slug';
import { TPostItem } from '@/types/item';
import { decodeEntities } from '@wordpress/html-entities';
import { Download, EyeIcon } from 'lucide-react';
import millify from 'millify';
import moment from 'moment';
import { Link } from 'react-router-dom';

export function PostListItemSkeleton() {
	return (
		<div className="flex items-center gap-4 rounded-lg border bg-card p-4">
			<Skeleton className="h-14 w-14 shrink-0 rounded-md" />
			<div className="min-w-0 flex-1 space-y-2">
				<Skeleton className="h-4 w-1/3" />
				<Skeleton className="h-3 w-1/2" />
			</div>
			<Skeleton className="hidden h-8 w-24 sm:block" />
		</div>
	);
}

type Props = {
	item: TPostItem;
	style?: React.CSSProperties;
};

export default function PostListItem({ item, style }: Props) {
	const item_type = TypeToItemType(item.type);
	const detailUrl = `/item/${item_type?.slug}/detail/${item.id}`;
	const author = item.terms?.find(
		(t) => t.taxonomy === 'original_author_tax'
	);
	const coverSrc = archiveItemCoverSrc(item);

	return (
		<div
			className="group flex items-center gap-4 rounded-lg border bg-card p-3 text-card-foreground transition-colors hover:border-ring hover:bg-accent sm:p-4"
			style={style}
		>
			<Link
				to={detailUrl}
				className="shrink-0 no-underline"
			>
				<Avatar className="h-14 w-14 rounded-md">
					<AvatarImage
						src={coverSrc}
						alt={decodeEntities(item.title)}
					/>
					<AvatarFallback className="rounded-md text-xs">
						{decodeEntities(item.title).slice(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
			</Link>

			<Link
				to={detailUrl}
				className="min-w-0 flex-1 no-underline"
			>
				<h3 className="truncate text-sm font-semibold text-card-foreground">
					{decodeEntities(item.title)}
				</h3>
				<div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
					{author && <span>{decodeEntities(author.name)}</span>}
					{item.version && <span>v{item.version}</span>}
					{item.updated && (
						<span>{moment.unix(item.updated).fromNow()}</span>
					)}
					{item.download_count != null && item.download_count > 0 && (
						<span className="flex items-center gap-1">
							<Download className="h-3 w-3" />
							{millify(item.download_count)}
						</span>
					)}
				</div>
			</Link>

			<ButtonGroup className="hidden shrink-0 text-foreground sm:flex">
				<InstallButton
					item={item}
					variant="secondary"
					size="sm"
				/>
				<DownloadButton
					item={item}
					variant="secondary"
					size="sm"
				/>
				{item.product_url && (
					<Button
						variant="secondary"
						size="sm"
						asChild
						title={__('View Original')}
					>
						<a
							href={item.product_url}
							target="_blank"
							rel="noopener noreferrer"
						>
							<EyeIcon width={16} />
						</a>
					</Button>
				)}
				<BulkButton
					item={item}
					size="sm"
				/>
				<CollectionButton
					item={item}
					size="sm"
				/>
			</ButtonGroup>
		</div>
	);
}
