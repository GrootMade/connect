import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { siteConfig } from '@/config/site';
import useTheme from '@/hooks/use-theme';
import { Link } from 'react-router-dom';
import { Textfit } from 'react-textfit';
import { SidebarNav } from './SidebarNav';

type Props = {
	showLogo?: boolean;
};

export function Sidebar({ showLogo = true }: Props) {
	const { effectiveTheme } = useTheme();
	return (
		<aside className="flex h-full w-full flex-col">
			{showLogo && (
				<div className="items-center justify-between py-4">
					<Link
						to="/"
						className="flex items-center gap-3 leading-tight"
					>
						{siteConfig.logo[effectiveTheme]?.length > 0 ? (
							<>
								<img
									src={siteConfig.logo[effectiveTheme]}
									alt={siteConfig.name}
									className="h-9 w-auto"
								/>
								<span className="font-heading text-xl font-semibold text-foreground">
									{siteConfig.name}
								</span>
							</>
						) : (
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
						)}
					</Link>
				</div>
			)}

			<ScrollArea className="flex-1">
				<div className="h-full w-full py-2">
					<SidebarNav />
					<ScrollBar orientation="vertical" />
				</div>
			</ScrollArea>
		</aside>
	);
}
