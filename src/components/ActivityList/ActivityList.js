import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
  Skeleton,
} from '@mui/material';
import {
  Login as LoginIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import api from '../../utils/api';

function ActivityList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    try {
      const response = await api.get('/attendance/history?limit=5');
      setActivities(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load recent activities');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <>
        {[...Array(5)].map((_, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemIcon>
                <Skeleton variant="circular" width={24} height={24} />
              </ListItemIcon>
              <ListItemText
                primary={<Skeleton width="60%" />}
                secondary={<Skeleton width="40%" />}
              />
            </ListItem>
            {index < 4 && <Divider />}
          </React.Fragment>
        ))}
      </>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ py: 2 }}>
        {error}
      </Typography>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {activities.length === 0 ? (
        <Typography color="textSecondary" align="center" sx={{ py: 2 }}>
          No recent activities
        </Typography>
      ) : (
        activities.map((activity, index) => (
          <React.Fragment key={activity.id}>
            <ListItem>
              <ListItemIcon>
                {activity.type === 'CLOCK_IN' ? (
                  <LoginIcon color="primary" />
                ) : (
                  <LogoutIcon color="secondary" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={activity.type === 'CLOCK_IN' ? 'Clocked In' : 'Clocked Out'}
                secondary={formatDateTime(activity.timestamp)}
              />
            </ListItem>
            {index < activities.length - 1 && <Divider />}
          </React.Fragment>
        ))
      )}
    </List>
  );
}

export default ActivityList;
