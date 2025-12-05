const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: '.env.local' });

async function run() {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

    if (!connectionString) {
        console.error('Error: POSTGRES_URL or DATABASE_URL not found in .env.local');
        process.exit(1);
    }

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }, // Required for Supabase
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        const sqlPath = path.join(__dirname, 'fix-admin-robust.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing SQL...');
        await client.query(sql);
        console.log('SQL executed successfully!');

    } catch (err) {
        console.log('--- SQL EXECUTION ERROR ---');
        console.log(err.message);
        if (err.detail) console.log('Detail:', err.detail);
        if (err.hint) console.log('Hint:', err.hint);
        console.log('---------------------------');
        fs.writeFileSync('sql_last_error.txt', err.message + '\n' + (err.detail || '') + '\n' + (err.hint || ''));
    } finally {
        await client.end();
    }
}

run();
