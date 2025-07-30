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
  const [consent, setConsent] = React.useState(false);

  // Ensure demographics object exists
  if (!formData.demographics) {
    console.warn('Demographics data not initialized in form context');
    return null;
  }
  const handleInputChange = (
    field: keyof typeof formData.demographics,
    value: string | boolean
  ) => {
    updateFormData({
      demographics: {
        ...formData.demographics,
        [field]: value
      }
    });
  };

  // Privacy notice text
  const privacyNotice = `We value your privacy. The following demographic questions (religion, caste, disability) are voluntary and confidential. This information is collected solely for statistical reporting and to help us ensure equal opportunity and access. Your responses will not affect your application or eligibility in any way. Data is stored securely, accessible only to authorized personnel, and retained only as long as required by law. You may choose not to answer any or all of these questions. For more information, see our privacy policy.`;

  return (
    <Paper elevation={2} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Demographics Information
      </Typography>

      <Box sx={{ mb: 3, p: 2, background: '#f5f5f5', borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Typography variant="body2" color="textSecondary">
          {privacyNotice}
        </Typography>
      </Box>

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

        {/* Voluntary Self-Identification Panel */}
        <Box sx={{ border: '1px solid #1976d2', borderRadius: 2, p: 2, background: '#e3f2fd', mt: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, color: '#1976d2' }}>
            Voluntary Self-Identification
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            The following fields are optional and used only for statistical reporting. You may leave them blank.
          </Typography>
          <TextField
            fullWidth
            label="Religion (optional)"
            variant="outlined"
            value={formData.demographics.religion}
            onChange={(e) => handleInputChange('religion', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Caste (optional)"
            variant="outlined"
            value={formData.demographics.caste}
            onChange={(e) => handleInputChange('caste', e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!formData.demographics.disability}
                onChange={(e) => handleInputChange('disability', e.target.checked)}
              />
            }
            label="Person with Disability (PWD) (optional)"
          />
        </Box>

        {/* Consent Checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
          }
          label="I understand that providing religion, caste, and disability information is voluntary and will only be used for statistical reporting."
        />
      </Stack>
    </Paper>
  );
}