import type { z } from 'zod';

import type {
    getPostItemRequestSchema,
    postPageNumbersSchema,
    postPaginateSchema,
    postSchema,
} from './schema';

/**
 * 文章查询响应数据类型
 */
export type PostItem = z.infer<typeof postSchema>;
/**
 * 文章分页查询响应数据类型
 */
export type PostPaginate = z.infer<typeof postPaginateSchema>;
/**
 * 文章页面总数查询响应数据类型
 */
export type PostPageNumbers = z.infer<typeof postPageNumbersSchema>;

/**
 * 文章操作(建或更新文章)时的请求数据类型
 */
export type PostCreateOrUpdateData = z.infer<ReturnType<typeof getPostItemRequestSchema>>;
