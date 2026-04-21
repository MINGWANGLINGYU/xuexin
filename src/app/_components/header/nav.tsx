import type { FC } from 'react';

import React from 'react';

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/app/_components/shadcn/ui/navigation-menu';
import { cn } from '@/app/_components/shadcn/utils';

import $styles from './nav.module.css';

const items = [
    {
        title: '首页',
        href: '/',
    },
];
export const HeaderNav: FC = () => (
    <div className={$styles.nav}>
        <NavigationMenu className={$styles.menus}>
            <NavigationMenuList>
                {items.map((item) => (
                    <NavigationMenuItem key={item.href} className={cn($styles['menu-item'])}>
                        <NavigationMenuLink
                            href={item.href}
                            className={cn(navigationMenuTriggerStyle())}
                        >
                            {item.title}
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    </div>
);
