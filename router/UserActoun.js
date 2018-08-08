var Router = require('koa-router');
const router = module.exports = new Router();

const Action = require('../service/UserActionService');
const { response } = require('../utils/Response');

router.post('/login', async (ctx, next) => {
	console.log('User login');
	console.log('post data:', ctx.request.body);
	let resData = await Action.login(ctx.request.body);
	response(ctx, resData);
});

router.post('/logout', async (ctx, next) => {
	console.log('User logout');
	console.log('post data:', ctx.request.body);
	let resData = await Action.logout(ctx.request.body.user_id);
	response(ctx, resData);
});