// src/components/scheduler/JobCreationDialog.js

import React, { useState } from 'react';
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
  Typography
} from '@mui/material';
import { createScheduledJob } from '../../services/api';

function JobCreationDialog({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    stock_ids: [],
    schedule_time: '17:00',
    start_date: '',
    end_date: '',
    prefix: 'scheduled_stock_data'
  });
  
  const [stockInput, setStockInput] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!formData.name) {
      setError('Job name is required');
      return;
    }
    if (formData.stock_ids.length === 0) {
      setError('At least one stock ID is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createScheduledJob(formData);
      onSuccess();
      setFormData({
        name: '',
        stock_ids: [],
        schedule_time: '17:00',
        start_date: '',
        end_date: '',
        prefix: 'scheduled_stock_data'
      });
    } catch (err) {
      setError(`Failed to create job: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Scheduled Job</DialogTitle>
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
            placeholder="e.g., Daily Tech Stocks"
          />

          <Box>
            <TextField
              label="Add Stock ID"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="e.g., AAPL"
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
            {formData.stock_ids.length === 0 && (
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                No stocks added yet. Add at least one stock symbol.
              </Typography>
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
            helperText="Daily execution time (24-hour format)"
          />

          <TextField
            label="Start Date (Optional)"
            type="date"
            value={formData.start_date}
            onChange={(e) => handleInputChange('start_date', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            helperText="Leave empty to fetch last 30 days"
          />

          <TextField
            label="End Date (Optional)"
            type="date"
            value={formData.end_date}
            onChange={(e) => handleInputChange('end_date', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            helperText="Leave empty for today"
          />

          <TextField
            label="Data Prefix"
            value={formData.prefix}
            onChange={(e) => handleInputChange('prefix', e.target.value)}
            fullWidth
            helperText="Redis key prefix for storing data"
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
          {isSubmitting ? 'Creating...' : 'Create Job'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default JobCreationDialog;
