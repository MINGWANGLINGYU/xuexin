import type { FC } from 'react';

import Link from 'next/link';

import type { TagItem } from '@/server/tag/type';

import { cn } from '@/app/_components/shadcn/utils';

export const TagLink: FC<{ tag: TagItem; className?: string; asSpan?: boolean }> = ({
    tag,
    className,
    asSpan,
}) => {
    const classNames = cn(
        'inline-flex items-center rounded-sm border px-2 py-0.5 text-xs transition-colors hover:bg-accent',
        className,
    );
    if (asSpan) return <span className={classNames}>{tag.text}</span>;
    return (
        <Link href={`/?tag=${encodeURIComponent(tag.text)}`} className={classNames}>
            {tag.text}
        </Link>
    );
};
