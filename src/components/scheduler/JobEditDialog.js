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
  Switch
} from '@mui/material';
import { updateScheduledJob } from '../../services/api';

function JobEditDialog({ open, job, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    stock_ids: [],
    schedule_time: '17:00',
    start_date: '',
    end_date: '',
    is_active: true
  });
  
  const [stockInput, setStockInput] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        name: job.name,
        stock_ids: job.stock_ids || [],
        schedule_time: job.schedule_time,
        start_date: job.start_date || '',
        end_date: job.end_date || '',
        is_active: job.is_active
      });
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

    setIsSubmitting(true);
    setError(null);

    try {
      await updateScheduledJob(job.job_id, formData);
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
