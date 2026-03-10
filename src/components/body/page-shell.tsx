import { __ } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Fragment, useEffect } from '@wordpress/element';
import { Home } from 'lucide-react';
import type { ElementType } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../ad-banner';
import BulkAction from '../bulk-action';
import LanguageSelector from '../language-select';
import ModeToggle from '../mode-toggle';
import TypeSenseSearch from '../typesense-search';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '../ui/breadcrumb';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import Notices from './notices';
type BreadCrumbType = {
	label: string;
	href?: string;
};
type Props = {
	children: React.ReactNode;
	as?: ElementType;
	title: string;
	description?: string;
	showTitle?: boolean;
	isFetching?: boolean;
	isLoading?: boolean;
	isError?: boolean;
	preloader?: JSX.Element;
	error?: JSX.Element;
	breadcrump?: BreadCrumbType[];
	filterBar?: React.ReactNode;
	onSearchQueryChange?: (query: string) => void;
};

export function AppPageShell({
	children,
	as,
	title,
	description,
	showTitle = true,
	isFetching = false,
	isLoading = false,
	isError = false,
	preloader: PreloaderComponent,
	error: ErrorComponent,
	breadcrump,
	filterBar,
	onSearchQueryChange
}: Props) {
	const Container = as ?? 'main';
	if (!PreloaderComponent) {
		PreloaderComponent = (
			<div className="space-y-2">
				<Skeleton className="h-4 w-[250px]" />
				<Skeleton className="h-4 w-[200px]" />
			</div>
		);
	}
	if (!ErrorComponent) {
		ErrorComponent = (
			<Card>
				<CardContent className="p-5 text-center text-muted-foreground sm:p-7">
					{__('Invalid Request')}
				</CardContent>
			</Card>
		);
	}
	function Out() {
		return isLoading ? (
			PreloaderComponent
		) : isError ? (
			ErrorComponent
		) : (
			<>{children}</>
		);
	}
	return (
		<div className="w-full space-y-8">
			<PageHeader
				title={title}
				showTitle={showTitle}
				description={description}
				filterBar={filterBar}
				onSearchQueryChange={onSearchQueryChange}
			/>
			<Container
				className={cn([
					'relative flex flex-col gap-5 pb-8 sm:gap-7',
					(isFetching || isLoading) && 'blur-sm'
				])}
			>
				{breadcrump && (
					<div>
						<Breadcrumb>
							<BreadcrumbList>
								{[
									{
										label: (
											<span className="flex flex-row items-center gap-2">
												<Home size={16} /> {__('Home')}
											</span>
										),
										href: '/'
									},
									...breadcrump
								].map((item, index) => (
									<Fragment key={index}>
										{index > 0 && <BreadcrumbSeparator />}
										<BreadcrumbItem>
											{item.href ? (
												<BreadcrumbLink asChild>
													<Link to={item.href}>
														{item.label}
													</Link>
												</BreadcrumbLink>
											) : (
												<BreadcrumbPage>
													{item.label}
												</BreadcrumbPage>
											)}
										</BreadcrumbItem>
									</Fragment>
								))}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				)}
				<Notices />
				<Out />
				{(isFetching || isLoading) && (
					<div className="absolute left-0 top-0 h-full w-full cursor-progress"></div>
				)}
			</Container>
		</div>
	);
}

type PageHeaderProps = {
	title: string;
	showTitle: boolean;
	description?: string;
	filterBar?: React.ReactNode;
	onSearchQueryChange?: (query: string) => void;
};

function PageHeader({
	title,
	showTitle,
	description,
	filterBar,
	onSearchQueryChange
}: PageHeaderProps) {
	useEffect(() => {
		document.title = title;
	}, [title]);
	return (
		<>
			<header className="flex flex-col gap-4 border-b border-border py-6">
				{/* Row 1: Full-width search + actions */}
				<div className="flex flex-row items-center gap-2">
					<div className="flex-1">
						<TypeSenseSearch onQueryChange={onSearchQueryChange} />
					</div>
					<LanguageSelector />
					<BulkAction />
					<ModeToggle />
				</div>
				{/* Row 2: Page title + Ad banner */}
				{showTitle && (
					<div className="flex flex-col gap-1">
						<h1 className="font-heading text-2xl font-bold">
							{title}
						</h1>
						{description && (
							<p className="max-w-xl text-xs text-muted-foreground/60">
								{description}
							</p>
						)}
					</div>
				)}
				<AdBanner />
				{/* Row 3: Filter bar (only on listing pages) */}
				{filterBar && <div className="border-t pt-4">{filterBar}</div>}
			</header>
		</>
	);
}
