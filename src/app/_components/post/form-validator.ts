import { isNil } from 'lodash';
import { z } from 'zod';

import { queryPostItemBySlug } from '@/app/actions/post';

/**
 * slug唯一性验证函数
 * slug创建和编辑文章时，如果slug已经被占用且不是当前文章（编辑文章）的slug时，验证失败
 * 在编辑文章时，如果slug已被占用，但是当前编辑的文章的slug，则不报错
 * @param id
 */
export const uniqueValidator = (id?: string) => async (val?: string) => {
    if (isNil(val) || !val.length) return true;
    const post = await queryPostItemBySlug(val);
    if (isNil(post) || post.id === id) return true;
    return false;
};

export const generatePostFormValidator = (id?: string) => {
    const slugUnique = uniqueValidator(id);
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
            slug: z
                .string()
                .max(250, {
                    message: 'slug不得超过250个字符',
                })
                .optional()
                .refine(slugUnique, {
                    message: 'slug必须是唯一的,请重新设置',
                }),
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
        })
        .strict();
};
