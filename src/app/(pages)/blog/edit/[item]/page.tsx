import type { Metadata, ResolvingMetadata } from 'next';
import type { FC } from 'react';

import { isNil } from 'lodash';
import { notFound } from 'next/navigation';

import { postApi } from '@/api/post';
import { PostPageForm } from '@/app/_components/blog/form';
import { cn } from '@/app/_components/shadcn/utils';
import { getServerBaseUrl } from '@/libs/server-url';

import $styles from '../../../posts/create/style.module.css';

export const dynamic = 'force-dynamic';

export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
    return {
        title: `编辑文章 - ${(await parent).title?.absolute}`,
        description: '文章编辑页面',
    };
};

const PostEditPage: FC<{ params: Promise<{ item: string }> }> = async ({ params }) => {
    const { item } = await params;
    const baseUrl = await getServerBaseUrl();
    const result = await postApi.detailById(item, baseUrl);
    if (!result.ok) {
        if (result.status !== 404) {
            throw new Error(((await result.json()) as { message: string }).message);
        }
        return notFound();
    }
    const post = await result.json();
    if (isNil(post)) return notFound();
    return (
        <div className="page-item">
            <div className={cn($styles.item, 'page-container')}>
                <PostPageForm post={post} />
            </div>
        </div>
    );
};

export default PostEditPage;
