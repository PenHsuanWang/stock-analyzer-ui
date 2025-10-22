// src/components/scheduler/JobEditDialog.js

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Chip,
  Alert,
  FormControlLabel,
  Switch,
  FormControl,
  RadioGroup,
  Radio,
  Typography,
  Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { updateScheduledJob } from '../../services/api';

function JobEditDialog({ open, job, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    stock_ids: [],
    schedule_time: '17:00',
    start_date: '',
    end_date: '',
    duration_days: '',
    is_active: true
  });
  
  const [stockInput, setStockInput] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useSlidingWindow, setUseSlidingWindow] = useState(false);

  useEffect(() => {
    if (job) {
      const hasDuration = job.duration_days && job.duration_days > 0;
      setFormData({
        name: job.name,
        stock_ids: job.stock_ids || [],
        schedule_time: job.schedule_time,
        start_date: job.start_date || '',
        end_date: job.end_date || '',
        duration_days: job.duration_days || '',
        is_active: job.is_active
      });
      setUseSlidingWindow(hasDuration);
    }
  }, [job]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddStock = () => {
    const stock = stockInput.trim().toUpperCase();
    if (stock && !formData.stock_ids.includes(stock)) {
      setFormData({
        ...formData,
        stock_ids: [...formData.stock_ids, stock]
      });
      setStockInput('');
    }
  };

  const handleRemoveStock = (stockToRemove) => {
    setFormData({
      ...formData,
      stock_ids: formData.stock_ids.filter(stock => stock !== stockToRemove)
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddStock();
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || formData.stock_ids.length === 0) {
      setError('Job name and at least one stock ID are required');
      return;
    }
    if (useSlidingWindow && (!formData.duration_days || formData.duration_days <= 0)) {
      setError('Duration days must be a positive number when using sliding window');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = { ...formData };
      if (useSlidingWindow) {
        payload.duration_days = parseInt(formData.duration_days);
        payload.start_date = null;
      } else {
        payload.duration_days = null;
      }
      
      await updateScheduledJob(job.job_id, payload);
      onSuccess();
    } catch (err) {
      setError(`Failed to update job: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Job: {job.name}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Job Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            fullWidth
            required
          />

          <Box>
            <TextField
              label="Add Stock ID"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="e.g., MSFT"
              fullWidth
            />
            <Button onClick={handleAddStock} sx={{ mt: 1 }} variant="outlined" size="small">
              Add Stock
            </Button>
            {formData.stock_ids.length > 0 && (
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap', p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                {formData.stock_ids.map((stock) => (
                  <Chip
                    key={stock}
                    label={stock}
                    onDelete={() => handleRemoveStock(stock)}
                    color="primary"
                  />
                ))}
              </Box>
            )}
          </Box>

          <TextField
            label="Schedule Time"
            type="time"
            value={formData.schedule_time}
            onChange={(e) => handleInputChange('schedule_time', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />

          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Date Range Configuration
              </Typography>
              <Tooltip title="Choose between fixed dates or a sliding window">
                <InfoIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary' }} />
              </Tooltip>
            </Box>
            
            <FormControl component="fieldset">
              <RadioGroup
                value={useSlidingWindow ? 'sliding' : 'fixed'}
                onChange={(e) => setUseSlidingWindow(e.target.value === 'sliding')}
              >
                <FormControlLabel 
                  value="fixed" 
                  control={<Radio />} 
                  label="Fixed Date Range" 
                />
                <FormControlLabel 
                  value="sliding" 
                  control={<Radio />} 
                  label="Sliding Window (Last N Days)" 
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {useSlidingWindow ? (
            <TextField
              label="Duration (Days)"
              type="number"
              value={formData.duration_days}
              onChange={(e) => handleInputChange('duration_days', e.target.value)}
              fullWidth
              required
              inputProps={{ min: 1 }}
              helperText="Number of days to fetch from today"
            />
          ) : (
            <>
              <TextField
                label="Start Date (Optional)"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                label="End Date (Optional)"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </>
          )}

          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                color="primary"
              />
            }
            label="Active"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Job'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default JobEditDialog;
