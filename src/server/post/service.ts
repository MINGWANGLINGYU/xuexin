import type { Category, Prisma } from '@prisma/client';

import { isNil, omit } from 'lodash';

import type { PaginateOptions } from '@/libs/db/types';
import type { TagItem } from '@/server/tag/type';

import db from '@/libs/db/client';
import { paginateTransform } from '@/libs/db/utils';
import { getRandomInt } from '@/libs/random';
import { deepMerge } from '@/libs/utils';

export type PostCreateInput = Omit<Prisma.PostCreateInput, 'thumb' | 'tags' | 'category'> & {
    tags?: TagItem[];
    categoryId?: string;
};
export type PostUpdateInput = Omit<Prisma.PostUpdateInput, 'thumb' | 'tags' | 'category'> & {
    tags?: TagItem[];
    categoryId?: string;
};

export type PostPaginateOptions = PaginateOptions & {
    orderBy?: 'asc' | 'desc';
    /**
     * 标签
     */
    tag?: string;
    /**
     * 分类的ID或者slug
     */
    category?: string;
};

/**
 * 默认的查询文章选项
 */
const defaultPostItemQueryOptions = {
    omit: {
        categoryId: true,
    },
    include: {
        tags: true,
        category: true,
    },
} as const;

/**
 * 默认的查询文章列表选项
 */
const defaultPostPaginateOptions = deepMerge(defaultPostItemQueryOptions, {
    omit: { body: true },
});

const withCategories = async <T extends { category?: Category | null }>(item: T) => ({
    ...item,
    categories: !isNil(item.category?.id)
        ? await db.category.getAncestorsWithCurrent({
              where: { id: item.category.id },
          })
        : [],
});

/**
 * 查询分页文章列表信息
 * @param options
 */
export const queryPostPaginate = async (options: PostPaginateOptions = {}) => {
    const { tag, category, orderBy, ...rest } = options;
    const where: Prisma.PostWhereInput = {};
    if (!isNil(tag)) {
        where.tags = {
            some: {
                text: decodeURIComponent(tag),
            },
        };
    }
    if (!isNil(category)) {
        const categories = await db.category.getDescendantsWithCurrent({
            where: { OR: [{ id: category }, { slug: category }] },
        });
        where.categoryId = { in: categories.map((item) => item.id) };
    }
    const data = await db.post.paginate({
        orderBy: [{ updatedAt: orderBy ?? 'desc' }, { createdAt: orderBy ?? 'desc' }],
        page: 1,
        limit: 8,
        where,
        ...defaultPostPaginateOptions,
        ...rest,
    });
    for (let index = 0; index < data.result.length; index++) {
        data.result[index] = (await withCategories(data.result[index] as any)) as any;
    }
    return paginateTransform(data);
};

/**
 * 根据查询条件获取文章总页数
 * @param options
 */
export const queryPostTotalPages = async (
    options: Omit<PostPaginateOptions, 'page'> = {},
): Promise<number> => {
    const data = await queryPostPaginate({ page: 1, ...options });
    return data.meta.totalPages ?? 0;
};

/**
 * 根据id或slug查询文章信息
 * @param arg
 */
export const queryPostItem = async (arg: string) => {
    const item = await db.post.findFirst({
        where: {
            OR: [
                { id: arg },
                {
                    slug: arg,
                },
            ],
        },
        ...defaultPostItemQueryOptions,
    });
    if (!isNil(item)) return withCategories(item);
    return item;
};

/**
 * 根据slug查询文章信息
 * @param slug
 */
export const queryPostItemBySlug = async (slug: string) => {
    const item = await db.post.findUnique({
        where: { slug },
        ...defaultPostItemQueryOptions,
    });
    if (!isNil(item)) return withCategories(item);
    return item;
};

/**
 * 根据ID查询文章信息
 * @param id
 */
export const queryPostItemById = async (id: string) => {
    const item = await db.post.findUnique({
        where: { id },
        ...defaultPostItemQueryOptions,
    });
    if (!isNil(item)) return withCategories(item);
    return item;
};

/**
 * 新增文章
 * @param data
 */
export const createPostItem = async (data: PostCreateInput) => {
    const createData: Prisma.PostCreateInput = {
        ...omit(data, ['tags', 'categoryId']),
        thumb: `/uploads/thumb/post-${getRandomInt(1, 8)}.png`,
    };
    if (!isNil(data.tags)) {
        createData.tags = {
            connectOrCreate: data.tags.map(({ id, text }) => ({
                where: { text: text ?? id },
                create: { text },
            })),
        };
    }
    if (!isNil(data.categoryId)) {
        createData.category = {
            connect: { id: data.categoryId },
        };
    }
    const item = await db.post.create({
        data: createData,
    });
    if (!isNil(item)) return queryPostItemById(item.id);
    return item;
};

/**
 * 更新文章
 * @param id
 * @param data
 */
export const updatePostItem = async (id: string, data: PostUpdateInput) => {
    const updateData: Prisma.PostUpdateInput = { ...omit(data, ['tags', 'categoryId']) };
    if (!isNil(data.tags)) {
        updateData.tags = {
            set: [],
            connectOrCreate: data.tags.map(({ id, text }) => ({
                where: { text: text ?? id },
                create: { text },
            })),
        };
    }
    if (!isNil(data.categoryId)) {
        updateData.category = {
            connect: { id: data.categoryId },
        };
    }
    const item = await db.post.update({
        where: { id },
        data: updateData,
    });

    if (!isNil(item)) return queryPostItemById(item.id);
    return item;
};

/**
 * 删除文章
 * @param id
 */
export const deletePostItem = async (id: string) => {
    const item = await queryPostItemById(id);
    if (!isNil(item)) {
        await db.post.delete({ where: { id } });
        return item;
    }
    return null;
};

/**
 * 通过ID验证slug的唯一性
 * @param id
 */
export const isSlugUnique = async (id?: string) => async (val?: string | null) => {
    if (isNil(val) || !val.length) return true;
    const post = await queryPostItemBySlug(val);
    if (isNil(post) || post.id === id) return true;
    return false;
};
