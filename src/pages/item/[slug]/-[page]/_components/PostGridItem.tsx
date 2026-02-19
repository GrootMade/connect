import BulkButton from '@/components/bulk-button';
import CollectionButton from '@/components/collection-button';
import InstallButton from '@/components/install-button';
import { Skeleton } from '@/components/ui/skeleton';
import { __ } from '@/lib/i18n';
import placeholder from '@/lib/placeholder';
import stripHtml from '@/lib/strip-html';
import { TypeToItemType } from '@/lib/type-to-slug';
import { TPostItem } from '@/types/item';
import { decodeEntities } from '@wordpress/html-entities';
import { Clock, Download, GitFork, Tag, User } from 'lucide-react';
import millify from 'millify';
import moment from 'moment';
import { Link } from 'react-router-dom';

export function PostGridItemSkeleton() {
	return (
		<div className="flex flex-col gap-4 rounded-lg border bg-card p-5">
			<div className="flex items-center gap-3">
				<Skeleton className="h-8 w-8 rounded-md" />
				<Skeleton className="h-5 w-40" />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-3.5 w-full" />
				<Skeleton className="h-3.5 w-3/4" />
			</div>
			<div className="mt-auto space-y-1.5">
				<Skeleton className="h-3 w-full" />
				<Skeleton className="h-3 w-full" />
				<Skeleton className="h-3 w-full" />
			</div>
		</div>
	);
}

type Props = {
	item: TPostItem;
};

export default function PostGridItem({ item }: Props) {
	const item_type = TypeToItemType(item.type);
	const detailUrl = `/item/${item_type?.slug}/detail/${item.id}`;
	const summary = stripHtml(item.summary);
	const categories = item.terms
		?.filter((term) => term.taxonomy === 'fv_category')
		.map((term) => decodeEntities(term.name));
	const author = item.terms?.find(
		(t) => t.taxonomy === 'original_author_tax'
	);

	return (
		<Link
			to={detailUrl}
			className="group relative flex animate-reveal flex-col items-start gap-4 rounded-lg border bg-card p-5 text-card-foreground no-underline transition duration-100 ease-out after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:border-4 after:border-background hover:bg-accent"
		>
			{/* Header: icon + title + hover actions */}
			<div className="relative flex w-full flex-row items-start gap-3">
				<img
					src={
						item.thumbnail ?? item.image ?? placeholder(item.title)
					}
					alt={item.title}
					className="h-8 w-8 shrink-0 rounded-md object-cover"
				/>
				<div className="min-w-0 flex-1">
					<h3 className="line-clamp-1 text-base font-semibold">
						{item.title}
					</h3>
					{item.original_title && (
						<div className="flex items-center gap-1 text-xs text-muted-foreground">
							<GitFork className="h-2.5 w-2.5 shrink-0" />
							<span className="truncate">
								{item.original_title}
							</span>
						</div>
					)}
				</div>

				{/* Hover action buttons */}
				<div className="absolute right-0 top-0 flex items-center gap-1 opacity-0 blur-sm transition-all duration-200 group-hover:opacity-100 group-hover:blur-none">
					<InstallButton item={item} />
					<BulkButton item={item} />
					<CollectionButton
						item={item}
						size="icon"
					/>
				</div>
			</div>

			{/* Dual-state content */}
			<div className="relative flex w-full flex-1 flex-col">
				{/* Default state: summary + stats */}
				<div className="flex flex-1 flex-col gap-3 transition-opacity duration-200 group-hover:opacity-0">
					<div className="line-clamp-2 min-h-[2.5rem] text-sm/normal text-muted-foreground">
						{summary}
					</div>
					<ul className="mt-auto w-full text-xs">
						{item.version && (
							<li className="flex items-center gap-3 py-1">
								<p className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
									<Tag className="h-[1.1em] w-[1.1em] shrink-0 opacity-75" />
									<span className="flex-1 truncate">
										{__('Version')}
									</span>
								</p>
								<hr className="min-w-2 flex-1 border-dashed" />
								<span className="shrink-0 font-medium tabular-nums">
									{item.version}
								</span>
							</li>
						)}
						{item.updated && (
							<li className="flex items-center gap-3 py-1">
								<p className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
									<Clock className="h-[1.1em] w-[1.1em] shrink-0 opacity-75" />
									<span className="flex-1 truncate">
										{__('Updated')}
									</span>
								</p>
								<hr className="min-w-2 flex-1 border-dashed" />
								<span className="shrink-0 font-medium tabular-nums">
									{moment.unix(item.updated).fromNow()}
								</span>
							</li>
						)}
						{author && (
							<li className="flex items-center gap-3 py-1">
								<p className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
									<User className="h-[1.1em] w-[1.1em] shrink-0 opacity-75" />
									<span className="flex-1 truncate">
										{__('Author')}
									</span>
								</p>
								<hr className="min-w-2 flex-1 border-dashed" />
								<span className="shrink-0 font-medium tabular-nums">
									{decodeEntities(author.name)}
								</span>
							</li>
						)}
						{item.download_count != null &&
							item.download_count > 0 && (
								<li className="flex items-center gap-3 py-1">
									<p className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
										<Download className="h-[1.1em] w-[1.1em] shrink-0 opacity-75" />
										<span className="flex-1 truncate">
											{__('Downloads')}
										</span>
									</p>
									<hr className="min-w-2 flex-1 border-dashed" />
									<span className="shrink-0 font-medium tabular-nums">
										{millify(item.download_count)}
									</span>
								</li>
							)}
					</ul>
				</div>

				{/* Hover state: extended summary + categories / fork info */}
				<div className="absolute inset-0 flex flex-col gap-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
					<div className="line-clamp-4 text-sm/normal text-muted-foreground">
						{summary}
					</div>
					<div className="mt-auto flex flex-wrap items-center gap-2">
						{item.is_forked && item.original_title && (
							<span className="flex items-center gap-1 text-sm text-muted-foreground">
								<GitFork className="h-3.5 w-3.5" />
								{item.original_title}
							</span>
						)}
						{categories && categories.length > 0 && (
							<div className="flex flex-wrap items-center gap-1.5">
								{categories.slice(0, 3).map((cat) => (
									<span
										key={cat}
										className="rounded-md border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
									>
										{cat}
									</span>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</Link>
	);
}
