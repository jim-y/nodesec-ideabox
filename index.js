const koa = require('koa');
const helmet = require('koa-helmet');
const cors = require('koa-cors');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');
const routes = require('./app/routes');
const xResponseTime = require('./app/middlewares/x-response-time');
const logger = require('./app/middlewares/logger');

const app = module.exports = koa();

app.use(require('koa-static')('./client/dist'));

// x-response-time
app.use(xResponseTime);

// logger
app.use(logger);

// middlewares
app.use(helmet());
app.use(cors());
app.use(bodyParser());
app.use(compress());

// routes
routes(app);

app.listen(3000);
