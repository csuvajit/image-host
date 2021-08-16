// It does not work on vercel. I have no idea.

import type { NextApiRequest, NextApiResponse } from 'next';
import Bucket from '../../lib/Bucket';
import { PassThrough } from 'stream';
import formidable from 'formidable';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    const form = new formidable.IncomingForm({
        keepExtensions: true,
        allowEmptyFiles: false,
        // @ts-expect-error
        fileWriteStreamHandler: (file: File) => { // only works on formidable@canary 
            const pass = new PassThrough();
            pass.pipe(
                Bucket.file(file.originalFilename).createWriteStream({
                    public: true,
                    resumable: false,
                    metadata: {
                        cacheControl: 'public, max-age=3600',
                        contentType: file.mimetype
                    }
                })
                .on('error', () => {
                    console.error('Upload falied!');
                })
                .on('finish', () => {
                    console.log('Upload finished!');
                })
            );
            return pass;
        }
    });
    const file: File = await new Promise(resolve => {
        form.parse(req, (err, fields, files) => {
            // @ts-expect-error
            resolve(files.attachment);
        });
    });

    return res.status(200).json({
        name: file.originalFilename!,
        type: file.mimetype!,
        size: file.size!,
        path: `${process.env.CDN_URL}/${file.originalFilename!}`
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

interface File {
    originalFilename: string;
    filepath: string;
    mimetype: string,
    size: number;
}
