const validator = require('validator');
const url = require('url');

module.exports = (checkUrl) => {
  if (typeof checkUrl === 'string' && checkUrl.length > 0) {
    const validOptions = {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_host: true,
    };

    return (
      validator.isURL(url, validOptions) &&
      validator.isFQDN(checkUrl)
    )
  }

  return false;
};
