import { AppPageShell } from '@/components/body/page-shell';
import { EmptyState } from '@/components/page/empty-state';
import { __ } from '@/lib/i18n';
import { Inbox } from 'lucide-react';

export default function Component() {
	const pageTitle = __('Requests');
	const pageDescription = __(
		'Request new items and track status — this area is still in development.'
	);
	return (
		<AppPageShell
			title={pageTitle}
			compactListing
			showTitle={false}
			breadcrump={[{ label: __('Requests') }]}
		>
			<div className="flex flex-col gap-3">
				<div className="rounded-lg border border-border/80 bg-card p-3 shadow-sm sm:p-4">
					<div className="min-w-0">
						<h1 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
							{pageTitle}
						</h1>
						<p className="mt-0.5 text-xs leading-snug text-muted-foreground sm:text-sm">
							{pageDescription}
						</p>
					</div>
				</div>
				<EmptyState
					icon={Inbox}
					title={__('Coming soon')}
					description={__(
						'You can still open the Requests library from the sidebar to explore the catalog.'
					)}
					action={{
						label: __('Open requests'),
						to: '/item/request'
					}}
				/>
			</div>
		</AppPageShell>
	);
}
