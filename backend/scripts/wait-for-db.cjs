const { Client } = require('pg');

const config = {
  host: process.env.PGHOST ?? 'localhost',
  port: Number(process.env.PGPORT ?? 5432),
  user: process.env.PGUSER ?? 'crm',
  password: process.env.PGPASSWORD ?? 'crm_dev_password',
  database: process.env.PGDATABASE ?? 'crm_dev',
};

async function waitForDb(maxRetries = 30, delayMs = 1000) {
  const client = new Client(config);
  for (let i = 1; i <= maxRetries; i++) {
    try {
      await client.connect();
      await client.query('SELECT 1');
      await client.end();
      console.log(`Database ready after ${i} attempt(s)`);
      return;
    } catch (err) {
      if (i === maxRetries) {
        console.error('Database not ready after max retries', err);
        process.exit(1);
      }
      console.log(`Waiting for database... (${i}/${maxRetries})`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

waitForDb();