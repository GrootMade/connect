import { __ } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Fragment, useEffect } from '@wordpress/element';
import { Home } from 'lucide-react';
import type { ElementType, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import BulkAction from '../bulk-action';
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
	/** Right side of the title row (e.g. primary actions); wraps on small screens */
	headerActions?: ReactNode;
	onSearchQueryChange?: (query: string) => void;
	/** Tighter global header + toolbar; use with FilterBar variant compact on listing pages */
	compactListing?: boolean;
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
	headerActions,
	onSearchQueryChange,
	compactListing = false
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
				headerActions={headerActions}
				onSearchQueryChange={onSearchQueryChange}
				compactTop={compactListing}
			/>
			<Container
				className={cn(
					'relative flex flex-col pb-8',
					compactListing ? 'gap-3 sm:gap-4' : 'gap-5 sm:gap-7',
					(isFetching || isLoading) && 'blur-sm'
				)}
			>
				{breadcrump && (
					<div className={cn(compactListing && 'text-xs')}>
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
				{filterBar && (
					<div
						className={cn(
							!compactListing &&
								'border-b border-border pb-4 sm:pb-5'
						)}
					>
						{filterBar}
					</div>
				)}
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
	headerActions?: ReactNode;
	onSearchQueryChange?: (query: string) => void;
	compactTop?: boolean;
};

function PageHeader({
	title,
	showTitle,
	description,
	headerActions,
	onSearchQueryChange,
	compactTop = false
}: PageHeaderProps) {
	useEffect(() => {
		document.title = title;
	}, [title]);
	return (
		<>
			<header
				className={cn(
					'flex flex-col border-b border-border',
					compactTop
						? 'gap-2 pb-2 pt-0 lg:gap-2 lg:pb-3'
						: 'gap-4 pb-4 lg:gap-5 lg:pb-6 lg:pt-1'
				)}
			>
				<div
					className={cn(
						'flex items-center gap-2',
						!compactTop && 'gap-3'
					)}
				>
					<div className="min-w-0 flex-1">
						<TypeSenseSearch onQueryChange={onSearchQueryChange} />
					</div>
					<div className="shrink-0">
						<BulkAction />
					</div>
				</div>
				{showTitle && (
					<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
						<div className="min-w-0 flex-1 space-y-1.5">
							<h1
								className={cn(
									'font-heading font-bold tracking-tight text-foreground',
									compactTop
										? 'text-lg sm:text-xl'
										: 'text-2xl sm:text-3xl'
								)}
							>
								{title}
							</h1>
							{description && (
								<p
									className={cn(
										'max-w-2xl text-muted-foreground',
										compactTop
											? 'text-xs leading-snug sm:text-sm'
											: 'text-sm leading-relaxed'
									)}
								>
									{description}
								</p>
							)}
						</div>
						{headerActions ? (
							<div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
								{headerActions}
							</div>
						) : null}
					</div>
				)}
			</header>
		</>
	);
}
