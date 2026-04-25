import type { Metadata, ResolvingMetadata } from 'next';
import type { FC } from 'react';

import { BlogIndex } from '../_components/blog/list';

export const dynamic = 'force-dynamic';

export const generateMetadata = async (
    _metadata: Record<string, any>,
    parent: ResolvingMetadata,
): Promise<Metadata> => ({
    title: `首页 | ${(await parent).title?.absolute}`,
});

const HomePage: FC = async () => {
    return <BlogIndex />;
};

export default HomePage;
