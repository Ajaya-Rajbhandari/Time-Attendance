import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import TimeClockCard from '../../components/TimeClockCard';
import ActivityList from '../../components/ActivityList';

function Dashboard() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TimeClockCard />
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <ActivityList />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Dashboard;