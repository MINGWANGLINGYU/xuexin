import type { TagApiType } from '@/server/tag/routes';

import { buildClient, fetchApi } from '@/libs/hono';

export const tagPath = '/tags';
export const tagClient = buildClient<TagApiType>(tagPath);

export const tagApi = {
    list: async (baseUrl = '') =>
        fetchApi(buildClient<TagApiType>(tagPath, baseUrl), async (c) => c.index.$get()),
    detail: async (id: string, baseUrl = '') =>
        fetchApi(buildClient<TagApiType>(tagPath, baseUrl), async (c) =>
            c[':item'].$get({ param: { item: id } }),
        ),
};
