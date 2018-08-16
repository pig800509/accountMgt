var Router = require('koa-router');
const router = module.exports = new Router();

const Account = require('../service/AccountMgtService');
const { response } = require('../utils/Response');

router.get('/', async (ctx, next) => {
	console.log('get accounts');
	let resData = await Account.listAccount();
	response(ctx, resData);
});

router.get('/:user_id', async (ctx, next) => {
	console.log('get account');
	console.log('user_id:', ctx.params.user_id);
	let resData = await Account.findOneAccount(ctx.params.user_id);
	response(ctx, resData);
});


router.get('/byRole/:role_id', async (ctx, next) => {
	console.log('get account by role');
	console.log('role_id:', ctx.params.role_id);
	let resData = await Account.findAccountByRole(ctx.params.role_id);
	response(ctx, resData);
});

router.post('/', async (ctx, next) => {
	console.log('post account');
	console.log('post data:', ctx.request.body);
	let resData = await Account.createAccount(ctx.request.body);
	response(ctx, resData);
});

router.put('/:user_id', async (ctx, next) => {
    console.log('put account');
    console.log('user_id:', ctx.params.user_id);
	console.log('put data:', ctx.request.body);
	let resData = await Account.updateAccount(ctx.params.user_id,ctx.request.body);
	response(ctx, resData);
});

router.delete('/:user_id', async (ctx, next) => {
	console.log('delete account');
	console.log('user_id:', ctx.params.user_id);
	let resData = await Account.removeOneAccount(ctx.params.user_id);
	response(ctx, resData);
});
