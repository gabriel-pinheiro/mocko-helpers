/*!
 * handlebars-helpers <https://github.com/helpers/handlebars-helpers>
 *
 * Copyright (c) 2013-2017, Jon Schlinkert, Brian Woodward.
 * Released under the MIT License.
 */

const lib = require('./lib/');
const { state } = require('@mocko/resync');

function withState(lib) {
  if(process.env.MOCKO_HELPERS_TEST) { return lib; }
  if(!lib) { return lib };

  const obj = {};

  Object.entries(lib).forEach(([key, value]) => {
    obj[key] = (...params) => {
      return state(() => value(...params));
    };
  });

  return obj;
}

module.exports = (groups, options) => {
  if (typeof groups === 'string') {
    groups = [groups];
  } else if (!Array.isArray(groups)) {
    options = groups;
    groups = null;
  }

  const hbs = options.handlebars || options.hbs;
  if (!hbs) throw new Error('You need to pass "handlebars" as an option');

  if (groups) {
    groups.forEach(function(key) {
      hbs.registerHelper(withState(lib[key]));
    });
  } else {
    Object.keys(lib).forEach(key => hbs.registerHelper(withState(lib[key])));
  }

  return hbs.helpers;
};

Object.keys(lib).forEach(key => {
  module.exports[key] = options => {
    options = options || {};
    const hbs = options.handlebars || options.hbs;
    if (!hbs) throw new Error('You need to pass "handlebars" as an option');
    hbs.registerHelper(withState(lib[key]));
    return hbs.helpers;
  };
});
