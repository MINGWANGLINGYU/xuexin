import { isNil } from 'lodash';

import type { PostApiType } from '@/server/post/routes';
import type {
    PostCreateOrUpdateData,
    PostPaginateNumberRequestQuery,
    PostPaginateRequestQuery,
} from '@/server/post/type';

import { buildClient, fetchApi } from '@/libs/hono';

export const postPath = '/posts';
export const postClient = buildClient<PostApiType>(postPath);

export const postApi = {
    paginate: async (query: PostPaginateRequestQuery = {}, baseUrl = '') => {
        const page = isNil(query.page) || Number(query.page) < 1 ? 1 : Number(query.page);
        return fetchApi(buildClient<PostApiType>(postPath, baseUrl), async (c) =>
            c.index.$get({
                query: {
                    ...query,
                    page: page.toString(),
                    limit: (query.limit ?? 8).toString(),
                } as any,
            }),
        );
    },

    detail: async (item: string, baseUrl = '') =>
        fetchApi(buildClient<PostApiType>(postPath, baseUrl), async (c) =>
            c[':item'].$get({ param: { item } }),
        ),

    detailBySlug: async (slug: string, baseUrl = '') =>
        fetchApi(buildClient<PostApiType>(postPath, baseUrl), async (c) =>
            c.byslug[':slug'].$get({ param: { slug } }),
        ),

    detailById: async (id: string, baseUrl = '') =>
        fetchApi(buildClient<PostApiType>(postPath, baseUrl), async (c) =>
            c.byid[':id'].$get({ param: { id } }),
        ),

    pageNumbers: async (query: PostPaginateNumberRequestQuery = {}, baseUrl = '') =>
        fetchApi(buildClient<PostApiType>(postPath, baseUrl), async (c) =>
            c['page-numbers'].$get({
                query: { ...query, limit: (query.limit ?? 8).toString() } as any,
            }),
        ),
    create: async (data: PostCreateOrUpdateData) =>
        fetchApi(buildClient<PostApiType>(postPath), async (c) => c.index.$post({ json: data })),
    update: async (id: string, data: PostCreateOrUpdateData) =>
        fetchApi(buildClient<PostApiType>(postPath), async (c) =>
            c[':id'].$patch({
                param: { id },
                json: data,
            }),
        ),
    delete: async (id: string) =>
        fetchApi(buildClient<PostApiType>(postPath), async (c) =>
            c[':id'].$delete({ param: { id } }),
        ),
};
