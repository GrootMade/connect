import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ActivationStatusToString } from '@/config/activation-status';
import useActivation from '@/hooks/use-activation';
import { __, sprintf } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Link } from '@/router';
import { decodeEntities } from '@wordpress/html-entities';
import moment from 'moment';
import type { ReactNode } from 'react';
import { ClassNameValue } from 'tailwind-merge';

type Props = {
	className?: ClassNameValue;
	variant?: 'default' | 'compact';
};

function StatBox({
	label,
	children,
	compact,
	capitalizeValue = false
}: {
	label: string;
	children: ReactNode;
	compact?: boolean;
	capitalizeValue?: boolean;
}) {
	return (
		<div
			className={cn(
				'rounded-sm border border-dashed border-muted-foreground',
				compact ? 'p-2.5' : 'p-4'
			)}
		>
			<div
				className={cn(
					compact ? 'text-sm font-medium' : 'text-lg',
					capitalizeValue && 'capitalize'
				)}
			>
				{children}
			</div>
			<div
				className={cn(
					'text-muted-foreground',
					compact ? 'text-xs' : 'text-sm'
				)}
			>
				{label}
			</div>
		</div>
	);
}

export default function LicenseStatus({
	className,
	variant = 'default'
}: Props) {
	const { data } = useActivation();
	const compact = variant === 'compact';

	if (!data || data.status === 'not-activated') {
		return (
			<Card
				className={cn(
					'flex flex-col gap-4',
					compact
						? 'p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6'
						: 'p-8',
					className
				)}
			>
				<div className="min-w-0 flex-1">
					<h3
						className={cn(
							'font-semibold',
							compact ? 'text-base' : 'text-2xl'
						)}
					>
						{__('Activate your license')}
					</h3>
					<p
						className={cn(
							'text-muted-foreground',
							compact ? 'mt-1 text-xs sm:text-sm' : 'mt-2'
						)}
					>
						{__(
							'Activate your plan to install, update, and download premium assets from the dashboard.'
						)}
					</p>
				</div>
				<div className="shrink-0">
					<Link
						to="/activation"
						className={cn(
							'inline-flex items-center rounded-md border font-medium no-underline transition-colors hover:bg-muted',
							compact
								? 'px-3 py-2 text-xs sm:text-sm'
								: 'px-4 py-2 text-sm'
						)}
					>
						{__('Go to Activation')}
					</Link>
				</div>
			</Card>
		);
	}

	return (
		<Card
			className={cn(
				'flex flex-col',
				compact ? 'gap-4 p-4 sm:p-5' : 'justify-between gap-6 p-8',
				className
			)}
		>
			<div className="space-y-1">
				<h2
					className={cn(
						'flex flex-wrap items-center gap-2 font-semibold',
						compact ? 'text-lg' : 'text-3xl'
					)}
				>
					<span className="break-words">{data?.plan_title}</span>
					<Badge
						variant="outline"
						className="border-green-600 bg-green-600/10 text-green-600"
					>
						{data?.expires > 0
							? data?.plan_type === 'recurring'
								? __('Monthly Plan')
								: __('One-Time Plan')
							: __('Lifetime Plan')}
					</Badge>
				</h2>
				{data?.plan_detail ? (
					<div
						className={cn(
							'text-muted-foreground',
							compact ? 'line-clamp-2 text-xs sm:text-sm' : ''
						)}
					>
						{decodeEntities(data.plan_detail)}
					</div>
				) : null}
			</div>
			<div
				className={cn(
					compact
						? 'grid grid-cols-2 gap-2 sm:grid-cols-3'
						: 'flex flex-col gap-4 lg:flex-row lg:flex-wrap'
				)}
			>
				<StatBox
					label={__('Status')}
					capitalizeValue
					compact={compact}
				>
					{ActivationStatusToString[data?.status]}
				</StatBox>
				<StatBox
					label={__('Daily Today')}
					compact={compact}
				>
					{data?.today_limit?.toLocaleString()}
				</StatBox>
				{data?.plan_type === 'onetime' && (
					<StatBox
						label={__('All-Time Limit')}
						compact={compact}
					>
						{data?.total_limit?.toLocaleString()}
					</StatBox>
				)}
				<StatBox
					label={__('Updates')}
					compact={compact}
				>
					{__('Lifetime')}
				</StatBox>
				<StatBox
					label={__('Expires')}
					compact={compact}
				>
					{data?.expires > 0
						? moment.unix(data?.expires).format('D MMM, YYYY')
						: __('Never')}
				</StatBox>
			</div>
			<div
				className={cn(
					compact
						? ''
						: 'lg:flex lg:flex-row lg:items-center lg:gap-12'
				)}
			>
				<div className="flex min-w-0 flex-1 flex-col gap-1.5">
					<div className="space-x-1 text-sm">
						<span className="text-muted-foreground">
							{__('Credits used:')}
						</span>
						<span>
							{sprintf(
								__('%s of %s'),
								data?.today_limit_used?.toLocaleString() ?? 0,
								data?.today_limit?.toLocaleString() ?? 0
							)}
						</span>
					</div>
					{data && (
						<Progress
							className={compact ? 'h-1.5' : undefined}
							value={
								data.today_limit > 0
									? 100 *
										(data.today_limit_used /
											data.today_limit)
									: 0
							}
						/>
					)}
				</div>
			</div>
			<div
				className={cn(
					'text-muted-foreground',
					compact ? 'text-xs' : ''
				)}
			>
				{sprintf(__('Install ID: %s'), data.activation_key)}
			</div>
		</Card>
	);
}
