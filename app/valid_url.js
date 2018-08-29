const validator = require('validator');
const url = require('url');

module.exports = (checkUrl) => {
  const validOptions = {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_host: true,
  };

  const result = {
    message: '',
  };

  if (typeof checkUrl !== 'string' || checkUrl.length === 0) {
    result.message = 'URLが入力されていません';
    return result;
  }

  if (checkUrl.indexOf('http') !== 0) {
    checkUrl = `http://${checkUrl}`;
  }

  if (!validator.isURL(checkUrl, validOptions)) {
    result.message = '入力されているURLの形式が正しくありません。';
    return result;
  }

  const urlParts = url.parse(checkUrl);
  if (!validator.isFQDN(urlParts.host)) {
    result.message = '入力されているURLの形式が正しくありません。';
    return result;
  }

  return result;
};
