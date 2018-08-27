module.exports = {
    "extends": "eslint-config-airbnb/base",
    "env": {
      "es6": true,
      "browser": true,
      "jquery": "true",
      "node": true,
      "mocha": true
    },
    "globals": {
      "Backbone": true,
      "_": true
    },
    "rules": {
      "no-console": 0
    }
  }