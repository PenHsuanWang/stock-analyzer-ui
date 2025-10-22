// src/components/scheduler/SchedulerStatusCard.js

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

function SchedulerStatusCard({ status, onRefresh }) {
  if (!status) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Scheduler Status</Typography>
          <Typography color="textSecondary">Loading...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Scheduler Status</Typography>
          <Tooltip title="Refresh Status">
            <IconButton onClick={onRefresh} size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box mt={2}>
          <Box display="flex" alignItems="center" mb={2}>
            {status.is_running ? (
              <>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Chip label="Running" color="success" />
              </>
            ) : (
              <>
                <ErrorIcon color="error" sx={{ mr: 1 }} />
                <Chip label="Stopped" color="error" />
              </>
            )}
          </Box>

          <Typography variant="body2" gutterBottom>
            <strong>Total Jobs:</strong> {status.total_jobs_count || 0}
          </Typography>
          <Typography variant="body2">
            <strong>Active Jobs:</strong> {status.active_jobs_count || 0}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default SchedulerStatusCard;
