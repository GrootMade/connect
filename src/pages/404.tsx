import { AppPageShell } from '@/components/body/page-shell';
import { EmptyState } from '@/components/page/empty-state';
import { __ } from '@/lib/i18n';
import { FileQuestion } from 'lucide-react';

export default function Component() {
	return (
		<AppPageShell
			title={__('Page not found')}
			showTitle
			breadcrump={[{ label: __('404') }]}
		>
			<EmptyState
				icon={FileQuestion}
				title={__('This route does not exist')}
				description={__(
					'The link may be outdated. Use the sidebar or go back to the dashboard.'
				)}
				action={{
					label: __('Go to dashboard'),
					to: '/'
				}}
			/>
		</AppPageShell>
	);
}
