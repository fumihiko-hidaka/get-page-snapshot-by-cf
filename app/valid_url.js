const validator = require('validator');
const url = require('url');

module.exports = (checkUrl) => {
  const validOptions = {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_host: true,
  };

  if (typeof checkUrl === 'string' && validator.isURL(checkUrl, validOptions)) {
    const urlParts = url.parse(checkUrl);

    return (
      validator.isFQDN(urlParts.host)
    )
  }

  return false;
};
