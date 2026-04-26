/* eslint-disable unused-imports/no-unused-vars */
import { swaggerUI } from '@hono/swagger-ui';
import { Scalar } from '@scalar/hono-api-reference';
import { openAPIRouteHandler } from 'hono-openapi';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';

import { categoryPath } from './category/constants';
import { categoryRoutes } from './category/routes';
import { createHonoApp } from './common/app';
import { postPath } from './post/constants';
import { postRoutes } from './post/routes';
import { tagPath } from './tag/constants';
import { tagRoutes } from './tag/routes';
import { authPath } from './user/constants';
import { authRoutes } from './user/routes/auth';

const app = createHonoApp().basePath('/api');
app.use(prettyJSON());
app.get('/', (c) => c.text('3R Blog API'));
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));
const routes = app
    .use(
        '*',
        cors({
            origin: '*',
            allowHeaders: ['Content-Type', 'Authorization'],
            exposeHeaders: ['Content-Length'],
            maxAge: 600,
            credentials: true,
        }),
    )
    .route(tagPath, tagRoutes)
    .route(categoryPath, categoryRoutes)
    .route(postPath, postRoutes)
    .route(authPath, authRoutes);
app.get(
    '/data',
    openAPIRouteHandler(app, {
        documentation: {
            info: {
                version: 'v1',
                title: '3RCD API',
                description: '3R TS全栈课程的后端API',
            },
        },
    }),
);

app.get('/swagger', swaggerUI({ url: '/api/data' }));

app.get(
    '/docs',
    Scalar({
        theme: 'saturn',
        url: '/api/data',
    }),
);

type AppType = typeof routes;
export { app, type AppType };
