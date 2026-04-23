import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { isNil } from 'lodash';

import { createErrorResult, defaultValidatorErrorHandler } from '../common/erros';
import {
    getPostItemRequestSchema,
    postDetailByIdRequestParamsSchema,
    postDetailBySlugRequestParamsSchema,
    postDetailRequestParamsSchema,
    postPageNumbersRequestQuerySchema,
    postPaginateRequestQuerySchema,
} from './schema';
import {
    createPostItem,
    deletePostItem,
    queryPostItem,
    queryPostItemById,
    queryPostItemBySlug,
    queryPostPaginate,
    queryPostTotalPages,
    isSlugUnique,
    updatePostItem,
} from './service';

// ...
const app = new Hono();
export const postApi = app
    .get(
        '/',
        zValidator('query', postPaginateRequestQuerySchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const query = c.req.valid('query');
                const result = await queryPostPaginate(query);
                return c.json(result, 200);
            } catch (error) {
                return c.json(createErrorResult('查询文章分页数据失败', error), 500);
            }
        },
    )
    .get(
        '/page-numbers',
        zValidator('query', postPageNumbersRequestQuerySchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const query = c.req.valid('query');
                const result = await queryPostTotalPages(query.limit);
                return c.json({ result }, 200);
            } catch (error) {
                return c.json(createErrorResult('查询页面总数失败', error), 500);
            }
        },
    )
    .get(
        '/:item',
        zValidator('param', postDetailRequestParamsSchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const { item } = c.req.valid('param');
                const result = await queryPostItem(item);
                if (!isNil(result)) return c.json(result, 200);
                return c.json(createErrorResult('文章不存在'), 404);
            } catch (error) {
                return c.json(createErrorResult('查询文章失败', error), 500);
            }
        },
    )
    .get(
        '/byid/:id',
        zValidator('param', postDetailByIdRequestParamsSchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const { id } = c.req.valid('param');
                const result = await queryPostItemById(id);
                if (!isNil(result)) return c.json(result, 200);
                return c.json(createErrorResult('文章不存在'), 404);
            } catch (error) {
                return c.json(createErrorResult('查询文章失败', error), 500);
            }
        },
    )
    .get(
        '/byslug/:slug',
        zValidator('param', postDetailBySlugRequestParamsSchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const { slug } = c.req.valid('param');
                const result = await queryPostItemBySlug(slug);
                return c.json(result, 200);
            } catch (error) {
                return c.json(createErrorResult('查询文章失败', error), 500);
            }
        },
    )
    .post(
        '/',
        zValidator('json', getPostItemRequestSchema(isSlugUnique()), defaultValidatorErrorHandler),
        async (c) => {
            try {
                const body = c.req.valid('json');
                const result = await createPostItem(body);
                return c.json(result, 201);
            } catch (error) {
                return c.json(createErrorResult('创建文章失败', error), 500);
            }
        },
    )
    .patch(
        '/:id',
        zValidator('param', postDetailByIdRequestParamsSchema, defaultValidatorErrorHandler),
        zValidator('json', getPostItemRequestSchema(), defaultValidatorErrorHandler),
        async (c) => {
            try {
                const { id } = c.req.valid('param');
                const body = c.req.valid('json');
                if (!(await isSlugUnique(id)(body.slug))) {
                    return c.json(
                        {
                            ...createErrorResult('请求数据验证失败', undefined, 400),
                            errors: {
                                slug: {
                                    _errors: ['slug必须是唯一的,请重新设置'],
                                },
                            },
                        },
                        400,
                    );
                }
                const result = await updatePostItem(id, body);
                return c.json(result, 200);
            } catch (error) {
                return c.json(createErrorResult('更新文章失败', error), 500);
            }
        },
    )
    .delete(
        '/:id',
        zValidator('param', postDetailByIdRequestParamsSchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const { id } = c.req.valid('param');
                const result = await deletePostItem(id);
                return c.json(result, 200);
            } catch (error) {
                return c.json(createErrorResult('删除文章失败', error), 500);
            }
        },
    );
