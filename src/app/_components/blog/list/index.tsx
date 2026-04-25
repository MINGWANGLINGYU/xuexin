import type { FC } from 'react';

import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

import type { IPaginateQueryProps } from '@/app/_components/paginate/types';
import type { PostItem } from '@/server/post/type';

import { postApi } from '@/api/post';
import { getServerBaseUrl } from '@/libs/server-url';

import { cn } from '../../shadcn/utils';
import { BlogBreadCrumb } from '../breadcrumb';
import { BlogIndexSkeleton } from '../skeleton';
import { getBreadcrumbsCategories, getBreadcrumbsLinks } from '../utils';
import { PostList } from './items';
import { PostListPaginate } from './paginate';
import { Sidebar } from './sidebar';
import $styles from './style.module.css';

export interface BlogIndexProps extends IPaginateQueryProps {
    tag?: string;
    categories?: string[];
}

export const BlogIndex: FC<BlogIndexProps> = async (props) => {
    const { page: currentPage, limit = 8, tag, categories } = props ?? {};
    const page = !currentPage || Number(currentPage) < 1 ? 1 : Number(currentPage);
    const baseUrl = await getServerBaseUrl();
    const categoryItems = await getBreadcrumbsCategories(categories, baseUrl);
    if (!categoryItems) return notFound();
    const category = categoryItems.length > 0 ? categoryItems[categoryItems.length - 1] : undefined;
    const breadcrumbs = getBreadcrumbsLinks(categoryItems);
    const result = await postApi.paginate({ page, limit, tag, category: category?.id }, baseUrl);
    if (!result.ok) throw new Error(((await result.json()) as { message: string }).message);
    const { items, meta } = (await result.json()) as unknown as {
        items: PostItem[];
        meta: { totalPages?: number; currentPage: number };
    };
    if (meta.totalPages && meta.totalPages > 0 && meta.currentPage > meta.totalPages) {
        return redirect('/');
    }
    return (
        <div className="page-item">
            <Suspense fallback={<BlogIndexSkeleton />}>
                <div className={cn('page-container', $styles.blogIndex)}>
                    <div className={$styles.container}>
                        <div className="w-full flex-none">
                            <BlogBreadCrumb items={breadcrumbs} tag={tag} basePath="" />
                        </div>
                        <PostList items={items} activeTag={tag} />
                        {meta.totalPages! > 1 && (
                            <PostListPaginate
                                limit={limit}
                                page={meta.currentPage}
                                tag={tag}
                                category={category?.id}
                            />
                        )}
                    </div>
                    <Sidebar activedCategories={categoryItems} activedTag={tag} />
                </div>
            </Suspense>
        </div>
    );
};
