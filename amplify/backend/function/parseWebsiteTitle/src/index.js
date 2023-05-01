/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

import cheerio from 'cheerio';

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const url = event.url;
  if (!url) {
    return {
      statusCode: 400,
      error: `bad request! url is not valid, url = ${url}`,
    };
  }

  try {
    const resp = await fetch(url);
    const htmlText = await resp.text();
    const $ = cheerio.load(htmlText);
    const websiteTitle = $('head > title').text();
    console.log(
      '[Info] Successfully parsed title for url, title = ',
      websiteTitle
    );

    return {
      statusCode: 200,
      websiteTitle: websiteTitle,
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      error: `internal error`,
    };
  }
};
