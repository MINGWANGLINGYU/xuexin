import type { FC } from 'react';

import { ShadcnThemeSetting } from '@/app/_components/theme/setting';

import { PostCreateButton } from '../home/create-button';
import $styles from './tools.module.css';

export const HeaderTools: FC = () => {
    return (
        <div className={$styles.tools}>
            <PostCreateButton />
            <ShadcnThemeSetting />
        </div>
    );
};
