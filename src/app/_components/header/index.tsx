// src/app/_components/header/index.tsx
'use client';
// ...
import { useScroll } from '@/libs/broswer';
import $styles from './styles.module.css';
import { FC } from 'react';
import { cn } from '../shadcn/utils';
import { HeaderLogo } from './logo';
import { HeaderNav } from './nav';
import { HeaderTools } from './tools';
export const Header: FC = () => {
    const scrolled = useScroll(50);

    return (
        <header
            className={cn($styles.header, 'page-item', {
                [$styles['header-scrolled']]: scrolled,
                [$styles['header-unscrolled']]: !scrolled,
            })}
        >
             <div className={cn('page-container', $styles.container)}>
                <HeaderLogo />
                <HeaderNav />
                <HeaderTools />
            </div>
        </header>
    );
};