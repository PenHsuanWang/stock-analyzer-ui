// src/components/scheduler/JobsTable.js

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { format } from 'date-fns';

function JobsTable({ jobs, onEdit, onDelete, onToggle }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'running':
        return 'info';
      case 'failed':
        return 'error';
      case 'paused':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    } catch {
      return dateString;
    }
  };

  if (jobs.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No scheduled jobs found
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Create your first job to get started!
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell><strong>Stocks</strong></TableCell>
            <TableCell><strong>Schedule</strong></TableCell>
            <TableCell><strong>Date Range</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Last Run</strong></TableCell>
            <TableCell><strong>Next Run</strong></TableCell>
            <TableCell><strong>Active</strong></TableCell>
            <TableCell align="right"><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.job_id} hover>
              <TableCell>{job.name}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {job.stock_ids.slice(0, 3).map((stock) => (
                    <Chip key={stock} label={stock} size="small" />
                  ))}
                  {job.stock_ids.length > 3 && (
                    <Chip label={`+${job.stock_ids.length - 3}`} size="small" />
                  )}
                </Box>
              </TableCell>
              <TableCell>{job.schedule_time}</TableCell>
              <TableCell>
                {job.duration_days ? (
                  <Chip 
                    label={`Last ${job.duration_days} days`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                ) : job.start_date ? (
                  <Box sx={{ fontSize: '0.875rem' }}>
                    {job.start_date}
                    <br />
                    to {job.end_date || 'today'}
                  </Box>
                ) : (
                  <Chip label="Last 30 days" size="small" variant="outlined" />
                )}
              </TableCell>
              <TableCell>
                <Chip
                  label={job.status}
                  color={getStatusColor(job.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>{formatDate(job.last_run)}</TableCell>
              <TableCell>{formatDate(job.next_run)}</TableCell>
              <TableCell>
                <Chip
                  label={job.is_active ? 'Yes' : 'No'}
                  color={job.is_active ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title={job.is_active ? 'Stop Job' : 'Start Job'}>
                  <IconButton
                    onClick={() => onToggle(job)}
                    color={job.is_active ? 'error' : 'success'}
                    size="small"
                  >
                    {job.is_active ? <StopIcon /> : <PlayArrowIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit Job">
                  <IconButton onClick={() => onEdit(job)} size="small">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Job">
                  <IconButton onClick={() => onDelete(job.job_id)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default JobsTable;
