const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

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

async function createConnectId(id, date) {
  const res = await query(
    `INSERT INTO info_connectionid_shop_map(connection_id, date) VALUES($1, $2)`,
    [id, date],
  );
  return res.rows;
}

async function getConnectId(id) {
  const res = await query(
    `SELECT * FROM info_connectionid_shop_map WHERE connection_id = $1`,
    [id],
  );
  return res.rows;
}

async function deleteConnectId(id) {
  const res = await query(
    `DELETE FROM info_connectionid_shop_map WHERE connection_id = $1`,
    [id],
  );
  return res.rows;
}

async function setShopName(id, name) {
  const res = await query(
    `UPDATE info_connectionid_shop_map SET shop_name = $1 WHERE connection_id = $2`,
    [name, id],
  );
  return res.rows;
}

async function setShopOnline(name) {
  await query(`UPDATE info_shop SET is_online = 0`);
  const res = await query(
    `UPDATE info_shop SET is_online = 1 WHERE shop_name = $1`,
    [name],
  );
  return res.rows;
}

module.exports = {
  query,
  getConnectId,
  createConnectId,
  deleteConnectId,
  setShopName,
  setShopOnline,
};
