import type { z } from 'zod';

import type {
    getPostItemRequestSchema,
    postItemResponseSchema,
    postPageNumbersResponseSchema,
    postPaginateResponseSchema,
} from './schema';

/**
 * 文章查询响应数据类型
 */
export type PostItem = z.infer<typeof postItemResponseSchema>;

/**
 * 文章分页查询响应数据类型
 */
export type PostPaginate = z.infer<typeof postPaginateResponseSchema>;

/**
 * 文章页面总数查询响应数据类型
 */
export type PostPageNumbers = z.infer<typeof postPageNumbersResponseSchema>;

/**
 * 文章操作(建或更新文章)时的请求数据类型
 */
export type PostCreateOrUpdateData = z.infer<ReturnType<typeof getPostItemRequestSchema>>;
