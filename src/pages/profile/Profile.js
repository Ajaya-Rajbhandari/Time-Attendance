import React from 'react';
import { Paper, Typography } from '@mui/material';

function Profile() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      {/* Profile content will be added here */}
    </Paper>
  );
}

export default Profile;