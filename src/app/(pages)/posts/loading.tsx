import type { FC } from 'react';

import { PageSkeleton } from '@/app/_components/post/skeleton';

const PostLoadingPage: FC = () => (
    <div className="page-item">
        <PageSkeleton />
    </div>
);
export default PostLoadingPage;
