'use server';

import type { Category } from '@prisma/client';

import { isNil } from 'lodash';

import db from '@/libs/db/client';

import type { CategoryItem } from './type';

/**
 * 构建树形结构
 * @param data 所有分类项目
 * @returns 树形结构的根节点数组
 */
function buildTree(data: CategoryItem[]): CategoryItem[] {
    if (data.length === 0) return [];
    const sortedNodes = [...data].sort((a, b) => a.path.length - b.path.length) as CategoryItem[];

    const map: { [path: string]: CategoryItem } = {};
    const roots: CategoryItem[] = [];
    const rootDepth = Math.min(...data.map((item) => item.depth));

    for (const node of sortedNodes) {
        const currentNode: CategoryItem = { ...node };
        const path = currentNode.path;
        map[path] = currentNode;

        if (currentNode.depth === rootDepth) {
            roots.push(currentNode);
        } else {
            const parentPath = path.slice(0, -4);
            const parentNode = map[parentPath];

            if (parentNode) {
                parentNode.children = parentNode.children ?? [];
                parentNode.children.push(currentNode);
            }
        }
    }
    return roots.sort((a, b) => a.path.localeCompare(b.path));
}

/**
 * 递归获取扁平化树
 * @param items
 */
const getFlatTree = (items: CategoryItem[]): CategoryItem[] => {
    return items.reduce<CategoryItem[]>((o, n) => {
        if (!isNil(n.children)) {
            return [...o, n, ...getFlatTree(n.children)];
        }
        return [...o, n];
    }, []);
};

/**
 * 查询分类及其后代信息
 * @param parent
 */
const queryCategoryDescendants = async (parent?: string): Promise<CategoryItem[]> => {
    const categories = await db.category.findMany({
        where: parent ? { OR: [{ id: parent }, { slug: parent }] } : { depth: 1 },
    });
    return (
        await Promise.all(
            categories.map(async (category) => {
                const children = await db.category.findDescendants({
                    where: { id: category.id },
                });
                return [category, ...(isNil(children) ? [] : children)];
            }),
        )
    ).reduce((o, n) => [...o, ...n], []);
};

/**
 * 查询分类树信息
 * @param parent
 */
export const queryCategoryTree = async (parent?: string): Promise<CategoryItem[]> => {
    const categories = await queryCategoryDescendants(parent);
    return buildTree(categories);
};

/**
 * 查询分类列表(扁平树)信息
 * @param parent
 */
export const queryCategoryList = async (parent?: string) => {
    const tree = await queryCategoryTree(parent);
    return getFlatTree(tree);
};

/**
 * 获取分类面包屑
 * @param latest
 */
export const queryCategoryBreadcrumb = async (latest: string): Promise<Category[]> => {
    const category = await db.category.findFirst({
        where: { OR: [{ id: latest }, { slug: latest }] },
    });
    if (isNil(category)) {
        return [];
    }
    const ancestors = await db.category.findAncestors({
        where: { id: category.id },
    });
    return [...(ancestors || []), category];
};
