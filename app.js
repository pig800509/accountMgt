const Koa = require('koa');
const serve  = require('koa-static');
//const bodyParser = require('koa-bodyparser');
const bodyParser = require('koa-body');
const convert = require('koa-convert');
const router = require('./routes');

const app = new Koa();

app.use(convert(serve('./public')));

app.use(bodyParser({
    multipart: true,
    urlencoded: true
}));

app.use(async(ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
    
    if (ctx.request.method == "OPTIONS") {
        ctx.response.status = 200
    }
    const start = new Date();
    return next().then(() => {
        const ms = new Date() - start;
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    });
});

app.use(router.routes());

app.listen(3000, () => {
    console.log('Listening on port ' + 3000 + '.')
});