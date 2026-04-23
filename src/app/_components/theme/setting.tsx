'use client';

import type { FC } from 'react';

import { Switch } from 'antd';
import { Moon, Sun } from 'lucide-react';

import { Button } from '../shadcn/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../shadcn/ui/dropdown-menu';
import { useTheme, useThemeActions } from './hooks';

/**
 * Antd主题选择器
 */
export const AntdThemeSetting: FC = () => {
    const { mode, compact } = useTheme();
    const { toggleMode, toggleCompact } = useThemeActions();
    return (
        <>
            <Switch
                checkedChildren="🌛"
                unCheckedChildren="☀️"
                onChange={toggleMode}
                checked={mode === 'dark'}
                defaultChecked={mode === 'dark'}
            />
            <Switch
                checkedChildren="紧凑"
                unCheckedChildren="正常"
                onChange={toggleCompact}
                checked={compact}
                defaultChecked={compact}
            />
        </>
    );
};

/**
 * Shadcn主题选择器
 */
export const ShadcnThemeSetting: FC = () => {
    const { changeMode } = useThemeActions();
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="focus-visible:!ring-0">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeMode('light')}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeMode('dark')}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeMode('system')}>System</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
