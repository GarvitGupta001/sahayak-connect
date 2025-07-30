"use client";

import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import { useFormContext } from '@/context/FormContext';

export default function LocationForm() {
  const { formData, updateFormData } = useFormContext();

  const handleInputChange = (field: string, value: any) => {
    updateFormData({
      location: {
        ...formData.location,
        [field]: value
      }
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Location Information
      </Typography>
      
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="State"
          variant="outlined"
          value={formData.location.state}
          onChange={(e) => handleInputChange('state', e.target.value)}
          required
        />

        <TextField
          fullWidth
          label="District"
          variant="outlined"
          value={formData.location.district}
          onChange={(e) => handleInputChange('district', e.target.value)}
          required
        />

        <TextField
          fullWidth
          label="Pincode"
          variant="outlined"
          value={formData.location.pincode}
          onChange={(e) => handleInputChange('pincode', e.target.value)}
          inputProps={{ pattern: '[0-9]{6}', maxLength: 6 }}
          required
          helperText="6-digit pincode"
        />

        <TextField
          fullWidth
          label="Address"
          variant="outlined"
          multiline
          rows={3}
          value={formData.location.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter complete address"
        />
      </Stack>
    </Paper>
  );
}