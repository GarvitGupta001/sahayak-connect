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
  InputAdornment,
} from '@mui/material';
import { useFormContext } from '@/context/FormContext';

export default function IncomeForm() {
  const { formData, updateFormData } = useFormContext();

  const handleInputChange = (field: string, value: any) => {
    updateFormData({
      income: {
        ...formData.income,
        [field]: value
      }
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Income Information
      </Typography>
      
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Annual Income"
          type="number"
          variant="outlined"
          value={formData.income.annual}
          onChange={(e) => handleInputChange('annual', parseInt(e.target.value) || 0)}
          inputProps={{ min: 0 }}
          required
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
        />

        <FormControl fullWidth required>
          <InputLabel>Income Source</InputLabel>
          <Select
            value={formData.income.source}
            label="Income Source"
            onChange={(e) => handleInputChange('source', e.target.value)}
          >
            <MenuItem value="Salaried">Salaried</MenuItem>
            <MenuItem value="Business">Business</MenuItem>
            <MenuItem value="Agriculture">Agriculture</MenuItem>
            <MenuItem value="Daily Wage">Daily Wage</MenuItem>
            <MenuItem value="Unemployed">Unemployed</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
}