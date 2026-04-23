'use client';
import type { FC, MouseEventHandler } from 'react';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/app/_components/shadcn/ui/alert-dialog';
import { Button } from '@/app/_components/shadcn/ui/button';
import { fetchApi } from '@/libs/api';

export const PostDelete: FC<{ id: string }> = ({ id }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [pedding, setPedding] = useState(false);

    const changeOpen = useCallback((value: boolean) => {
        setOpen(value);
    }, []);

    const close: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
        e.preventDefault();
        if (!pedding) setOpen(false);
    }, []);

    const deleteItem: MouseEventHandler<HTMLButtonElement> = useCallback(
        async (e) => {
            e.preventDefault();
            setPedding(true);
            const result = await fetchApi(async (c) =>
                c.api.posts[':id'].$delete({ param: { id } }),
            );
            if (!result.ok) {
                toast.warning('删除失败', {
                    id: 'post-delete-error',
                    description: ((await result.json()) as { message: string }).message,
                });
            }
            setPedding(false);
            setOpen(false);
            // 删除文章后刷新页面
            router.refresh();
        },
        [id],
    );
    return (
        <AlertDialog open={open} onOpenChange={changeOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="outline">
                    <Trash2 />
                    删除
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onEscapeKeyDown={(event) => event.preventDefault()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>是否确认删除该文章？</AlertDialogTitle>
                    <AlertDialogDescription>
                        当前不支持软删除，删除文章后将无法恢复
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pedding} onClick={close}>
                        取消
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={deleteItem} disabled={pedding}>
                        {pedding ? '删除中' : '确认'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
