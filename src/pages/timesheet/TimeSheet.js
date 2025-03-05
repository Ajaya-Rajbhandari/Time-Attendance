import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import api from '../../utils/api';

function TimeSheet() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalHours: 0,
    regularHours: 0,
    overtimeHours: 0,
  });

  useEffect(() => {
    fetchTimeEntries();
  }, [selectedDate]);

  const fetchTimeEntries = async () => {
    setLoading(true);
    try {
      const startDate = startOfWeek(selectedDate);
      const endDate = endOfWeek(selectedDate);
      
      const response = await api.get('/attendance/timesheet', {
        params: {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
        },
      });

      setTimeEntries(response.data.entries);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error fetching time entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const startDate = startOfWeek(selectedDate);
      const endDate = endOfWeek(selectedDate);
      
      const response = await api.get('/attendance/export', {
        params: {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
          format: 'csv',
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `timesheet-${format(startDate, 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting timesheet:', error);
    }
  };

  const calculateDuration = (clockIn, clockOut) => {
    if (!clockOut) return 'In Progress';
    const duration = (new Date(clockOut) - new Date(clockIn)) / (1000 * 60 * 60);
    return `${duration.toFixed(2)} hrs`;
  };

  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate),
    end: endOfWeek(selectedDate),
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4">Time Sheet</Typography>
              <Button
                variant="contained"
                startIcon={<FileDownloadIcon />}
                onClick={handleExport}
              >
                Export
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Select Week
              </Typography>
              <DatePicker
                label="Week"
                value={selectedDate}
                onChange={setSelectedDate}
                sx={{ width: '100%' }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Hours
                  </Typography>
                  <Typography variant="h5">{summary.totalHours.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Regular Hours
                  </Typography>
                  <Typography variant="h5">{summary.regularHours.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Overtime Hours
                  </Typography>
                  <Typography variant="h5">{summary.overtimeHours.toFixed(2)}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Clock In</TableCell>
                    <TableCell>Clock Out</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    weekDays.map((day) => {
                      const entry = timeEntries.find(
                        (e) => format(new Date(e.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                      );

                      return (
                        <TableRow key={format(day, 'yyyy-MM-dd')}>
                          <TableCell>{format(day, 'MMM dd, yyyy')}</TableCell>
                          <TableCell>
                            {entry?.clockIn
                              ? format(new Date(entry.clockIn), 'hh:mm a')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {entry?.clockOut
                              ? format(new Date(entry.clockOut), 'hh:mm a')
                              : entry?.clockIn
                              ? 'Still Working'
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {entry ? calculateDuration(entry.clockIn, entry.clockOut) : '-'}
                          </TableCell>
                          <TableCell>
                            {entry ? (
                              <Chip
                                label={entry.clockOut ? 'Complete' : 'In Progress'}
                                color={entry.clockOut ? 'success' : 'warning'}
                                size="small"
                              />
                            ) : (
                              <Chip label="No Entry" color="default" size="small" />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
}

export default TimeSheet;