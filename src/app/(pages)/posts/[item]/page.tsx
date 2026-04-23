import type { Metadata, ResolvingMetadata } from 'next';
import type { FC } from 'react';

import { isNil } from 'lodash';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { MdxRender } from '@/app/_components/mdx/render';
import { PostEditButton } from '@/app/_components/post/edit-button';
import { cn } from '@/app/_components/shadcn/utils';
import { fetchApi } from '@/libs/api';
import { getServerBaseUrl } from '@/libs/server-url';
import type { DateToString } from '@/libs/types';
import { formatChineseTime } from '@/libs/time';
import type { PostItem } from '@/server/post/type';

import $styles from './page.module.css';

export const generateMetadata = async (
    { params }: { params: Promise<{ item: string }> },
    parent: ResolvingMetadata,
): Promise<Metadata> => {
    const { item } = await params;
    const baseUrl = await getServerBaseUrl();
    const result = await fetchApi(
        async (c) => c.api.posts[':item'].$get({ param: { item } }),
        baseUrl,
    );
    if (!result.ok) return {};
    const post = (await result.json()) as DateToString<PostItem>;

    if (isNil(post)) return {};

    return {
        title: `${post.title} - ${(await parent).title?.absolute}`,
        keywords: post.keywords,
        description: post.description,
    };
};

const PostItemPage: FC<{ params: Promise<{ item: string }> }> = async ({ params }) => {
    const { item } = await params;
    const baseUrl = await getServerBaseUrl();
    const result = await fetchApi(
        async (c) => c.api.posts[':item'].$get({ param: { item } }),
        baseUrl,
    );
    if (!result.ok) {
        if (result.status !== 404) {
            throw new Error(((await result.json()) as { message: string }).message);
        }
        return notFound();
    }
    const post = (await result.json()) as DateToString<PostItem>;
    if (isNil(post)) return notFound();
    return (
        <div className="page-item">
            <div className={cn('page-container', $styles.item)}>
                <div className={$styles.thumb}>
                    <Image
                        src={post.thumb}
                        alt={post.title}
                        fill
                        priority
                        sizes="100%"
                        unoptimized
                    />
                </div>

                <div className={$styles.content}>
                    <MdxRender
                        source={post.body}
                        header={
                            <>
                                <header className={$styles.title}>
                                    <h1 className="text-lg lg:text-3xl">{post.title}</h1>
                                    <div className="ml-2">
                                        <PostEditButton id={post.id} iconBtn />
                                    </div>
                                </header>
                                <div className={$styles.meta}>
                                    <div>
                                        <span>
                                            <Calendar />
                                        </span>
                                        <time className="ellips">
                                            {!isNil(post.updatedAt)
                                                ? formatChineseTime(new Date(post.updatedAt))
                                                : formatChineseTime(new Date(post.createdAt))}
                                        </time>
                                    </div>
                                </div>
                            </>
                        }
                    />
                </div>
            </div>
        </div>
    );
};
export default PostItemPage;
