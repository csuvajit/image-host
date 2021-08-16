import type { NextApiRequest, NextApiResponse } from 'next';
import { Storage } from '@google-cloud/storage';
import formidable, { File } from 'formidable';
import fs from 'fs';

const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY
    }
});

const bucket = storage.bucket(process.env.BUCKET_ID!);
async function uploadFile(file: { name: string; path: string }) {
    const exists = await bucket.file(file.name).exists();
    if (exists.includes(true)) return null;

    return bucket.upload(file.path, {
        destination: file.name,
        public: true
    }).catch(() => null);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    const form = new formidable.IncomingForm({
        keepExtensions: true,
        allowEmptyFiles: false
    });
    const file: File = await new Promise(resolve => {
        form.parse(req, (err, fields, files) => {
            resolve(files.attachment as File);
        });
    });
    if (!file.name) return res.status(404).end();

    const data = await uploadFile({ name: file.name, path: file.path });
    fs.unlinkSync(file.path);
    if (!data) return res.status(409).end();

    return res.status(200).json({
        name: file.name!,
        type: file.type!,
        size: file.size!,
        path: `${process.env.CDN_URL}/${file.name!}`
    });
}

export const config = {
    api: {
        bodyParser: false
    }
};

interface Response {
    name: string;
    type: string;
    size: number;
    path: string;
}
