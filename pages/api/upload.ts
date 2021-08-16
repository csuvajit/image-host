import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import Bucket from '../../lib/Bucket';
import * as uuid from 'uuid';
import fs from 'fs';

async function uploadFile(file: { name: string; path: string }) {
    const exists = await Bucket.file(file.name).exists();
    if (exists.includes(true)) return null;

    return Bucket.upload(file.path, {
        destination: file.name,
        public: true,
        metadata: {
            metadata: { firebaseStorageDownloadTokens: uuid.v4() }
        }
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
