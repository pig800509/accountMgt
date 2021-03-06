var Router = require('koa-router');
const router = module.exports = new Router();

const Role = require('../service/RoleMgtService');
const { response } = require('../utils/Response');

router.get('/', async (ctx, next) => {
	console.log('get roles');
	ctx.body = await Role.listRole();
});

router.get('/:role_id', async (ctx, next) => {
	console.log('get role');
	console.log('role_id:', ctx.params.role_id);
	ctx.body = await Role.findOneRole(ctx.params.role_id);
});

router.post('/', async (ctx, next) => {
	console.log('post role');
	console.log('post data:', ctx.request.body);
	let resData = await Role.createRole(ctx.request.body);
	response(ctx, resData);
});

router.put('/:role_id', async (ctx, next) => {
    console.log('put role');
    console.log('role_id:', ctx.params.role_id);
	console.log('put data:', ctx.request.body);
	try{
		ctx.body = await Role.updateRole(ctx.request.body);
	}
	catch(e){
		ctx.body = e;
	}
});

router.delete('/:role_id', async (ctx, next) => {
	console.log('delete role');
	console.log('role_id:', ctx.params.role_id);
	ctx.body = await Role.removeOneRole(ctx.params.role_id);
});
