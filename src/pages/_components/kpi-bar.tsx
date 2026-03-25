import useActivation from '@/hooks/use-activation';
import useApiFetch from '@/hooks/use-api-fetch';
import useInstalled from '@/hooks/use-is-installed';
import { API } from '@/lib/api-endpoints';
import { __ } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { ItemStatsResponse } from '@/types/item';
import { HardDrive, Library, RefreshCw, Zap } from 'lucide-react';
import millify from 'millify';

type Props = {
	/** Smaller padding and type for dense dashboards */
	compact?: boolean;
};

export default function KpiBar({ compact = false }: Props) {
	const { data: itemStats } = useApiFetch<ItemStatsResponse>(
		API.item.readStats
	);
	const { list, updateable } = useInstalled();
	const { data: license } = useActivation();

	const chips = [
		{
			icon: Library,
			label: __('Total Assets'),
			value: itemStats?.total != null ? millify(itemStats.total) : '0',
			color: 'hsl(var(--chart-1))'
		},
		{
			icon: HardDrive,
			label: __('Installed'),
			value: String(list?.length ?? 0),
			color: 'hsl(var(--chart-2))'
		},
		{
			icon: RefreshCw,
			label: __('Updates Available'),
			value: String(updateable?.length ?? 0),
			color: 'hsl(var(--chart-3))'
		},
		{
			icon: Zap,
			label: __('Credits Today'),
			value:
				license?.today_limit != null
					? `${license.today_limit_used}/${license.today_limit}`
					: '0/0',
			color: 'hsl(var(--chart-4))'
		}
	];

	return (
		<div
			className={cn(
				'grid grid-cols-2 lg:grid-cols-4',
				compact ? 'gap-2 sm:gap-3' : 'gap-4'
			)}
		>
			{chips.map((chip) => (
				<div
					key={chip.label}
					className={cn(
						'flex items-center rounded-lg border bg-card',
						compact ? 'gap-2.5 p-3' : 'gap-3 p-4'
					)}
				>
					<div
						className={cn(
							'shrink-0 items-center justify-center rounded-md',
							compact ? 'flex h-8 w-8' : 'flex h-9 w-9'
						)}
						style={{ backgroundColor: `${chip.color}20` }}
					>
						<chip.icon
							className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'}
							style={{ color: chip.color }}
						/>
					</div>
					<div className="min-w-0">
						<div
							className={cn(
								'font-bold tabular-nums',
								compact ? 'text-lg' : 'text-xl'
							)}
						>
							{chip.value}
						</div>
						<div
							className={cn(
								'truncate text-muted-foreground',
								compact
									? 'text-[11px] leading-tight'
									: 'text-xs'
							)}
						>
							{chip.label}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
