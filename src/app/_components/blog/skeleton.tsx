import type { FC } from 'react';

import { Skeleton } from '../shadcn/ui/skeleton';

const BlogIndexSkeleton: FC = () => (
    <div className="page-container w-full space-y-4 py-4">
        {['first', 'second', 'third', 'fourth'].map((item) => (
            <Skeleton key={item} className="h-36 w-full rounded-md" />
        ))}
    </div>
);

const PostItemSkeleton: FC = () => (
    <div className="page-container w-full space-y-4 py-4">
        <Skeleton className="h-64 w-full rounded-md" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-80 w-full" />
    </div>
);

const PostContentSkeleton: FC = () => <Skeleton className="h-80 w-full" />;

export { BlogIndexSkeleton, PostContentSkeleton, PostItemSkeleton };
