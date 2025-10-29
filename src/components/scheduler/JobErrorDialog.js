// src/components/scheduler/JobErrorDialog.js

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getLatestJobExecution } from '../../services/api';

function JobErrorDialog({ open, onClose, jobId, jobName }) {
  const [execution, setExecution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadExecutionDetails = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLatestJobExecution(jobId);
      setExecution(data);
    } catch (err) {
      console.error('Failed to load execution details:', err);
      setError(err.message || 'Failed to load execution details');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (open && jobId) {
      loadExecutionDetails();
    }
  }, [open, jobId, loadExecutionDetails]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'error';
      case 'partial_success':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Job Execution Details</Typography>
          {execution && (
            <Chip 
              label={execution.status.replace('_', ' ')}
              color={getStatusColor(execution.status)}
              size="small"
            />
          )}
        </Box>
        {jobName && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
            {jobName}
          </Typography>
        )}
      </DialogTitle>
      
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : execution ? (
          <>
            {/* Execution Metadata */}
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Execution Information
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap" mb={1}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Execution ID
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {execution.execution_id}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Started
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(execution.start_time)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Duration
                  </Typography>
                  <Typography variant="body2">
                    {execution.duration_seconds?.toFixed(2)}s
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Success Summary */}
            {execution.fetched_stocks && execution.fetched_stocks.length > 0 && (
              <Box mb={2}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography variant="subtitle2" color="success.main">
                    Successfully Fetched ({execution.fetched_stocks.length})
                  </Typography>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {execution.fetched_stocks.map(stock => (
                    <Chip 
                      key={stock}
                      label={stock}
                      size="small"
                      color="success"
                      variant="outlined"
                      icon={<CheckCircleIcon />}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Failure Details */}
            {execution.failed_stocks && execution.failed_stocks.length > 0 && (
              <Box mb={2}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <ErrorIcon color="error" fontSize="small" />
                  <Typography variant="subtitle2" color="error.main">
                    Failed Stocks ({execution.failed_stocks.length})
                  </Typography>
                </Box>
                <Alert severity="error" sx={{ mb: 1 }}>
                  The following stocks failed to fetch:
                </Alert>
                <List dense>
                  {execution.errors && execution.errors.map((error, index) => (
                    <ListItem key={index} alignItems="flex-start">
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <ErrorIcon color="error" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="body2" fontWeight="medium">
                            {execution.failed_stocks[index] || 'Unknown'}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="error">
                            {error}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Complete Success */}
            {execution.status === 'success' && (
              <Alert severity="success" icon={<CheckCircleIcon />}>
                All {execution.total_stocks} stocks fetched successfully!
              </Alert>
            )}

            {/* Partial Success Summary */}
            {execution.status === 'partial_success' && (
              <Box mt={2}>
                <Alert severity="warning">
                  Partial success: {execution.fetched_stocks?.length || 0} of {execution.total_stocks} stocks fetched successfully
                </Alert>
              </Box>
            )}
          </>
        ) : (
          <Alert severity="info">No execution history available for this job</Alert>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default JobErrorDialog;
