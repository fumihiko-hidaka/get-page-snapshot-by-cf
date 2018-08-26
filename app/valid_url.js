const validator = require('validator');
const url = require('url');

module.exports = (checkUrl) => {
  const validOptions = {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_host: true,
  };

  return (
    typeof checkUrl === 'string' &&
    checkUrl.length > 0 &&
    validator.isURL(url, validOptions) &&
    validator.isFQDN(checkUrl)
  );
};
