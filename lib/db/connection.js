const { Pool } = require("pg");
export let pool;

function connectPool(max = 1) {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    pool = new Pool({ connectionString, max });
  }
}

export const runQuery = async (query) => {
  let client;
  try {
    connectPool();
    client = await pool.connect();
    await client.query(query);
  } catch (err) {
    console.log(err);
  } finally {
    if (client) client.release();
  }
};
