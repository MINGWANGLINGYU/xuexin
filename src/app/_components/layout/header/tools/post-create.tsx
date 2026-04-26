'use client';

import type { FC } from 'react';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { Button as CNButton } from '@/app/_components/shadcn/ui/button';
import { cn } from '@/app/_components/shadcn/utils';
import { useUrlQuery } from '@/libs/url';

export const Button: FC<{ iconBtn?: boolean }> = ({ iconBtn }) => {
    const urlQuery = useUrlQuery();
    return (
        <CNButton
            asChild
            className={cn('ml-auto', {
                'focus-visible:!ring-0': !iconBtn,
                'rounded-sm': !iconBtn,
                'size-9': iconBtn,
            })}
            variant="outline"
            size={iconBtn ? 'icon' : 'default'}
        >
            <Link href={`/blog/create${urlQuery}`}>
                <Plus />
                {!iconBtn && '创建'}
            </Link>
        </CNButton>
    );
};

export const PostCreateButton: FC<{ iconBtn?: boolean }> = ({ iconBtn = false }) => (
    <Suspense>
        <div className="flex">
            <Button iconBtn={iconBtn} />
        </div>
    </Suspense>
);
