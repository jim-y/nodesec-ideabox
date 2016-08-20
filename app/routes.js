'use strict';

module.exports = function(app) {
  require('./services/auth')(app);
  require('./services/user')(app);
};
