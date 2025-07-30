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
} from '@mui/material';
import { useFormContext } from '@/context/FormContext';

export default function PersonalDetailsForm() {
  const { formData, updateFormData } = useFormContext();

  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
  };

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'te', label: 'Telugu' },
    { value: 'ta', label: 'Tamil' },
    { value: 'bn', label: 'Bengali' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'kn', label: 'Kannada' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'mr', label: 'Marathi' },
    { value: 'or', label: 'Odia' },
    { value: 'pa', label: 'Punjabi' },
    { value: 'ur', label: 'Urdu' }
  ];

  return (
    <Paper elevation={2} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Personal Details
      </Typography>
      
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Full Name"
          variant="outlined"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
        />

        <TextField
          fullWidth
          label="Email Address"
          type="email"
          variant="outlined"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Age"
            type="number"
            variant="outlined"
            value={formData.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 18)}
            inputProps={{ min: 18, max: 120 }}
            required
            sx={{ flex: 1 }}
          />

          <FormControl required sx={{ flex: 1 }}>
            <InputLabel>Gender</InputLabel>
            <Select
              value={formData.gender}
              label="Gender"
              onChange={(e) => handleInputChange('gender', e.target.value)}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <FormControl fullWidth required>
          <InputLabel>Preferred Language</InputLabel>
          <Select
            value={formData.preferredLanguage}
            label="Preferred Language"
            onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
          >
            {languageOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
}