const db = require('../db');
const { wsRequest } = require('../utils');

const routes = (app) => {
  app.get('/init', async (req, res) => {
    const result = {};
    try {
      const msg = await db.initialize();
      res.status = 200;
      result.message = msg;
      result.code = 0;
    } catch (e) {
      console.log(e);
      res.status = 500;
      result.code = 1;
      result.message = e.message;
    }
    res.send(result);
  });

  app.get('/get_shop_info', async (req, res) => {
    const result = {};
    try {
      const shops = await db.getShopList();
      res.status = 200;
      result.data = shops;
      result.code = 0;
    } catch (e) {
      console.log(e);
      res.status = 500;
      result.code = 1;
      result.message = e.message;
    }
    res.send(result);
  });

  app.post('/order', async (req, res) => {
    const result = {};
    const { user, addr, telephone, shop_name, dishList } = req.body;
    let dishes = '';
    dishList.forEach((item) => {
      dishes += `${item.dish} - ${item.price}元; `;
    });

    if (!shop_name || !user || !telephone) {
      result.code = 2;
      result.message = `Telephone or username or shop name is empty`;
      res.send(result);
      return;
    }
    try {
      const [shop] = await db.getShopDetail(shop_name);
      console.log('shop', shop);
      res.status = 200;
      result.code = 0;
      if (shop) {
        const wsMsg = JSON.stringify({
          data: `\nNew order: \n 
            Dishes: ${dishes} \n
            User: ${user}，Addr: ${addr}，Telephone ${telephone}`,
        });
        await wsRequest(shop.connection_id, wsMsg);
        result.message = 'Order success';
      } else {
        result.message = `Shop ${shop_name} is not working now, please wait...`;
      }
    } catch (e) {
      console.log(e);
      res.status = 500;
      result.code = 3;
      result.message = e.message;
    }
    res.send(result);
  });

  return app;
};

module.exports = routes;
