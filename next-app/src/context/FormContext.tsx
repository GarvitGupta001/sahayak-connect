"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface FormData {
  // Personal Details
  name: string;
  email: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  preferredLanguage: string;

  // Location Information
  location: {
    state: string;
    district: string;
    pincode: string;
    address: string;
  };

  // Demographics
  demographics: {
    category: "General" | "OBC" | "SC" | "ST" | "EWS";
    maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
    disability: boolean;
    religion: string;
    caste: string;
  };

  // Income Information
  income: {
    annual: number;
    source: "Salaried" | "Business" | "Agriculture" | "Daily Wage" | "Unemployed" | "Other";
  };

  // Education Information
  education: {
    level: "Primary" | "Secondary" | "Higher Secondary" | "Graduate" | "Post Graduate" | "Doctorate";
    field: string;
    institution: string;
    graduationYear: number;
  };
}

const initialFormData: FormData = {
  name: '',
  email: '',
  age: 18,
  gender: 'Male',
  preferredLanguage: 'en',
  location: {
    state: '',
    district: '',
    pincode: '',
    address: ''
  },
  demographics: {
    category: 'General',
    maritalStatus: 'Single',
    disability: false,
    religion: '',
    caste: ''
  },
  income: {
    annual: 0,
    source: 'Unemployed'
  },
  education: {
    level: 'Primary',
    field: '',
    institution: '',
    graduationYear: new Date().getFullYear()
  }
};

interface FormContextType {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('userFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Validate that parsedData has the expected structure
        if (parsedData && typeof parsedData === 'object' && 'name' in parsedData) {
          setFormData(parsedData);
        } else {
          console.warn('Invalid saved form data structure, using defaults');
        }
      } catch (error) {
        console.error('Error parsing saved form data:', error);
        // Optionally clear corrupted data
        localStorage.removeItem('userFormData');
      }
    }
  }, []);
  // Save data to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('userFormData', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    localStorage.removeItem('userFormData');
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, resetForm }}>
      {children}
    </FormContext.Provider>
  );
};
