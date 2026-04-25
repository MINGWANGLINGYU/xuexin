'use client';

import type { PropsWithChildren, ReactNode } from 'react';

import { useMemo, useState } from 'react';
import { useMount } from 'react-use';

import { useIsMobile, useIsTablet } from '@/libs/broswer';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../../../shadcn/ui/accordion';
import { cn } from '../../../shadcn/utils';
import $styles from './widget.module.css';

export const SidebarWidget = ({ title, children }: PropsWithChildren<{ title?: ReactNode }>) => {
    const mobile = useIsMobile();
    const tablet = useIsTablet();
    const [mounted, setMounted] = useState(false);
    useMount(() => {
        setMounted(true);
    });
    const isMobile = useMemo(() => mobile || tablet, [mobile, tablet]);
    if (!mounted) return null;
    return isMobile ? (
        <Accordion type="single" collapsible className={$styles.mobileWidget}>
            <AccordionItem className={$styles.mobileItem} value="item-1">
                {title && (
                    <AccordionTrigger>
                        <div className={$styles.title}>{title}</div>
                    </AccordionTrigger>
                )}
                <AccordionContent>
                    <div className={cn($styles.content, 'transparent-scrollbar')}>{children}</div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ) : (
        <div className={cn($styles.widget, 'page-block')}>
            {title && <div className={$styles.title}>{title}</div>}
            <div className={cn($styles.content, 'transparent-scrollbar')}>{children}</div>
        </div>
    );
};
