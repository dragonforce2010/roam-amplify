/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

import cheerio from 'cheerio';
import fetch from 'node-fetch';

export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  console.log(`event body`, event.body);
  const payload = JSON.parse(event.body);
  const url = payload.url;
  console.log('payload=', payload, ', url=', url);
  if (!url) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: `bad request! url is not valid, url = ${url}`,
      }),
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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        websiteTitle: websiteTitle,
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: `internal error`,
      }),
    };
  }
};
