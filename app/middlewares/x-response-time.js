'use strict';

module.exports = function *(next) {
  const start = new Date();
  yield next;
  const ms = new Date() - start;
  this.set('X-Response-Time', ms + 'ms');
}
