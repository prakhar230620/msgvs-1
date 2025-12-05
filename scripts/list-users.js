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
        console.log('Connected. Fetching users...');

        const res = await client.query('SELECT id, email FROM auth.users');

        let output = '--- REGISTERED USERS ---\n';
        if (res.rows.length === 0) {
            output += 'No users found.\n';
        } else {
            res.rows.forEach(row => output += `${row.id} : ${row.email}\n`);
        }
        output += '------------------------\n';

        fs.writeFileSync('users_list.txt', output);
        console.log('Output written to users_list.txt');

    } catch (err) {
        console.error('Error:', err.message);
        fs.writeFileSync('users_list.txt', 'Error: ' + err.message);
    } finally {
        await client.end();
    }
}

run();
