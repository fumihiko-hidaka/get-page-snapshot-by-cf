import validator from 'validator';
import url from 'url';

module.exports = (checkUrl) => {
  const validOptions = {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_host: true,
  };

  return (
    validator.isURL(url, validOptions) &&
    validator.isFQDN(checkUrl)
  );
};
