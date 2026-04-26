import type { Metadata } from 'next';
import type { FC, PropsWithChildren, ReactNode } from 'react';

import { Footer } from '../_components/layout/footer';
import { Header } from '../_components/layout/header';
import { Toaster } from '../_components/shadcn/ui/sonner';
import Theme from '../_components/theme';
import $styles from './layout.module.css';
export const metadata: Metadata = {
    title: '3R教室TS全栈课线上演示',
    description:
        '3R教室 - 提供最好的typescript、react、node.js、next.js、hono.js、nestjs等全栈开发相关课程',
};

const AppLayout: FC<PropsWithChildren<{ modal: ReactNode }>> = ({ children, modal }) => (
    <Theme>
        <div className={$styles.layout}>
            <Header />
            {children}
            <Footer />
        </div>
        {modal}
        <Toaster />
    </Theme>
);
export default AppLayout;
