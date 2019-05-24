'use strict';module.exports = function () {var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return new RegExp(query.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
};