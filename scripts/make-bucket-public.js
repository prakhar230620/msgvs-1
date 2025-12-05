const { Storage } = require('@google-cloud/storage');
require('dotenv').config({ path: '.env.local' });

async function makeBucketPublic() {
    const projectId = process.env.GCS_PROJECT_ID;
    const clientEmail = process.env.GCS_CLIENT_EMAIL;
    const privateKey = process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const bucketName = process.env.GCS_BUCKET_NAME;

    if (!projectId || !clientEmail || !privateKey || !bucketName) {
        console.error('Missing GCS credentials in .env.local');
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

    try {
        console.log(`Checking IAM policy for bucket: ${bucketName}...`);
        // Get current policy
        const [policy] = await bucket.iam.getPolicy({ requestedPolicyVersion: 3 });

        // Add allUsers: roles/storage.objectViewer
        const role = 'roles/storage.objectViewer';
        const member = 'allUsers';

        let binding = policy.bindings.find(b => b.role === role);

        if (!binding) {
            console.log(`Role ${role} not found. Adding it.`);
            binding = { role, members: [] };
            policy.bindings.push(binding);
        }

        if (!binding.members.includes(member)) {
            console.log(`Adding ${member} to ${role}...`);
            binding.members.push(member);

            await bucket.iam.setPolicy(policy);
            console.log(`Success! Bucket ${bucketName} is now public.`);
        } else {
            console.log(`Bucket ${bucketName} is already public (allUsers has objectViewer role).`);
        }
    } catch (err) {
        console.error('Error making bucket public:', err);
        console.error('Details:', JSON.stringify(err, null, 2));
    }
}

makeBucketPublic();
