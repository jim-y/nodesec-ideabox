'use strict';

module.exports = function(app) {
  require('./services/user')(app);
};
