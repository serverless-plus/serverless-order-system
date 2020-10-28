const url = require('url');
const http = require('http');

async function wsRequest(id = '', data = '') {
  const retmsg = {
    websocket: {
      action: 'data send',
      secConnectionID: id,
      dataType: 'text',
      data: data,
    },
  };
  const postData = JSON.stringify(retmsg);
  console.log('Ws post data: ', postData);
  await new Promise((resolve) => {
    const urlObj = url.parse(process.env.WS_BACK_URL);
    const req = http.request(
      {
        method: 'POST',
        host: urlObj.host,
        path: urlObj.path,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
        });
        resolve();
      },
    );

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });

    req.write(postData);
    req.end();
  });
}

module.exports = {
  wsRequest,
};
