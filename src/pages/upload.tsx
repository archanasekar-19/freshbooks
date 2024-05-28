import React, { useState, useEffect } from 'react';
import { Button, Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';

const Upload: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = router.query.token as string;
    if (token) {
      setAccessToken(token);
      fetchFiles(token);
    }
  }, [router.query.token]);

  const fetchFiles = async (token: string) => {
    try {
      const response = await axios.get('https://api.freshbooks.com/files', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Api-Version': 'v1',
        },
      });
      setFiles(response.data.files);
    } catch (error) {
      setError('Failed to fetch files');
      console.error('Error fetching files:', error);
    }
  };

  const handleFileUpload = (file: any) => {
    console.log('Selected file:', file);
    // Implement your file upload logic here
  };

  return (
    <Box>
      {error && <Typography color="error">{error}</Typography>}
      {accessToken && (
        <Box>
          <Typography variant="h6">Files from FreshBooks</Typography>
          <List>
            {files.map((file, index) => (
              <ListItem key={index} button onClick={() => handleFileUpload(file)}>
                <ListItemText primary={file.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default Upload;
