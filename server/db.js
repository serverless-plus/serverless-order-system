const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '.env.local'),
});

const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

client.on('error', (e) => {
  console.log(`Client error: ${e}`);
});

async function initialize() {
  if (!client._connecting && !client.connected) {
    try {
      await client.connect();
    } catch (e) {}
  }

  await client.query('BEGIN');

  // initialize table info_shop
  await client.query(`CREATE TABLE IF NOT EXISTS info_shop (
  shop_name VARCHAR(50) NOT NULL DEFAULT '0',
  dish VARCHAR(50) NOT NULL DEFAULT '0' ,
  is_online INT NOT NULL DEFAULT 0 ,
  price FLOAT NOT NULL DEFAULT '0' 
);
  `);
  console.log('Table info_shop created successfully');
  await client.query(
    `INSERT INTO info_shop (shop_name,dish,price) VALUES ('shop1', 'egg', 3),('shop1', 'rice', 1)`,
  );

  // initialize table info_bill
  await client.query(`CREATE TABLE IF NOT EXISTS info_bill (
  bill_id serial NOT NULL,
  userid INT NOT  NULL,
  shop_name VARCHAR(50) NULL ,
  dish VARCHAR(50) NULL,
  price FLOAT NULL 
);
  `);
  console.log('Table info_bill created successfully');

  // initialize table info_customer
  await client.query(`CREATE TABLE IF NOT EXISTS info_customer (
  userid serial  NOT NULL ,
  name VARCHAR(50) NOT NULL DEFAULT '0',
  addr VARCHAR(50) NOT NULL DEFAULT '0',
  telephone VARCHAR(50) NOT NULL DEFAULT '0'
);
  `);
  console.log('Table info_customer created successfully');

  // initialize table info_customer
  await client.query(`CREATE TABLE IF NOT EXISTS info_connectionid_shop_map (
  connection_id VARCHAR(50) NOT NULL ,
  shop_name VARCHAR(50) NOT NULL DEFAULT '' ,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
    `);
  console.log('Table info_connectionid_shop_map created successfully');

  await client.query('COMMIT');

  // await client.end();

  return 'Initialize database succefully';
}

async function query(sql, values) {
  if (!client._connecting && !client.connected) {
    try {
      await client.connect();
    } catch (e) {}
  }
  const res = await client.query(sql, values);

  // await client.end();

  return res;
}

async function getShopList() {
  const res = await query(`SELECT * FROM info_shop`);
  return res.rows;
}

async function getShopDetail(name) {
  const res = await query(
    `SELECT * FROM info_connectionid_shop_map WHERE shop_name = $1`,
    [name],
  );
  return res.rows;
}

module.exports = {
  initialize,
  query,
  getShopList,
  getShopDetail,
};
