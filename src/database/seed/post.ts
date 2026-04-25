import type { Prisma } from '@prisma/client';

import { isNil } from 'lodash';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { getRandomInt } from '@/libs/random';
import { generateLowerString } from '@/libs/utils';

import { prisma } from '../client';

type Item = Pick<Prisma.PostCreateInput, 'title' | 'summary'> & {
    bodyPath: string;
    categoryName: string;
    tagNames?: string[];
};

const data: Item[] = [
    {
        title: 'Node.js环境搭建及应用初始化',
        summary: '介绍Node.js开发环境搭建，以及TypeScript全栈项目的初始化流程。',
        bodyPath: path.join(__dirname, '../fixture/ts-fullstack/1.md'),
        categoryName: 'TS全栈开发',
        tagNames: ['nodejs', 'typescript', 'nextjs', 'hono.js'],
    },
    {
        title: 'Next.js应用路由与服务端组件',
        summary: '梳理Next.js App Router、服务端组件和数据获取的核心用法。',
        bodyPath: path.join(__dirname, '../fixture/ts-fullstack/2.md'),
        categoryName: 'TS全栈开发',
        tagNames: ['nextjs', 'react', 'typescript'],
    },
    {
        title: 'Hono接口与OpenAPI文档',
        summary: '使用Hono组织接口路由，并生成可交互的OpenAPI文档。',
        bodyPath: path.join(__dirname, '../fixture/ts-fullstack/3.md'),
        categoryName: 'TS全栈开发',
        tagNames: ['hono.js', 'openapi', 'typescript'],
    },
    {
        title: 'Prisma关系模型与数据填充',
        summary: '讲解Prisma模型关系、扩展能力以及种子数据组织方式。',
        bodyPath: path.join(__dirname, '../fixture/ts-fullstack/4.md'),
        categoryName: 'TS全栈开发',
        tagNames: ['prisma', 'postgres', 'typescript'],
    },
    {
        title: '把课程项目打磨成博客应用',
        summary: '从列表、详情、分类和标签几个方向完善博客应用体验。',
        bodyPath: path.join(__dirname, '../fixture/ts-fullstack/5.md'),
        categoryName: 'TS全栈开发',
        tagNames: ['nextjs', 'blog', 'react'],
    },
];

export const createPostData = async () => {
    for (const post of data) {
        const { title, summary, bodyPath, categoryName, tagNames } = post;
        const category = await prisma.category.findFirst({
            where: { name: categoryName },
        });
        if (!category) {
            throw new Error(`Category ${categoryName} not found`);
        }
        let tags: Prisma.TagCreateNestedManyWithoutPostsInput | undefined;
        if (!isNil(tagNames)) {
            tags = {
                connectOrCreate: tagNames.map((text) => ({ where: { text }, create: { text } })),
            };
        }
        await prisma.post.create({
            select: { id: true },
            data: {
                thumb: `/uploads/thumb/post-${getRandomInt(1, 8)}.png`,
                title,
                summary,
                body: readFileSync(bodyPath, 'utf8'),
                slug: generateLowerString(title),
                keywords: tagNames?.join(','),
                description: summary,
                category: {
                    connect: {
                        id: category.id,
                    },
                },
                tags,
            },
        });
    }
};
