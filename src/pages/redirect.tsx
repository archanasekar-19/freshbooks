import React, { useState, useEffect } from 'react';
import axios from 'axios';

const clientId = '7a85f758f7328906cfb81dfc27d658286ce44b09ef4bc5eab45eb5e90f0a2655';
const clientSecret = 'eb34dcbb40d828151a28fdb8a0fb5055d77410fe56986a43208e3db810d9d1f5';
const redirectUri = 'https://e2ba-2409-40f4-103f-e1b-20bf-e08c-2320-c830.ngrok-free.app/';
const scope = 'user:uploads:read';

export const redirect = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [files, setFiles] = useState<any[]>([]);
    const [accountId, setAccountId] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get('code');

        if (authorizationCode) {
            const fetchAccessToken = async () => {
                try {
                    const response = await axios.post('https://auth.freshbooks.com/oauth/token', {
                        grant_type: 'authorization_code',
                        client_id: clientId,
                        client_secret: clientSecret,
                        redirect_uri: redirectUri,
                        code: authorizationCode,
                    });
                    const token = response.data.access_token;
                    const refreshToken = response.data.refresh_token;

                    setAccessToken(token);
                    setRefreshToken(refreshToken);
                    localStorage.setItem('localtoken',token);
                    localStorage.setItem('localrefreshToken',refreshToken);
                    window.close();
                } catch (error) {
                    setError('Failed to fetch access token');
                    console.error('Error fetching access token:', error);
                }
            };

            fetchAccessToken();
        }
    }, []);
  return (
    <div>redirect</div>
  )
}
export default redirect;
