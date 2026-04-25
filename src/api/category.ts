import type { CategoryApiType } from '@/server/category/routes';
import type { categoryListRequestParams } from '@/server/category/type';

import { buildClient, fetchApi } from '@/libs/hono';

export const categoryPath = '/categories';
export const categoryClient = buildClient<CategoryApiType>(categoryPath);

export const categoryApi = {
    breadcrumb: async (latest: string, baseUrl = '') =>
        fetchApi(buildClient<CategoryApiType>(categoryPath, baseUrl), async (c) =>
            c.breadcrumb[':latest'].$get({
                param: { latest },
            }),
        ),
    list: async (params: categoryListRequestParams = {}, baseUrl = '') =>
        fetchApi(buildClient<CategoryApiType>(categoryPath, baseUrl), async (c) =>
            c[':parent?'].$get({
                param: params,
            }),
        ),
    tree: async (params: categoryListRequestParams = {}, baseUrl = '') =>
        fetchApi(buildClient<CategoryApiType>(categoryPath, baseUrl), async (c) =>
            c.tree[':parent?'].$get({
                param: params,
            }),
        ),
};
