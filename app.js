const Koa = require('koa');
const serve  = require('koa-static');

const bodyParser = require('koa-body');
const convert = require('koa-convert');
const router = require('./routes');
const TokenHandler = require('./utils/TokenHandler');
const config = require('config');

const app = new Koa();

const server = require('http').createServer(app.callback());
const io = require('./sockio').connect(server);

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

app.use((ctx, next) => {
    if (ctx.request.header && ctx.request.header.token) {
        let verifyResult = TokenHandler.verify(ctx.header.token, config.tokenCert);
 
        if (verifyResult.error) {
            console.error(verifyResult.error);
            ctx.response.status = 401;
            ctx.body = verifyResult.error;
        }
        else {
            // console.log(verifyResult.result);
            return next();
        }
    }
    else {
        // let errMsg = 'no token'
        // console.log(errMsg);
        // ctx.response.status = 401;
        // ctx.body = errMsg;
        return next();
    }
 });

app.use((ctx, next) => {
    ctx.io = io;
    return next();
});

app.use(router.routes());

app.listen(3000, () => {
    console.log('Listening on port ' + config.server.port + '.')
});