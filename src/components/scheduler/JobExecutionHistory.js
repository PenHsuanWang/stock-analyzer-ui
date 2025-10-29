// src/components/scheduler/JobExecutionHistory.js

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Collapse,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { getJobExecutionHistory } from '../../services/api';

function ExecutionRow({ execution }) {
  const [open, setOpen] = useState(false);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon fontSize="small" />;
      case 'failed':
        return <ErrorIcon fontSize="small" />;
      case 'partial_success':
        return <WarningIcon fontSize="small" />;
      default:
        return null;
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
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
            disabled={!execution.errors || execution.errors.length === 0}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{formatDate(execution.start_time)}</TableCell>
        <TableCell>
          <Chip 
            label={execution.status.replace('_', ' ')}
            color={getStatusColor(execution.status)}
            size="small"
            icon={getStatusIcon(execution.status)}
          />
        </TableCell>
        <TableCell>
          {execution.fetched_stocks?.length || 0}/{execution.total_stocks}
        </TableCell>
        <TableCell>{execution.duration_seconds?.toFixed(2)}s</TableCell>
      </TableRow>
      
      {/* Expandable error details */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              {execution.errors && execution.errors.length > 0 ? (
                <>
                  <Typography variant="subtitle2" gutterBottom color="error">
                    Errors ({execution.errors.length}):
                  </Typography>
                  {execution.errors.map((error, idx) => (
                    <Alert severity="error" key={idx} sx={{ mb: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {execution.failed_stocks && execution.failed_stocks[idx]}
                      </Typography>
                      <Typography variant="body2">
                        {error}
                      </Typography>
                    </Alert>
                  ))}
                  
                  {execution.fetched_stocks && execution.fetched_stocks.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom color="success.main">
                        Successfully Fetched:
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {execution.fetched_stocks.map((stock) => (
                          <Chip 
                            key={stock}
                            label={stock}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </>
              ) : (
                <Alert severity="success">
                  All stocks fetched successfully
                </Alert>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function JobExecutionHistory({ jobId, jobName, limit = 20, open, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const loadHistory = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filterValue = statusFilter === 'all' ? null : statusFilter;
      const data = await getJobExecutionHistory(jobId, limit, filterValue);
      setHistory(data || []);
    } catch (err) {
      console.error('Failed to load history:', err);
      setError(err.message || 'Failed to load execution history');
    } finally {
      setLoading(false);
    }
  }, [jobId, limit, statusFilter]);

  useEffect(() => {
    if (jobId && open) {
      loadHistory();
    }
  }, [jobId, open, loadHistory]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    if (history.length === 0) {
      return (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            No execution history found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {statusFilter !== 'all' 
              ? 'Try changing the status filter'
              : 'This job has not been executed yet'
            }
          </Typography>
        </Paper>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 50 }} />
              <TableCell><strong>Execution Time</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Success/Total</strong></TableCell>
              <TableCell><strong>Duration</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((execution) => (
              <ExecutionRow key={execution.execution_id} execution={execution} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // If used as a dialog
  if (open !== undefined && onClose) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          Execution History
          {jobName && (
            <Typography variant="body2" color="textSecondary">
              {jobName}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" alignItems="center" justifyContent="flex-end" mb={2}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                label="Status Filter"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="partial_success">Partial Success</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {renderContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  // If used as a standalone component
  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">
          Execution History
          {jobName && (
            <Typography variant="body2" color="textSecondary" component="span" sx={{ ml: 1 }}>
              - {jobName}
            </Typography>
          )}
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            label="Status Filter"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="success">Success</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="partial_success">Partial Success</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {renderContent()}
    </Box>
  );
}

export default JobExecutionHistory;
