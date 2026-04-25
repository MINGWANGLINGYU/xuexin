import type { Hook } from '@hono/standard-validator';

import { isNil, isObject } from 'lodash';

/**
 * 异常响应生成
 * @param title
 * @param error
 * @param code
 */
export const createErrorResult = (title: string, error?: any, code?: number) => {
    let message = title;
    if (!isNil(error)) {
        message =
            error instanceof Error || (isObject(error) && 'message' in error)
                ? `${title}:${error.message}`
                : `${title}:${error.toString()}`;
    }

    return {
        code,
        message,
    };
};

/**
 * 请求数据验证失败的默认响应
 * @param result
 * @param c
 */
export const defaultValidatorErrorHandler: Hook<any, any, any, any> = (result, c) => {
    if (!result.success) {
        return c.json(
            {
                ...createErrorResult('请求数据验证失败', undefined, 400),
                errors:
                    'format' in result.error && typeof result.error.format === 'function'
                        ? result.error.format()
                        : result.error,
            },
            400,
        );
    }
    return undefined;
};
