import type { FC } from 'react';

import type { PostPageNumbers } from '@/server/post/type';

import { SimplePaginate } from '@/app/_components/paginate/simple';
import { fetchApi } from '@/libs/api';
import { getServerBaseUrl } from '@/libs/server-url';

export const PostListPaginate: FC<{ limit: number; page: number }> = async ({ limit, page }) => {
    const baseUrl = await getServerBaseUrl();
    const result = await fetchApi(
        async (c) =>
            c.api.posts['page-numbers'].$get({
                query: { limit: limit.toString() },
            }),
        baseUrl,
    );
    if (!result.ok) return null;
    const { result: totalPages } = (await result.json()) as PostPageNumbers;
    return (
        <div className="mb-5 w-full flex-none">
            <SimplePaginate totalPages={totalPages} currentPage={page} />
        </div>
    );
};
