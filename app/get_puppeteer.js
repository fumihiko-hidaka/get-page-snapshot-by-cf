const puppeteer = require('puppeteer');

module.exports = async (searchOption) => {
  let result = null;
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  try {
    let checkUrl = searchOption.url;
    if (checkUrl.indexOf('http') !== 0) {
      checkUrl = `http://${checkUrl}`;
    }

    const page = await browser.newPage();

    await page.setViewport({
      width: searchOption.width,
      height: searchOption.height,
    });

    await page.goto(checkUrl);

    // 画面描画が完了するのを待つ
    await new Promise(resolve => setTimeout(() => resolve(), 500));

    const title = await page.title();

    const imageBuffer = await page.screenshot();

    result = {
      title,
      imageBuffer,
    }

  } catch (e) {
    console.debug(e);

  } finally {
    await browser.close();
  }

  return result;
};
