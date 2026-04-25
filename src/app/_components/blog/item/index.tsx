import type { FC } from 'react';

import { isNil } from 'lodash';
import { Calendar, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { postApi } from '@/api/post';
import { MdxRender } from '@/app/_components/mdx/render';
import { getServerBaseUrl } from '@/libs/server-url';
import { formatTime } from '@/libs/time';

import type { IBlogBreadcrumbItem } from '../breadcrumb';

import { cn } from '../../shadcn/utils';
import { BlogBreadCrumb } from '../breadcrumb';
import { PostEditButton } from '../list/actions/edit-button';
import { PostItemSkeleton } from '../skeleton';
import { getBreadcrumbsLinks } from '../utils';
import $styles from './style.module.css';

export const PostItemIndex: FC<{ item: string }> = async ({ item }) => {
    const baseUrl = await getServerBaseUrl();
    const result = await postApi.detail(item, baseUrl);
    if (!result.ok) {
        if (result.status !== 404)
            throw new Error(((await result.json()) as { message: string }).message);
        return notFound();
    }
    const post = await result.json();
    const breadcrumbs: IBlogBreadcrumbItem[] = [...getBreadcrumbsLinks(post.categories, 'post')];

    breadcrumbs.push({
        id: post.id,
        text: post.title,
    });
    return (
        <div className="page-item">
            <Suspense fallback={<PostItemSkeleton />}>
                <div className={cn('page-container py-3', $styles.breadcrumbs)}>
                    <BlogBreadCrumb items={breadcrumbs} basePath="" />
                </div>
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
                                        <div className="mt-[0.125rem]">
                                            <PostEditButton item={post} iconBtn />
                                        </div>
                                    </header>
                                    <div className={$styles.meta}>
                                        <div>
                                            <span>
                                                <Calendar />
                                            </span>
                                            <time className="ellips">
                                                {formatTime(
                                                    !isNil(post.updatedAt)
                                                        ? post.updatedAt
                                                        : post.createdAt,
                                                )}
                                            </time>
                                        </div>
                                        {post.tags.length > 0 && (
                                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                                <span className="mr-1">
                                                    <Tag className="h-3 w-3" />
                                                </span>
                                                {post.tags.map((tag) => (
                                                    <Link
                                                        key={tag.id}
                                                        href={`/?tag=${encodeURIComponent(tag.text)}`}
                                                        className="rounded-sm border px-2 py-0.5"
                                                    >
                                                        {tag.text}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            }
                        />
                    </div>
                </div>
            </Suspense>
        </div>
    );
};
