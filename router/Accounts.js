var Router = require('koa-router');
const router = module.exports = new Router();

const Account = require('../service/AccountMgtService');
/*
router.get('/', async (ctx, next) => {
	console.log('get devices');
	ctx.body = await Account.listAccount();
});

router.get('/:user_id', async (ctx, next) => {
	console.log('get account');
	console.log('user_id:', ctx.params.user_id);
	ctx.body = await Account.findOneAccount(ctx.params.user_id);
});


router.get('/byRole/:role_id', async (ctx, next) => {
	console.log('get account by role');
	console.log('role_id:', ctx.params.role_id);
	ctx.body = await Account.findAccountByRole(ctx.params.role_id);
});
*/
router.post('/', async (ctx, next) => {
	//console.log('post account');
	//console.log('post data:', ctx.request.body);
	try{
		ctx.body = await Account.createAccount(ctx);
		//ctx.body = await Account.createAccount(ctx);
	}
	catch(e){
		ctx.body = e;
	}
});
/*
router.put('/:user_id', async (ctx, next) => {
    console.log('put account');
    console.log('user_id:', ctx.params.user_id);
	console.log('put data:', ctx.request.body);
	//ctx.body = await Account.updateDevice(ctx.params.user_id, ctx.request.body);
	try{
		ctx.body = await Account.updateAccount(ctx);
	}
	catch(e){
		ctx.body = e;
	}
});

router.delete('/:device_id', async (ctx, next) => {
	console.log('delete device');
	console.log('device_id:', ctx.params.device_id);
	ctx.body = await Device.removeOneDevice(ctx.params.device_id);
});

router.put('/unregister/:device_id', async (ctx, next) => {
    console.log('unregister device');
	console.log('device_id:', ctx.params.device_id);
	ctx.body = await Device.unregisterDevice(ctx.params.device_id);
})
*/