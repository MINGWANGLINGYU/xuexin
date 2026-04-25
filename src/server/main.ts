import { swaggerUI } from '@hono/swagger-ui';
import { Scalar } from '@scalar/hono-api-reference';
import { openAPIRouteHandler } from 'hono-openapi';
import { prettyJSON } from 'hono/pretty-json';

import { categoryPath, categoryRoutes } from './category/routes';
import { createHonoApp } from './common/app';
import { postPath, postRoutes } from './post/routes';
import { tagPath, tagRoutes } from './tag/routes';

const app = createHonoApp().basePath('/api');
app.use(prettyJSON());
app.get('/', (c) => c.text('3R Blog API'));
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));
export const routes = app
    .route(tagPath, tagRoutes)
    .route(categoryPath, categoryRoutes)
    .route(postPath, postRoutes);
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
