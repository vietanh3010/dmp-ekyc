const isEmpty = require('./is-empty');

module.exports = function validateLevel(level) {
    level = !isEmpty(level) ? level : '';
    if (isEmpty(level))  return ' Level is required.';
    if (level.toLowerCase() === "vip" || level.toLowerCase() === "normal") return '';
    return ' Level is invalid.';
};




