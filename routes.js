const KoaRouter = require('koa-router');
const router = module.exports = new KoaRouter();

const roleRoute = require('./router/Roles');
const accountRoute = require('./router/Accounts');
const userActionRoute = require('./router/UserActoun');

router.use('/api/roles', roleRoute.routes(), roleRoute.allowedMethods());
router.use('/api/accounts', accountRoute.routes(), accountRoute.allowedMethods());
router.use('/api/accounts', userActionRoute.routes(), userActionRoute.allowedMethods());