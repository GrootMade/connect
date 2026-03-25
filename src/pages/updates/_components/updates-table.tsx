import { BulkActionType } from '@/components/data-table-bulk-action';
import { DataTablePagination } from '@/components/data-table-pagination';
import { DataTableToolbar } from '@/components/data-table-toolbar';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import useActivation from '@/hooks/use-activation';
import useApiMutation from '@/hooks/use-api-mutation';
import useAutoUpdate from '@/hooks/use-auto-update';
import {
	PluginInstallResponse,
	PluginInstallSchema
} from '@/hooks/use-install';
import useInstalled from '@/hooks/use-is-installed';
import useNotification from '@/hooks/use-notification';
import useTaskQueue from '@/hooks/use-task-queue';
import { API } from '@/lib/api-endpoints';
import { __ } from '@/lib/i18n';
import { TApiError } from '@/types/api';
import {
	DataTableFilterableColumn,
	DataTableSearchableColumn
} from '@/types/data-table';
import { TThemePluginItem } from '@/types/item';
import {
	ColumnDef,
	ColumnFiltersState,
	PaginationState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import { getColumns } from './columns';

const filterableColumns: DataTableFilterableColumn<TThemePluginItem>[] = [
	{
		id: 'type',
		title: __('Type'),
		options: [
			{
				label: __('Themes'),
				value: 'themes'
			},
			{
				label: __('Plugins'),
				value: 'plugins'
			}
		]
	}
];
const searchableColumns: DataTableSearchableColumn<TThemePluginItem>[] = [
	{ id: 'title', placeholder: __('Search downloads...') }
];
type UpdateTableProps = {
	data: TThemePluginItem[];
};
export function UpdatesTableSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-8 w-[150px] lg:w-[250px]" />
			<Skeleton className="h-64 w-full" />
		</div>
	);
}

export default function UpdatesTable({ data }: UpdateTableProps) {
	const { mutateAsync: installPlugin } = useApiMutation<
		PluginInstallResponse,
		PluginInstallSchema
	>(API.item.update);
	const { changeStatus } = useAutoUpdate();
	const { clearCache } = useInstalled();
	const { addTask } = useTaskQueue();
	const { activated, active } = useActivation();
	const notify = useNotification();
	const ifCanDoBulkAction = useCallback(() => {
		return new Promise((resolve, reject) => {
			if (!activated) {
				notify.error(__('License not activated'));
				reject(__('License not activated'));
			} else if (!active) {
				notify.error(__('License suspended'));
				reject(__('License suspended'));
			} else {
				resolve('yes');
			}
		});
	}, [activated, active, notify]);
	const bulkActions: BulkActionType<TThemePluginItem>[] = [
		{
			id: 'update',
			label: __('Update'),
			action: async (items) => {
				ifCanDoBulkAction().then(() => {
					items.forEach(({ original: item }) => {
						addTask(() => {
							return new Promise((resolve, reject) => {
								notify.promise(
									installPlugin({
										item_id: item.id,
										method: 'update'
									}),
									{
										description: item.title,
										loading: __('Updating'),
										success(data) {
											resolve(data);
											clearCache();
											return __('Success');
										},
										error(err: TApiError) {
											reject(err);
											return err.message ?? __('Error');
										}
									}
								);
							});
						});
					});
				});
			}
		},
		{
			id: 'reinstall',
			label: __('Re-Install'),
			action: (items) => {
				ifCanDoBulkAction().then(() => {
					items.forEach(({ original: item }) => {
						addTask(() => {
							return new Promise((resolve, reject) => {
								notify.promise(
									installPlugin({
										item_id: item.id,
										method: 'install'
									}),
									{
										description: item.title,
										loading: __('Re-installing'),
										success() {
											resolve(item);
											clearCache();
											return __('Re-Install Success');
										},
										error(err: TApiError) {
											reject(err);
											return (
												err.message ??
												__('Error Installing')
											);
										}
									}
								);
							});
						});
					});
				});
			}
		},
		{
			id: 'autoupdate',
			label: __('Enable Auto-Update'),
			action: (items) => {
				ifCanDoBulkAction().then(() => {
					items.forEach(({ original: item }) => {
						addTask(() => {
							return changeStatus(item, true);
						});
					});
				});
			}
		},
		{
			id: 'disable-autoupdate',
			label: __('Disable Auto-Update'),
			action: (items) => {
				ifCanDoBulkAction().then(() => {
					items.forEach(({ original: item }) => {
						addTask(() => {
							return changeStatus(item, false);
						});
					});
				});
			}
		}
	];
	const columns = useMemo<ColumnDef<TThemePluginItem, unknown>[]>(
		() => getColumns(),
		[]
	);
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10
	});
	const [sorting, setSorting] = useState<SortingState>([]);

	const pagination = useMemo(
		() => ({
			pageIndex,
			pageSize
		}),
		[pageIndex, pageSize]
	);

	useEffect(() => {
		setRowSelection({});
	}, [pagination]);

	const table = useReactTable({
		data: data,
		columns,
		autoResetAll: false,
		state: {
			pagination,
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		keepPinnedRows: false
	});
	return (
		<div className="space-y-4">
			<DataTableToolbar
				table={table}
				filterableColumns={filterableColumns}
				searchableColumns={searchableColumns}
				bulkActions={bulkActions}
			/>
			<div className="flex-shrink overflow-hidden rounded-lg border border-border/80 bg-card shadow-card">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: (flexRender(
													header.column.columnDef
														.header,
													header.getContext()
												) as React.ReactNode)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && 'selected'
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{
												flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												) as React.ReactNode
											}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-32 px-6 text-center text-sm text-muted-foreground"
								>
									{__(
										'No rows match your filters. Try adjusting search or filters.'
									)}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
}
