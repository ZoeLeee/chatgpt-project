import Koa from 'koa';
import serve from 'koa-static';
import Router from 'koa-router';
import { fileURLToPath } from 'url';
import path from "path"
import bodyParser from "koa-bodyparser"
import { getAnswer } from './chatgpt.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Koa();
const router = new Router();

// 使用ctx.body解析中间件
app.use(bodyParser())

// 配置静态资源目录
app.use(serve(path.resolve(__dirname, '../../client/dist')));

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
        ctx.body = 200;
    } else {
        await next();
    }
});

// 定义接口路由
router.get('/api/hello', (ctx, next) => {
    ctx.body = {
        message: 'Hello, World!'
    };
});
router.post("/api/chatgpt", async (ctx) => {
    let postData = ctx.request.body
    console.log('postData: ', postData);
    const res = await getAnswer(postData.message)
    ctx.status = 200
    ctx.body = res
})

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});