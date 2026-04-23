import type { AppConfig } from '@/libs/types';

export const appConfig: AppConfig = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
};