import type { FC } from 'react';

import { postApi } from '@/api/post';
import { SimplePaginate } from '@/app/_components/paginate/simple';
import { getServerBaseUrl } from '@/libs/server-url';

export const PostListPaginate: FC<{
    limit: number;
    page: number;
    tag?: string;
    category?: string;
}> = async ({ limit, page, tag, category }) => {
    const baseUrl = await getServerBaseUrl();
    const result = await postApi.pageNumbers({ limit, tag, category }, baseUrl);
    if (!result.ok) return null;
    const { result: totalPages } = await result.json();
    return (
        <div className="w-full flex-none">
            <SimplePaginate totalPages={totalPages} currentPage={page} />
        </div>
    );
};
