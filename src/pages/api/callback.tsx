import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('No code provided');
  }

  try {
    const response = await axios.post('https://auth.freshbooks.com/oauth/token', {
      grant_type: 'authorization_code',
      client_id: process.env.NEXT_PUBLIC_FRESHBOOKS_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_FRESHBOOKS_CLIENT_SECRET,
      redirect_uri: process.env.NEXT_PUBLIC_FRESHBOOKS_REDIRECT_URI,
      code: code,
    });

    const { access_token } = response.data;

    res.redirect(`/upload?token=${access_token}`);
  } catch (error) {
    res.status(500).send('Error getting access token');
  }
};
