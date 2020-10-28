const { wsUrl } = window.env;
function WebSocketTest() {
  const shopName = document.querySelector('#shopName').value;
  if (!shopName) {
    alert('请输入店铺名');
    return;
  }
  const ws = new WebSocket(wsUrl);
  const msgWrapper = document.getElementById('message-wrapper');
  let pingTimer = null;
  ws.onopen = function ({ data }) {
    ws.send(`${shopName};online`);
    const p = document.createElement('p');
    p.innerText = '商家：' + shopName + ' 开始营业';
    msgWrapper.appendChild(p);

    pingTimer = setInterval(() => {
      ws.send('ping');
    }, 5000);
  };

  // 接收到服务器消息后的回调函数
  ws.onmessage = function ({ data }) {
    const p = document.createElement('p');
    const res = JSON.parse(data);
    if (res.data.indexOf('ping') === -1) {
      if (res.data.indexOf('order') !== -1) {
        p.innerText = '-------- \n' + res.data;
      } else {
        p.innerText = '收到消息：' + res.data;
      }
      msgWrapper.appendChild(p);
    }
  };

  ws.onclose = function () {
    const p = document.createElement('p');
    p.innerText = '连接已关闭...';
    msgWrapper.appendChild(p);
  };
}
