import LanguageSelector from '@/components/language-select';
import ModeToggle from '@/components/mode-toggle';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { siteConfig } from '@/config/site';
import useTheme from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Textfit } from 'react-textfit';
import { SidebarNav } from './SidebarNav';

type Props = {
	showLogo?: boolean;
	collapsed?: boolean;
	onToggleCollapse?: () => void;
};

export function Sidebar({
	showLogo = true,
	collapsed = false,
	onToggleCollapse
}: Props) {
	const { effectiveTheme } = useTheme();
	return (
		<aside className="flex h-full w-full flex-col overflow-hidden">
			{showLogo && (
				<div
					className={cn(
						'items-center border-b border-border/60 lg:border-0',
						collapsed
							? 'flex justify-center py-3'
							: 'justify-between py-5 lg:pb-4 lg:pt-2'
					)}
				>
					<Link
						to="/"
						className={cn(
							'flex items-center leading-tight',
							collapsed ? 'justify-center' : 'gap-3'
						)}
					>
						{siteConfig.logo[effectiveTheme]?.length > 0 ? (
							<>
								<img
									src={siteConfig.logo[effectiveTheme]}
									alt={siteConfig.name}
									className={cn(
										'w-auto transition-[height] duration-200',
										collapsed ? 'h-7' : 'h-9'
									)}
								/>
								{!collapsed && (
									<span className="font-heading text-xl font-semibold text-foreground">
										{siteConfig.name}
									</span>
								)}
							</>
						) : (
							!collapsed && (
								<Textfit
									mode="multi"
									className="flex flex-col justify-center"
									style={{
										height: 80,
										width: 230
									}}
								>
									{siteConfig.name}
								</Textfit>
							)
						)}
					</Link>
				</div>
			)}

			<ScrollArea className="flex-1">
				<div className="h-full w-full py-2">
					<SidebarNav isCollapsed={collapsed} />
					<ScrollBar orientation="vertical" />
				</div>
			</ScrollArea>

			<div
				className={cn(
					'flex border-t border-border/60 py-3',
					collapsed
						? 'flex-col items-center gap-2'
						: 'items-center gap-2 px-2'
				)}
			>
				{!collapsed && <LanguageSelector />}
				<ModeToggle />
			</div>

			{onToggleCollapse && (
				<button
					onClick={onToggleCollapse}
					className="hidden items-center justify-center border-t border-border/60 py-3 text-muted-foreground transition-colors hover:text-foreground lg:flex"
				>
					{collapsed ? (
						<ChevronsRight className="h-4 w-4" />
					) : (
						<ChevronsLeft className="h-4 w-4" />
					)}
				</button>
			)}
		</aside>
	);
}
