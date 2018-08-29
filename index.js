const request = require('request');
const getPageInfo = require('./app/get_puppeteer');
const uploadImage = require('./app/upload_image');
const PubSub = require('@google-cloud/pubsub');
const validUrl = require('./app/valid_url');

exports.getScreenShot = async (req, res) => {
  if (req.body.token !== process.env.SLACK_SLASH_COMMAND_TOKEN) {
    res.status(401).end();
    return;
  }

  console.log(req.body);

  const searchUrl = req.body.text;

  const validResult = validUrl(searchUrl);

  if (!validResult.message) {

    const bufferData = JSON.stringify({ data: req.body });
    const pubSubClient = new PubSub();

    await pubSubClient.topic(process.env.DELAY_RESPONSE_TOPIC)
      .publisher()
      .publish(Buffer.from(bufferData));

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({
      text: searchUrl,
      attachments: [{
        title: `猫の目で覗き始めます🐱`,
      }],
    });

  } else {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({
      text: searchUrl,
      attachments: [{
        title: validResult.message
      }],
    });
  }
};

exports.responseResult = async (event) => {
  const pubSubMessage = Buffer.from(event.data, 'base64').toString();
  const pubSubData = JSON.parse(pubSubMessage) || {};

  console.log(pubSubMessage);

  const requestBody = pubSubData.body;
  const searchUrl = requestBody.text;
  const responseUrl = requestBody.response_url;

  const responseJson = {
    text: searchUrl,
    attachments: [],
  };

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

  if (responseJson.attachments.length === 0) {
    responseJson.attachments.push({
      title: `${searchUrl} を取得できませんでした……`
    });
  }

  await new Promise((resolve, reject) => {
    request({
      url: responseUrl,
      method: 'POST',
      json: responseJson,
    }, (err, httpResponse, body) => {
      const setObj = { err, httpResponse, body };

      if (err) {
        reject(setObj);
        return;
      }

      resolve(setObj);
    });
  });
};
