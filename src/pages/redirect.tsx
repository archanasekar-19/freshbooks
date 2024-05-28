import React from 'react'

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
