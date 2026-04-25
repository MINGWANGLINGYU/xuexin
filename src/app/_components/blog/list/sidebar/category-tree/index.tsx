import type { FC } from 'react';

import { Box } from 'lucide-react';

import type { CategoryItem } from '@/server/category/type';

import { categoryApi } from '@/api/category';
import { getServerBaseUrl } from '@/libs/server-url';

import { SidebarWidget } from '../widget';
import { CategoryTreeComponent } from './tree';

export const CategoryTreeWidget: FC<{ actives?: false | CategoryItem[] }> = async ({ actives }) => {
    const baseUrl = await getServerBaseUrl();
    const result = await categoryApi.tree({}, baseUrl);
    if (!result.ok) throw new Error(((await result.json()) as { message: string }).message);
    const categories = await result.json();
    const activeIds = (actives || []).map((item) => item.id);
    return (
        <SidebarWidget
            title={
                <>
                    <Box />
                    <span>分类</span>
                </>
            }
        >
            <CategoryTreeComponent categories={categories} actives={activeIds} />
        </SidebarWidget>
    );
};
