import type { NextApiRequest, NextApiResponse } from 'next';
import Bucket from '../../lib/Bucket';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const files = await Bucket.getFiles();
  return res.json(files[0].map(file => file.metadata));
}
