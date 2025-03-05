import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { AccessTime, LocationOn } from '@mui/icons-material';
import api from '../../utils/api';

function TimeClockCard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockedIn, setClockedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastActivity, setLastActivity] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    checkClockStatus();

    return () => clearInterval(timer);
  }, []);

  const checkClockStatus = async () => {
    try {
      const response = await api.get('/attendance/status');
      setClockedIn(response.data.isClockedIn);
      setLastActivity(response.data.lastActivity);
    } catch (error) {
      console.error('Error checking clock status:', error);
    }
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  };

  const handleClockAction = async () => {
    setLoading(true);
    setLocationError(null);

    try {
      // Get current location
      const position = await getLocation();
      setLocation(position);

      const endpoint = clockedIn ? '/attendance/clock-out' : '/attendance/clock-in';
      const response = await api.post(endpoint, {
        location: position,
        timestamp: new Date().toISOString(),
      });

      setClockedIn(!clockedIn);
      setLastActivity(response.data);
    } catch (error) {
      if (error.message.includes('Geolocation')) {
        setLocationError('Location access is required for clock in/out. Please enable location services.');
      } else {
        console.error('Error with clock action:', error);
        setLocationError('Failed to process clock in/out. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <AccessTime color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Time Clock</Typography>
        </Box>
        
        <Typography variant="h3" align="center" sx={{ my: 3 }}>
          {formatTime(currentTime)}
        </Typography>

        {location && (
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <LocationOn color="success" sx={{ mr: 1 }} />
            <Typography variant="body2" color="textSecondary">
              Location verified
            </Typography>
          </Box>
        )}

        {locationError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {locationError}
          </Alert>
        )}

        <Box textAlign="center" mb={2}>
          <Typography variant="body2" color="textSecondary">
            Status: {clockedIn ? 'Clocked In' : 'Clocked Out'}
          </Typography>
          {lastActivity && (
            <Typography variant="body2" color="textSecondary">
              Last {clockedIn ? 'Clock In' : 'Clock Out'}: {new Date(lastActivity.timestamp).toLocaleString()}
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          color={clockedIn ? 'secondary' : 'primary'}
          fullWidth
          onClick={handleClockAction}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Verifying Location...' : (clockedIn ? 'Clock Out' : 'Clock In')}
        </Button>
      </CardContent>
    </Card>
  );
}

export default TimeClockCard;
