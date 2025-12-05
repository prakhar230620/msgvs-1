const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function testDelete() {
    try {
        const projectId = process.env.GCS_PROJECT_ID;
        const clientEmail = process.env.GCS_CLIENT_EMAIL;
        const privateKey = process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const bucketName = process.env.GCS_BUCKET_NAME;

        if (!projectId || !clientEmail || !privateKey || !bucketName) {
            console.error('Missing credentials');
            return;
        }

        const storage = new Storage({
            projectId,
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
        });
        const bucket = storage.bucket(bucketName);

        // 1. Create a dummy file
        const filename = 'test-delete-' + Date.now() + '.txt';
        const file = bucket.file('images/' + filename);

        console.log(`Uploading ${filename}...`);
        await file.save('This is a test file');
        console.log('Upload complete.');

        // 2. Verify it exists
        const [exists] = await file.exists();
        console.log(`File exists before delete: ${exists}`);

        if (!exists) {
            console.error('File upload failed?');
            return;
        }

        // 3. Construct URL
        const url = `https://storage.googleapis.com/${bucketName}/images/${filename}`;
        console.log(`Target URL: ${url}`);

        // 4. Simulate API logic
        const urlParts = url.split(`https://storage.googleapis.com/${bucketName}/`);
        if (urlParts.length !== 2) {
            console.error('URL split failed');
            return;
        }
        const extractedFilename = urlParts[1];
        console.log(`Extracted filename: ${extractedFilename}`);

        if (extractedFilename !== `images/${filename}`) {
            console.error(`Mismatch! Expected images/${filename}, got ${extractedFilename}`);
        }

        // 5. Delete
        console.log('Deleting...');
        await bucket.file(extractedFilename).delete();
        console.log('Delete called.');

        // 6. Verify it's gone
        const [existsAfter] = await file.exists();
        console.log(`File exists after delete: ${existsAfter}`);

        if (!existsAfter) {
            console.log('SUCCESS: File was deleted.');
        } else {
            console.error('FAILURE: File still exists.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testDelete();
