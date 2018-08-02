const Koa = require('koa');
const static = require('koa-static');
//const bodyParser = require('koa-bodyparser');
const bodyParser = require('koa-body');
const app = new Koa();
const router = require('./routes');
const path = require('path')

const staticPath = './public' 
app.use(static(
    path.join( __dirname,  staticPath)
  ));
//app.use(serve('./public'));
app.use(bodyParser({
    multipart: true,
    urlencoded: true
}));

//display some process info in console log
app.use((ctx, next) => {
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

app.listen(3001, () => {
    console.log('Listening on port ' + 3001 + '.')
});