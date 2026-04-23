import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';

export const createHonoApp = () => {
    const app = new Hono();
    app.use(prettyJSON());
    return app;
};
