const koa = require('koa');
const helmet = require('koa-helmet');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');
const app = module.exports = koa();
const routes = require('./app/routes');
const xResponseTime = require('./app/middlewares/x-response-time');
const logger = require('./app/middlewares/logger');

// x-response-time
app.use(xResponseTime);

// logger
app.use(logger);

// middlewares
app.use(bodyParser());
app.use(compress());
app.use(helmet());

// routes
routes(app);

app.listen(3000);
