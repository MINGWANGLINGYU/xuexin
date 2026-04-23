import { hc } from 'hono/client';

import type { AppType } from '@/server/main';

import { appConfig } from '@/config/app';

/**
 * 在服务端组件中创建hono api客户端
 */
const honoApi = hc<AppType>(appConfig.baseUrl);
type HonoApi = typeof honoApi;

/**
 * 在服务端组件中请求hono api
 * @param run
 */
const fetchApi = async <T>(
    run: (c: HonoApi) => Promise<T>,
    baseUrl = appConfig.baseUrl,
): Promise<T> => {
    const api = baseUrl === appConfig.baseUrl ? honoApi : (hc<AppType>(baseUrl) as HonoApi);
    const result = await run(api);
    return result;
};

export { fetchApi, honoApi };
