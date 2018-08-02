var Router = require('koa-router');
const router = module.exports = new Router();

const Device = require('../service/DevicesService.js');

router.get('/', async (ctx, next) => {
	console.log('get devices');
	ctx.body = await Device.findDevices();
});

router.get('/:device_id', async (ctx, next) => {
	console.log('get device');
	console.log('device_id:', ctx.params.device_id);
	ctx.body = await Device.findOneDevice(ctx.params.device_id);
});

router.post('/', async (ctx, next) => {
	console.log('post device');
	console.log('post data:', ctx.request.body);
	ctx.body = await Device.createDevice(ctx.request.body);
});

router.put('/:device_id', async (ctx, next) => {
    console.log('put device');
    console.log('device_id:', ctx.params.device_id);
	console.log('put data:', ctx.request.body);
	ctx.body = await Device.updateDevice(ctx.params.device_id, ctx.request.body);
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