const KoaRouter = require('koa-router');
const router = module.exports = new KoaRouter();

//const deviceRoute = require('./router/Devices');
const accountRoute = require('./router/Accounts');


//router.use('/api/devices', deviceRoute.routes(), deviceRoute.allowedMethods());
router.use('/api/accounts', accountRoute.routes(), accountRoute.allowedMethods());
// router.use('/api/deviceAgent', deviceAgentRoute.routes(), deviceAgentRoute.allowedMethods());
// router.use('/api/devices/peripherals', devicePeripheralsRoute.routes(), devicePeripheralsRoute.allowedMethods());
// router.use('/api/devices/profile', deviceProfileRoute.routes(), deviceProfileRoute.allowedMethods());
// router.use('/api/devices/security', deviceSecurityRoute.routes(), deviceSecurityRoute.allowedMethods());