import { isNil } from 'lodash';
import z from 'zod';

/**
 * 文章操作(建或更新文章)时的请求数据结构
 * @param slugUniqueValidator Slug唯一性验证结构生成器
 */
export const getPostItemRequestSchema = (
    slugUniqueValidator?: (val?: string | null) => Promise<boolean>,
) => {
    let slug = z
        .string()
        .max(250, {
            message: 'slug不得超过250个字符',
        })
        .optional();
    if (!isNil(slugUniqueValidator)) {
        slug = slug.refine(slugUniqueValidator, {
            message: 'slug必须是唯一的,请重新设置',
        }) as any;
    }
    return z
        .object({
            title: z
                .string()
                .min(1, {
                    message: '标题不得少于1个字符',
                })
                .max(200, {
                    message: '标题不得超过200个字符',
                }),
            body: z.string().min(1, {
                message: '标题不得少于1个字符',
            }),
            summary: z
                .string()
                .max(300, {
                    message: '摘要不得超过300个字符',
                })
                .optional(),
            keywords: z
                .string()
                .max(200, {
                    message: '描述不得超过200个字符',
                })
                .optional(),
            description: z
                .string()
                .max(300, {
                    message: '描述不得超过300个字符',
                })
                .optional(),
            slug,
        })
        .strict();
};

/**
 * 文章查询响应数据结构
 */
export const postItemResponseSchema = z
    .object({
        id: z.string(),
        title: z.string(),
        thumb: z.string(),
        summary: z.string().nullable().optional(),
        keywords: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        slug: z.string().nullable().optional(),
        body: z.string(),
        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date(),
    })
    .strict();

/**
 * 文章分页查询响应数据结构
 */
export const postPaginateResponseSchema = z.object({
    items: z.array(postItemResponseSchema),
    meta: z.object({
        itemCount: z.coerce.number(),
        totalItems: z.coerce.number().optional(),
        perPage: z.coerce.number(),
        totalPages: z.coerce.number().optional(),
        currentPage: z.coerce.number(),
    }),
});

/**
 * 文章页面总数查询响应数据结构
 */
export const postPageNumbersResponseSchema = z.object({
    result: z.coerce.number(),
});

/**
 * 文章分页查询请求数据结构
 */
export const postPaginateRequestQuerySchema = z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    orderBy: z.enum(['asc', 'desc']).optional(),
});

/**
 * 文章页面总数查询请求数据结构
 */
export const postPageNumbersRequestQuerySchema = z.object({
    limit: z.coerce.number().optional(),
});

/**
 * 文章详情查询请求数据结构
 */
export const postDetailRequestParamsSchema = z.object({
    item: z.string(),
});

/**
 * 通过ID查询文章详情的请求数据结构
 */
export const postDetailByIdRequestParamsSchema = z.object({
    id: z.string(),
});

/**
 * 通过slug查询文章详情的请求数据结构
 */
export const postDetailBySlugRequestParamsSchema = z.object({
    slug: z.string(),
});
