// src/pages/JobSchedulerPage.js

import React, { useState, useEffect } from 'react';
import BasePage from './BasePage';
import {
  Container,
  Grid,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

import JobCreationDialog from '../components/scheduler/JobCreationDialog';
import JobEditDialog from '../components/scheduler/JobEditDialog';
import JobsTable from '../components/scheduler/JobsTable';
import SchedulerStatusCard from '../components/scheduler/SchedulerStatusCard';

import {
  getScheduledJobs,
  getSchedulerStatus,
  deleteScheduledJob,
  startScheduledJob,
  stopScheduledJob
} from '../services/api';

import '../styles/JobSchedulerPage.css';

function JobSchedulerPage() {
  const [jobs, setJobs] = useState([]);
  const [schedulerStatus, setSchedulerStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  useEffect(() => {
    loadJobs();
    loadSchedulerStatus();
    
    const interval = setInterval(() => {
      loadJobs();
      loadSchedulerStatus();
    }, 30000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showActiveOnly]);

  const loadJobs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getScheduledJobs(showActiveOnly);
      setJobs(data);
    } catch (err) {
      setError(`Failed to load jobs: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSchedulerStatus = async () => {
    try {
      const status = await getSchedulerStatus();
      setSchedulerStatus(status);
    } catch (err) {
      console.error('Failed to load scheduler status:', err);
    }
  };

  const handleCreateJob = () => {
    setCreateDialogOpen(true);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setEditDialogOpen(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }
    
    try {
      await deleteScheduledJob(jobId);
      setSuccess('Job deleted successfully');
      loadJobs();
    } catch (err) {
      setError(`Failed to delete job: ${err.message}`);
    }
  };

  const handleToggleJob = async (job) => {
    try {
      if (job.is_active) {
        await stopScheduledJob(job.job_id);
        setSuccess('Job stopped successfully');
      } else {
        await startScheduledJob(job.job_id);
        setSuccess('Job started successfully');
      }
      loadJobs();
    } catch (err) {
      setError(`Failed to toggle job: ${err.message}`);
    }
  };

  const handleJobCreated = () => {
    setCreateDialogOpen(false);
    setSuccess('Job created successfully');
    loadJobs();
  };

  const handleJobUpdated = () => {
    setEditDialogOpen(false);
    setSuccess('Job updated successfully');
    loadJobs();
  };

  return (
    <BasePage>
      <Container maxWidth="xl" className="job-scheduler-page">
        <Box className="page-header">
          <Typography variant="h4" component="h1" gutterBottom>
            📅 Job Scheduler
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage scheduled jobs for automatic stock data fetching
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <SchedulerStatusCard status={schedulerStatus} onRefresh={loadSchedulerStatus} />
          </Grid>

          <Grid item xs={12} md={8}>
            <Box className="quick-actions">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateJob}
              >
                Create New Job
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadJobs}
                disabled={isLoading}
              >
                Refresh
              </Button>
              <Button
                variant={showActiveOnly ? 'contained' : 'outlined'}
                onClick={() => setShowActiveOnly(!showActiveOnly)}
              >
                {showActiveOnly ? 'Show All' : 'Active Only'}
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            {isLoading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <JobsTable
                jobs={jobs}
                onEdit={handleEditJob}
                onDelete={handleDeleteJob}
                onToggle={handleToggleJob}
              />
            )}
          </Grid>
        </Grid>

        <JobCreationDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSuccess={handleJobCreated}
        />

        <JobEditDialog
          open={editDialogOpen}
          job={selectedJob}
          onClose={() => setEditDialogOpen(false)}
          onSuccess={handleJobUpdated}
        />
      </Container>
    </BasePage>
  );
}

export default JobSchedulerPage;
