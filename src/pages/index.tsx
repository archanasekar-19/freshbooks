import React, { useState, useEffect } from 'react';
import { IconButton, Box, Typography, List, ListItem, ListItemText, Button, FormControlLabel } from '@mui/material';
import axios from 'axios';

const clientId = '7a85f758f7328906cfb81dfc27d658286ce44b09ef4bc5eab45eb5e90f0a2655';
const clientSecret = 'eb34dcbb40d828151a28fdb8a0fb5055d77410fe56986a43208e3db810d9d1f5';
const redirectUri = 'https://e2ba-2409-40f4-103f-e1b-20bf-e08c-2320-c830.ngrok-free.app/';
const scope = 'user:uploads:read';

const FreshBooksAuth = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [files, setFiles] = useState<any[]>([]);
    const [accountId, setAccountId] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    const handleButtonClick = () => {
        const authUrl = `https://auth.freshbooks.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
        const windowFeatures = 'left=100,top=100,width=600,height=600';
        window.open(
            authUrl,
            'veri5nowAuthWindow',
            windowFeatures,
        );
    };

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
                    fetchAccountDetails(token);
                } catch (error) {
                    setError('Failed to fetch access token');
                    console.error('Error fetching access token:', error);
                }
            };

            fetchAccessToken();
        }
    }, []);

    const fetchAccountDetails = async (token: string) => {
        try {
            const response = await axios.get('https://api.freshbooks.com/auth/api/v1/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Api-Version': 'v1',
                },
            });
            const accountId = response.data.response.roles[0].business.id;
            setAccountId(accountId);
            window.open(`https://api.freshbooks.com/accounting/account/${accountId}/users/clients`, '_blank');

            fetchFiles(token, accountId);
        } catch (error: any) {
            if (error.response) {
                // The request was made and the server responded with a status code that falls out of the range of 2xx
                console.error('Error response:', error.response.data);
                setError(`Failed to fetch account details: ${error.response.data.error_description || error.response.data.message || error.message}`);
            } else if (error.request) {

                console.error('Error request:', error.request);
                setError('Failed to fetch account details: No response from server');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
                setError(`Failed to fetch account details: ${error.message}`);
            }
        }
    };


    const fetchFiles = async (token: string, accountId: string) => {
        try {
            const response = await axios.get(`https://api.freshbooks.com/accounting/account/${accountId}/files`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Api-Version': 'v1',
                },
            });
            setFiles(response.data.response.result.files);
            console.log(response.data.response.result.files);

        } catch (error) {
            setError('Failed to fetch files');
            console.error('Error fetching files:', error);
        }
    };

    const handleFileUpload = (file: any) => {
        console.log('Selected file:', file);
    };

    const handleOpenFreshBooks = () => {

        window.open('https://www.freshbooks.com/', '_blank');
    };

    return (
        <React.Fragment>
            <FormControlLabel
                control={
                    <IconButton
                        sx={{
                            width: '100%',
                            color: '#00b0ff',
                            borderColor: '#00b0ff',
                        }}
                        onClick={handleButtonClick}
                    >
                        <Box
                            component="img"
                            src="../freshbooks.png"
                            alt="FreshBooks"
                            sx={{ width: 30, height: 30 }}
                        />
                    </IconButton>
                }
                label={
                    <Typography variant="caption" sx={{ mt: -1, fontSize: '0.8rem' }}>
                        FreshBooks
                    </Typography>
                }
                labelPlacement="bottom"
            />
            {error && <Typography color="error">{error}</Typography>}
            {accessToken && (
                <Box>
                    <Typography variant="h6" sx={{ color: "red" }}>Access Token - {accessToken}</Typography>
                    <Typography variant="h6" sx={{ color: "blue" }}>Refresh Token - {refreshToken}</Typography>
                    <Typography variant="h6">Files from FreshBooks</Typography>
                    <List>
                        {files.map((file, index) => (
                            <ListItem key={index} button onClick={() => handleFileUpload(file)}>
                                <ListItemText primary={file.name} />
                            </ListItem>
                        ))}
                    </List>
                    <Button variant="contained" color="primary" onClick={handleOpenFreshBooks}>
                        Open FreshBooks File Page
                    </Button>
                </Box>
            )}
        </React.Fragment>
    );
};

export default FreshBooksAuth;
