import { API } from '@/lib/api-endpoints';
import { claimAfterDelay } from '@/lib/download-delay';
import { __, sprintf } from '@/lib/i18n';
import VersionCompare from '@/lib/version_compare';
import { useNavigate } from '@/router';
import { TApiError } from '@/types/api';
import { TPostItem, TPostMedia } from '@/types/item';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import useActivation from './use-activation';
import useApiMutation from './use-api-mutation';
import useDownload from './use-download';
import useInstalled from './use-is-installed';
import useNotification from './use-notification';

export type PluginInstallResponse = {
	message: string;
	link?: string;
	filename?: string;
	type?: 'download_link' | 'delay';
	delay_seconds?: number;
	delay_token?: string;
};
export type PluginInstallSchema = {
	item_id: number | string;
	method: 'install' | 'update' | 'download' | string;
	path?: string;
	media_id?: number;
	slug?: string;
};

export default function useInstall() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { addDownloadTask } = useDownload();
	const notify = useNotification();

	const { mutateAsync: installPlugin } = useApiMutation<
		PluginInstallResponse,
		PluginInstallSchema
	>(API.item.update);
	const { data: activation, can_install, can_download } = useActivation();

	const isInstallable = useCallback(
		(item: TPostItem) => ['theme', 'plugin'].includes(item.type),
		[]
	);
	const { list, clearCache: clearInstalledCache } = useInstalled();
	const isInstalled = useCallback(
		(item: TPostItem) => list?.find((i) => i.id === item.id),
		[list]
	);
	const isNewerVersion = useCallback(
		(item: TPostItem) => {
			const installed = isInstalled(item);
			if (installed) {
				return (
					VersionCompare(
						installed.version,
						installed.installed_version ?? '0.0.0',
						'gt'
					) === true
				);
			}
			return false;
		},
		[isInstalled]
	);
	const isRollBack = useCallback(
		(item: TPostItem, media: TPostMedia) => {
			const installed = isInstalled(item);
			if (installed && media) {
				return (
					VersionCompare(
						installed.installed_version ?? '0.0.0',
						media.version,
						'gt'
					) === true
				);
			}
			return false;
		},
		[isInstalled]
	);
	const clearCache = useCallback(() => {
		clearInstalledCache();
		queryClient.invalidateQueries({
			queryKey: [API.license.read]
		});
		queryClient.invalidateQueries({
			queryKey: [API.item.readDetail]
		});
		queryClient.invalidateQueries({
			queryKey: [API.history.read]
		});
	}, [clearInstalledCache, queryClient]);
	const checkActivation = useCallback(() => {
		if (typeof activation?.plan_type == 'undefined') {
			notify.error(__('License not activated'));
			navigate('/activation');
			return false;
		}
		return true;
	}, [activation, navigate, notify]);
	const installItem = useCallback(
		(item: TPostItem, media: TPostMedia) =>
			new Promise<PluginInstallResponse>((resolve, reject) => {
				(async () => {
					if (!checkActivation()) {
						return reject(__('License not activated'));
					}
					if (!can_install) {
						notify.error(__('Installation not allowed'));
						return reject(__('Installation not allowed'));
					}
					const is_rollback = isRollBack(item, media);
					const installed = isInstalled(item);
					const is_new = isNewerVersion(item);
					const method = installed ? 'update' : 'install';
					const loadingMsg = is_rollback
						? sprintf(__('Roll-Back to version %s'), media?.version)
						: installed
							? is_new
								? __('Updating')
								: __('Re-Installing')
							: __('Installing');

					const uid = notify.add(
						loadingMsg,
						'loading',
						decodeEntities(item.title)
					);

					try {
						const data = await installPlugin({
							item_id: item.id,
							method,
							media_id: media?.id,
							slug: installed?.slug
						});

						let result = data;
						if (
							data.type === 'delay' &&
							data.delay_token &&
							data.delay_seconds
						) {
							const claimed = await claimAfterDelay(
								data.delay_token,
								data.delay_seconds,
								method,
								item.id,
								installed?.slug,
								media?.id,
								undefined,
								(remaining) => {
									notify.update(uid, {
										title:
											remaining > 0
												? sprintf(
														__(
															'Waiting %d seconds...'
														),
														remaining
													)
												: loadingMsg
									});
								}
							);
							result = { ...data, ...claimed };
						}

						clearCache();
						notify.update(uid, {
							title: __('Successful'),
							status: 'success'
						});
						resolve(result);
					} catch (err) {
						notify.update(uid, {
							title: (err as TApiError)?.message ?? __('Error'),
							status: 'error'
						});
						reject(err);
					}
				})().catch((err) => {
					reject(err);
				});
			}),
		[
			checkActivation,
			can_install,
			isRollBack,
			isInstalled,
			isNewerVersion,
			installPlugin,
			clearCache,
			notify
		]
	);
	const downloadItem = useCallback(
		(item: TPostItem, media?: TPostMedia) =>
			new Promise<PluginInstallResponse>((resolve, reject) => {
				(async () => {
					if (!checkActivation()) {
						return reject(__('License not activated'));
					}
					if (!can_download) {
						notify.error(__('Download not allowed'));
						return reject(__('Download not allowed'));
					}

					const uid = notify.add(
						__('Downloading'),
						'loading',
						decodeEntities(item.title)
					);

					try {
						const data = await installPlugin({
							item_id: item.id,
							method: 'download',
							media_id: media?.id
						});

						let result = data;
						if (
							data.type === 'delay' &&
							data.delay_token &&
							data.delay_seconds
						) {
							const claimed = await claimAfterDelay(
								data.delay_token,
								data.delay_seconds,
								'download',
								item.id,
								undefined,
								media?.id,
								undefined,
								(remaining) => {
									notify.update(uid, {
										title:
											remaining > 0
												? sprintf(
														__(
															'Waiting %d seconds...'
														),
														remaining
													)
												: __('Downloading')
									});
								}
							);
							result = {
								...data,
								link: claimed.link,
								filename: claimed.filename
							};
						}

						clearCache();
						if (result.link && result.filename) {
							addDownloadTask(result.link, result.filename);
							notify.update(uid, {
								title: __('Added item to download queue.'),
								status: 'success'
							});
						} else {
							notify.update(uid, {
								title: __('Error Initiating Download'),
								status: 'error'
							});
						}
						resolve(result);
					} catch (err) {
						notify.update(uid, {
							title: (err as TApiError)?.message ?? __('Error'),
							status: 'error'
						});
						reject(err);
					}
				})().catch((err) => {
					reject(err);
				});
			}),
		[
			addDownloadTask,
			can_download,
			checkActivation,
			clearCache,
			installPlugin,
			notify
		]
	);

	return {
		isInstalled,
		isNewerVersion,
		isInstallable,
		isRollBack,
		installItem,
		downloadItem
	};
}
