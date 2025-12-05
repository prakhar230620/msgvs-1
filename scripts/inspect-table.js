const { Client } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: '.env.local' });

async function run() {
    const client = new Client({
        connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();
        console.log('Connected. Inspecting page_content table...');

        const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'page_content';
    `);

        let output = '--- COLUMNS ---\n';
        res.rows.forEach(row => output += `${row.column_name}: ${row.data_type}\n`);
        output += '---------------\n';

        const rows = await client.query('SELECT * FROM page_content LIMIT 1');
        output += '--- SAMPLE DATA ---\n';
        if (rows.rows.length > 0) {
            output += JSON.stringify(rows.rows[0], null, 2);
        } else {
            output += 'No data found.';
        }
        output += '\n-------------------\n';

        fs.writeFileSync('table_info.txt', output);
        console.log('Output written to table_info.txt');

    } catch (err) {
        console.error('Error:', err.message);
        fs.writeFileSync('table_info.txt', 'Error: ' + err.message);
    } finally {
        await client.end();
    }
}

run();
