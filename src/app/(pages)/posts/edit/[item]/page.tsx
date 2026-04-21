// src/app/(pages)/posts/edit/[item]/page.tsx
// ...
import { PostPageForm } from '@/app/_components/post/page-form';
import { cn } from '@/app/_components/shadcn/utils';
import { queryPostItemById } from '@/app/actions/post';
import { isNil } from 'lodash';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import $styles from '../../create/style.module.css';

// 添加动态标记，强制使用 SSR
export const dynamic = 'force-dynamic';

const PostEditPage: FC<{ params: Promise<{ item: string }> }> = async ({ params }) => {
    const { item } = await params;
    if (isNil(item)) return notFound();
    const post = await queryPostItemById(item);
    if (isNil(post)) return notFound();
    return (
        <div className={cn($styles.item, 'page-container')}>
            <div className={$styles.item}>
                <PostPageForm post={post} />
            </div>
        </div>
    );
};
export default PostEditPage;