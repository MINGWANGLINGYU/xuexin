import type { FC } from 'react';

import { PostPageForm } from '@/app/_components/post/page-form';
import { cn } from '@/app/_components/shadcn/utils';

import $styles from './style.module.css';

// 添加动态标记，强制使用 SSR
export const dynamic = 'force-dynamic';
// export const fetchCache = 'force-no-store';

const PostCreatePage: FC = async () => {
    return (
        <div className="page-item">
            <div className={cn($styles.item, 'page-container')}>
                <PostPageForm />
            </div>
        </div>
    );
};
export default PostCreatePage;
