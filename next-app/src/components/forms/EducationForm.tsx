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

export default function EducationForm() {
  const { formData, updateFormData } = useFormContext();

  const handleInputChange = (field: string, value: any) => {
    updateFormData({
      education: {
        ...formData.education,
        [field]: value
      }
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => 1950 + i).reverse();

  return (
    <Paper elevation={2} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Education Information
      </Typography>
      
      <Stack spacing={3}>
        <FormControl fullWidth required>
          <InputLabel>Education Level</InputLabel>
          <Select
            value={formData.education.level}
            label="Education Level"
            onChange={(e) => handleInputChange('level', e.target.value)}
          >
            <MenuItem value="Primary">Primary</MenuItem>
            <MenuItem value="Secondary">Secondary</MenuItem>
            <MenuItem value="Higher Secondary">Higher Secondary</MenuItem>
            <MenuItem value="Graduate">Graduate</MenuItem>
            <MenuItem value="Post Graduate">Post Graduate</MenuItem>
            <MenuItem value="Doctorate">Doctorate</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Field of Study"
          variant="outlined"
          value={formData.education.field}
          onChange={(e) => handleInputChange('field', e.target.value)}
          placeholder="e.g., Computer Science, Arts, Commerce, etc."
        />

        <TextField
          fullWidth
          label="Institution/School/College"
          variant="outlined"
          value={formData.education.institution}
          onChange={(e) => handleInputChange('institution', e.target.value)}
        />

        <FormControl fullWidth>
          <InputLabel>Graduation Year</InputLabel>
          <Select
            value={formData.education.graduationYear}
            label="Graduation Year"
            onChange={(e) => handleInputChange('graduationYear', e.target.value)}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
}