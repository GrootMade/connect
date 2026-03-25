import AddCollectionButton from '@/components/add-collection-dialog';
import ActionLoader from '@/components/ui/action-loader';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader
} from '@/components/ui/card';
import useBookmark from '@/hooks/use-collection';
import { __, sprintf } from '@/lib/i18n';
import { Link } from '@/router';
import { BookmarkCollectionType } from '@/types/bookmark';
import { decodeEntities } from '@wordpress/html-entities';
import { Globe, Layers, LockIcon, Pencil, Trash2 } from 'lucide-react';

type Props = {
	collection: BookmarkCollectionType;
};

export default function Collection({ collection }: Props) {
	const { removeCollection, pendingCollectionDeleteIds } = useBookmark();
	const isDeletePending = pendingCollectionDeleteIds.includes(collection.id);
	return (
		<Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
			<CardHeader className="border-b border-border/80 bg-muted/30">
				<div className="flex flex-row items-start justify-between gap-2">
					<Link
						to="/collection/:cid/:page?"
						params={{ cid: String(collection.id) }}
						className="flex min-w-0 flex-1 items-start gap-2 text-left"
					>
						<span
							className="mt-0.5 shrink-0 text-muted-foreground"
							title={
								collection.public ? __('Public') : __('Private')
							}
						>
							{collection.public ? (
								<Globe
									className="size-4"
									aria-hidden
								/>
							) : (
								<LockIcon
									className="size-4"
									aria-hidden
								/>
							)}
						</span>
						<span className="line-clamp-2 font-heading text-base font-semibold leading-snug">
							{decodeEntities(collection.title)}
						</span>
					</Link>
				</div>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col gap-3 pt-4 text-sm text-muted-foreground">
				{collection.summary && collection.summary.length > 0 ? (
					<p className="line-clamp-2">
						{decodeEntities(collection.summary)}
					</p>
				) : (
					<p className="text-xs italic">{__('No Description')}</p>
				)}
				<div className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
					<Layers className="size-3.5" />
					<span>
						{sprintf(__('%d items'), collection.count ?? 0)}
					</span>
				</div>
			</CardContent>
			<CardFooter className="border-t">
				<div className="flex flex-row gap-2">
					<AddCollectionButton
						collection={collection}
						update={true}
					>
						<Button
							variant="secondary"
							size="sm"
							className="gap-1.5"
						>
							<Pencil className="size-3.5" />
							{__('Edit')}
						</Button>
					</AddCollectionButton>
					<Button
						variant="ghost"
						disabled={isDeletePending}
						onClick={() => {
							if (
								confirm(
									__(
										'Are you sure you want to remove collection?'
									)
								)
							) {
								removeCollection(collection);
							}
						}}
						size="sm"
						className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
					>
						{isDeletePending ? (
							<ActionLoader label={__('Deleting')} />
						) : (
							<>
								<Trash2 className="size-3.5" />
								{__('Delete')}
							</>
						)}
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
