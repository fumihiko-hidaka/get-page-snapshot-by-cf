const getPageInfo = require('./app/get_puppeteer');
const uploadImage = require('./app/upload_image');
const validUrl = require('./app/valid_url');

exports.getScreenShot = async (req, res) => {
  const searchUrl = req.body.text;
  const responseJson = {
    text: searchUrl,
    attachments: [],
  };

  if (validUrl(searchUrl)) {
    const puppeteerResult = await getPageInfo({
      url: searchUrl,
    });

    if (puppeteerResult) {
      const uploadResult = await uploadImage(searchUrl, puppeteerResult.imageBuffer);

      responseJson.attachments.append({
        author_name: puppeteerResult.title,
        author_link: searchUrl,
        image_url: uploadResult.imagePath,
      });
    }
  }

  if (responseJson.attachments.length === 0) {
    responseJson.attachments.append({
      title: `${searchUrl} を取得できませんでした……`
    });
  }

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(responseJson));
};
