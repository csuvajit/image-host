import { Storage } from '@google-cloud/storage';

const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: {
        private_key: process.env.PRIVATE_KEY,
        client_email: process.env.CLIENT_EMAIL
    }
});

export default storage.bucket(process.env.BUCKET_ID!);
