import { siteConfig } from '@/config/site';
import useActivation from '@/hooks/use-activation';
import useNotification, {
	type NotificationItem
} from '@/hooks/use-notification';
import { __ } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useState } from '@wordpress/element';
import {
	ArrowUpRight,
	Bell,
	CheckCircle,
	ChevronDown,
	ChevronUp,
	CrownIcon,
	Info,
	Loader2,
	X,
	XCircle
} from 'lucide-react';
import { Button } from './ui/button';

function NotificationItemRow({ item }: { item: NotificationItem }) {
	const { remove } = useNotification();

	return (
		<div className="flex items-center gap-3 px-3 py-2">
			<div className="shrink-0">
				{item.status === 'success' && (
					<CheckCircle className="size-4 text-green-500" />
				)}
				{item.status === 'error' && (
					<XCircle className="size-4 text-destructive" />
				)}
				{item.status === 'loading' && (
					<Loader2 className="size-4 animate-spin text-primary" />
				)}
				{item.status === 'info' && (
					<Info className="size-4 text-blue-500" />
				)}
			</div>

			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-medium">{item.title}</p>
				{item.description && (
					<p className="truncate text-xs text-muted-foreground">
						{item.description}
					</p>
				)}
			</div>

			<Button
				size="sm"
				variant="ghost"
				className="h-auto shrink-0 p-1 text-muted-foreground hover:text-foreground"
				onClick={() => remove(item.uid)}
			>
				<X className="size-3.5" />
			</Button>
		</div>
	);
}

function NotificationUpgradeBanner() {
	const { data, activated, active } = useActivation();
	const delaySeconds = data?.download_delay_seconds ?? 0;

	if (!activated || !active || delaySeconds <= 0) return null;

	return (
		<a
			href={`${siteConfig.provider}/pricing`}
			target="_blank"
			rel="noopener noreferrer"
			className="flex items-center gap-2 border-b bg-amber-500/10 px-3 py-2 no-underline transition-colors hover:bg-amber-500/15"
		>
			<CrownIcon className="size-3.5 shrink-0 text-amber-500" />
			<span className="flex-1 text-xs text-muted-foreground">
				<strong className="font-medium text-foreground">
					{__('Skip the wait')}
				</strong>
				{' — '}
				{__('Upgrade to remove download delays.')}
			</span>
			<ArrowUpRight className="size-3 shrink-0 text-muted-foreground" />
		</a>
	);
}

export default function NotificationManager() {
	const {
		notifications,
		activeItems,
		completedItems,
		clearCompleted,
		open,
		setOpen
	} = useNotification();
	const [collapsed, setCollapsed] = useState(false);

	if (!open || notifications.length === 0) return null;

	const hasActive = activeItems.length > 0;

	return (
		<div
			className={cn(
				'fixed bottom-4 right-4 z-50 w-80 overflow-hidden rounded-lg border bg-background shadow-lg',
				'animate-in slide-in-from-bottom-4 fade-in duration-300'
			)}
		>
			{/* Header */}
			<div className="flex items-center justify-between border-b bg-muted/50 px-3 py-2">
				<div className="flex items-center gap-2">
					<Bell className="size-4" />
					<span className="text-sm font-medium">
						{hasActive
							? `${activeItems.length} ${activeItems.length > 1 ? __('tasks') : __('task')} ${__('in progress')}...`
							: __('Notifications')}
					</span>
				</div>
				<div className="flex items-center gap-1">
					<Button
						size="sm"
						variant="ghost"
						className="h-auto p-1"
						onClick={() => setCollapsed((c) => !c)}
					>
						{collapsed ? (
							<ChevronUp className="size-4" />
						) : (
							<ChevronDown className="size-4" />
						)}
					</Button>
					<Button
						size="sm"
						variant="ghost"
						className="h-auto p-1"
						onClick={() => setOpen(false)}
					>
						<X className="size-4" />
					</Button>
				</div>
			</div>

			{/* Items */}
			{!collapsed && (
				<>
					{hasActive && <NotificationUpgradeBanner />}
					<div className="max-h-72 divide-y divide-border overflow-y-auto">
						{notifications.map((item) => (
							<NotificationItemRow
								key={item.uid}
								item={item}
							/>
						))}
					</div>

					{completedItems.length > 0 && (
						<div className="border-t border-border px-3 py-2">
							<Button
								size="sm"
								variant="ghost"
								className="text-xs text-muted-foreground"
								onClick={clearCompleted}
							>
								{__('Clear completed')}
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
