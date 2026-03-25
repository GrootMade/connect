import { siteConfig } from '@/config/site';
import { normalizeApiPath } from '@/lib/api-route';
import { TApiError } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import apiFetch from '@wordpress/api-fetch';

export default function useApiMutation<
	TResponse = Record<string, unknown>,
	TData = Record<string, unknown>,
	TError = TApiError
>(path: string) {
	const normalizedPath = normalizeApiPath(path);
	const mutation = useMutation<TResponse, TError, TData>({
		mutationFn: async (data = {}) => {
			return apiFetch<TResponse>({
				path: `/${siteConfig.slug}/v1/${normalizedPath}`,
				method: 'POST',
				data: data
			});
		},
		onError: (error: TError) => {
			return error;
		}
	});
	return mutation;
}
