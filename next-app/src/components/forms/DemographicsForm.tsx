"use client";

import React from 'react';
import {
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useFormContext } from '@/context/FormContext';

export default function DemographicsForm() {
  const { formData, updateFormData } = useFormContext();

  const handleInputChange = (field: string, value: any) => {
    updateFormData({
      demographics: {
        ...formData.demographics,
        [field]: value
      }
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Demographics Information
      </Typography>
      
      <Stack spacing={3}>
        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.demographics.category}
            label="Category"
            onChange={(e) => handleInputChange('category', e.target.value)}
          >
            <MenuItem value="General">General</MenuItem>
            <MenuItem value="OBC">OBC (Other Backward Classes)</MenuItem>
            <MenuItem value="SC">SC (Scheduled Caste)</MenuItem>
            <MenuItem value="ST">ST (Scheduled Tribe)</MenuItem>
            <MenuItem value="EWS">EWS (Economically Weaker Section)</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth required>
          <InputLabel>Marital Status</InputLabel>
          <Select
            value={formData.demographics.maritalStatus}
            label="Marital Status"
            onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
          >
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="Married">Married</MenuItem>
            <MenuItem value="Divorced">Divorced</MenuItem>
            <MenuItem value="Widowed">Widowed</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Religion"
          variant="outlined"
          value={formData.demographics.religion}
          onChange={(e) => handleInputChange('religion', e.target.value)}
        />

        <TextField
          fullWidth
          label="Caste"
          variant="outlined"
          value={formData.demographics.caste}
          onChange={(e) => handleInputChange('caste', e.target.value)}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.demographics.disability}
              onChange={(e) => handleInputChange('disability', e.target.checked)}
            />
          }
          label="Person with Disability (PWD)"
        />
      </Stack>
    </Paper>
  );
}