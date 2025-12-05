const { Storage } = require('@google-cloud/storage');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
    try {
        const projectId = process.env.GCS_PROJECT_ID;
        const clientEmail = process.env.GCS_CLIENT_EMAIL;
        const privateKey = process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const bucketName = process.env.GCS_BUCKET_NAME;

        if (!projectId || !clientEmail || !privateKey || !bucketName) {
            console.error('Missing GCS environment variables.');
            return;
        }

        const storage = new Storage({
            projectId,
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
        });

        console.log(`Connecting to bucket: ${bucketName}...`);
        const [metadata] = await storage.bucket(bucketName).getMetadata();

        console.log('Successfully connected to GCS!');
        console.log('Bucket Name:', metadata.name);
        console.log('Location:', metadata.location);
        console.log('Storage Class:', metadata.storageClass);

    } catch (error) {
        console.error('Error connecting to GCS:', error);
    }
}

testConnection();
