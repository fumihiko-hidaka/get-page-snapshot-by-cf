const request = require('request');
const getPageInfo = require('./app/get_puppeteer');
const uploadImage = require('./app/upload_image');
const validUrl = require('./app/valid_url');

exports.getScreenShot = async (req, res) => {
  if (req.body.token !== process.env.SLACK_SLASH_COMMAND_TOKEN) {
    res.status(401).end();
    return;
  }

  console.log(req.body);

  // puppeteerのOKのレスポンスを返す
  res.setHeader('Content-Type', 'application/json');
  res.status(200).end();

  const searchUrl = req.body.text;

  const responseJson = {
    text: searchUrl,
    attachments: [],
  };

  if (validUrl(searchUrl)) {
    const puppeteerResult = await getPageInfo({
      url: searchUrl,
      width: 500,
      height: 500,
    });

    if (puppeteerResult) {
      const uploadResult = await uploadImage(searchUrl, puppeteerResult.imageBuffer);

      responseJson.attachments.push({
        author_name: puppeteerResult.title,
        author_link: searchUrl,
        image_url: uploadResult.imagePath,
      });
    }
  }

  if (responseJson.attachments.length === 0) {
    responseJson.attachments.push({
      title: `${searchUrl} を取得できませんでした……`
    });
  }

  request({
    url: req.body.response_url,
    method: 'POST',
    json: responseJson,
  }, (err, httpResponse) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(httpResponse);
  });
};
