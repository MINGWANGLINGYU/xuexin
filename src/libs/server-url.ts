import { headers } from 'next/headers';

import { appConfig } from '@/config/app';

/**
 * 根据当前请求生成服务端可用的绝对地址
 */
export const getServerBaseUrl = async () => {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto') ?? 'http';

    if (host) return `${protocol}://${host}`;
    return appConfig.baseUrl || 'http://localhost:3000';
};
