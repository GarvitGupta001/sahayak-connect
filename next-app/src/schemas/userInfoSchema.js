import { z } from "zod";

export const personalDetailsSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email format").optional(),
    age: z.number().int().min(0, "Age must be a positive number"),
    gender: z.enum(["Male", "Female", "Other"]),
    preferredLanguage: z.string().min(1, "Preferred language is required"),
});

export const demographicsSchema = z.object({
    category: z.enum(["General", "OBC", "SC", "ST", "EWS"]),
    maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"]),
    disability: z.boolean(),
    religion: z.string().optional(),
    caste: z.string().optional(),
});

export const educationSchema = z.object({
    level: z.enum([
        "Primary",
        "Secondary",
        "Higher Secondary",
        "Graduate",
        "Post Graduate",
        "Doctorate",
    ]),
    field: z.string().optional(),
    institution: z.string().optional(),
    graduationYear: z
        .number()
        .int()
        .min(1900)
        .max(new Date().getFullYear() + 20)
        .optional(),
});

export const incomeSchema = z.object({
    annual: z.number().min(0, "Annual income must be non-negative"),
    source: z.enum([
        "Salaried",
        "Business",
        "Agriculture",
        "Daily Wage",
        "Unemployed",
        "Other",
    ]),
    verified: z.boolean(),
    lastUpdated: z.date().optional(),
});

export const locationSchema = z.object({
    state: z.string().min(1, "State is required"),
    district: z.string().optional(),
    pincode: z.string().optional(),
    address: z.string().optional(),
});
