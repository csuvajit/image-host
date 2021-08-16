// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  res.status(200).json({ name: 'John Doe' });
}

type Response = {
  name: string;
}
