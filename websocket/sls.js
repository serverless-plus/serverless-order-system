const db = require('./db');
const utils = require('./utils');

/**
 * Connect
 */
on('connect', async (data, socket) => {
  await db.createConnectId(socket.id, utils.getToday());

  console.log(`Connected: connection id ${socket.id}`);

  return 'connected';
});

/**
 * Disconnect
 */
on('disconnect', async (data, socket) => {
  await db.deleteConnectId(socket.id);

  console.log(`Disconnected: connection id ${socket.id}`);

  return 'closed';
});

/**
 * Message
 */
on('message', async (data, socket) => {
  console.log('++++++ data', data);

  const exist = await db.getConnectId(socket.id);
  if (!exist) {
    return 'connection not register';
  } else {
    if (data !== 'ping') {
      try {
        const [shop_name, status] = data.split(';');
        await db.setShopName(socket.id, shop_name);
        if (status === 'online') {
          await db.setShopOnline(shop_name);
        }
        data = `${shop_name} Online !!!`;
        await socket.send(
          JSON.stringify({
            status: 'sending data',
            data: data,
          }),
          socket.id,
        );
      } catch (e) {
        console.log(e);
      }
    }
    return 'send success';
  }
});

/**
 * Default
 */
on('default', async (data, socket) => {
  console.log('message', socket, data);
  console.log('sending to: ', socket.id);
  await socket.send(
    JSON.stringify({
      status: 'sending default data',
      data: data || 'hello websocket',
    }),
    socket.id,
  );
});
