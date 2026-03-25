import { API } from '@/lib/api-endpoints';
import { __ } from '@/lib/i18n';
import { TThemePluginItem } from '@/types/item';
import { AutoupdatePostSchema } from '@/types/update';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import useActivation from './use-activation';
import useApiFetch from './use-api-fetch';
import useApiMutation from './use-api-mutation';
import useNotification from './use-notification';
type SettingType = {
	themes?: string[];
	plugins?: string[];
};
export default function useAutoUpdate() {
	const {
		data: setting,
		isFetched,
		isLoading,
		isFetching
	} = useApiFetch<SettingType>(API.update.readSettings);
	const queryClient = useQueryClient();

	const clearCache = useCallback(() => {
		queryClient.invalidateQueries({
			queryKey: [API.update.readSettings]
		});
	}, [queryClient]);
	const { activated, active } = useActivation();
	const notify = useNotification();
	const { isPending: isPendingCreate, mutateAsync: autoupdateCreate } =
		useApiMutation<never, AutoupdatePostSchema>(API.update.create);
	const { isPending: isPendingDelete, mutateAsync: autoupdateDelete } =
		useApiMutation<never, AutoupdatePostSchema>(API.update.delete);
	const changeStatus = useCallback(
		(item: TThemePluginItem, enabled: boolean = false) =>
			new Promise((resolve, reject) => {
				if (!activated) {
					notify.error(
						__('License not activated'),
						decodeEntities(item.title)
					);
					return;
				}
				if (!active) {
					notify.error(
						__('License suspended'),
						decodeEntities(item.title)
					);
					return;
				}
				notify.promise(
					(enabled ? autoupdateCreate : autoupdateDelete)({
						type: item.type,
						slug: item.slug,
						enabled: enabled
					}),
					{
						description: decodeEntities(item.title),
						loading: __('Updating Autoupdate setting'),
						success(data) {
							clearCache();
							resolve(data);
							return enabled
								? __('Autoupdate Enabled')
								: __('Autoupdate Disabled');
						},
						error: (err) => {
							reject(err);
							return __('Something went wrong. Try again later');
						}
					}
				);
			}),
		[
			activated,
			active,
			autoupdateCreate,
			autoupdateDelete,
			clearCache,
			notify
		]
	);
	return {
		setting,
		isFetched,
		isLoading: isLoading || isPendingCreate || isPendingDelete,
		isFetching,
		clearCache,
		changeStatus
	};
}
