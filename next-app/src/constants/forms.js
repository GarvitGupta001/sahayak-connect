import { OrderedMap } from "immutable";
import { INPUT_TYPES } from "./inputTypes";

export const PERSONAL_DETAILS_FORM = new OrderedMap({
    name: {
        label: "Full Name",
        type: INPUT_TYPES.TEXT,
        required: true,
        full_width: true,
    },
    email: {
        label: "Email Address",
        type: INPUT_TYPES.TEXT,
        required: false,
        full_width: true,
    },
    age: {
        label: "Age",
        type: INPUT_TYPES.NUMBER,
        required: true,
        full_width: true,
    },
    gender: {
        label: "Gender",
        type: INPUT_TYPES.SELECT,
        required: true,
        options: [
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
        ],
        full_width: true,
    },
    preferredLanguage: {
        label: "Preferred Language",
        type: INPUT_TYPES.SELECT,
        required: true,
        options: [
            { value: "en", label: "English" },
            { value: "hi", label: "Hindi" },
        ],
        full_width: true,
    },
});

export const LOCATION_FORM = {
    state: {
        label: "State",
        type: INPUT_TYPES.TEXT,
        required: true,
        full_width: true,
    },
    district: {
        label: "District",
        type: INPUT_TYPES.TEXT,
        required: false,
        full_width: true,
    },
    pincode: {
        label: "Pincode",
        type: INPUT_TYPES.TEXT,
        required: false,
        full_width: true,
    }
};

export const DEMOGRAPHICS_FORM = {
    category: {
        label: "Category",
        type: INPUT_TYPES.SELECT,
        required: true,
        options: [
            { value: "General", label: "General" },
            { value: "OBC", label: "OBC" },
            { value: "SC", label: "SC" },
            { value: "ST", label: "ST" },
            { value: "EWS", label: "EWS" },
        ],
        full_width: true,
    },
    maritalStatus: {
        label: "Marital Status",
        type: INPUT_TYPES.SELECT,
        required: true,
        options: [
            { value: "Single", label: "Single" },
            { value: "Married", label: "Married" },
            { value: "Divorced", label: "Divorced" },
            { value: "Widowed", label: "Widowed" },
        ],
        full_width: true,
    },
    disability: {
        label: "Disability",
        type: INPUT_TYPES.CHECKBOX,
        required: false,
        full_width: true,
    },
    religion: {
        label: "Religion",
        type: INPUT_TYPES.TEXT,
        required: false,
        full_width: true,
    },
    caste: {
        label: "Caste",
        type: INPUT_TYPES.TEXT,
        required: false,
        full_width: true,
    },
};

export const INCOME_FORM = {
    annual: {
        label: "Annual Income (approx)",
        type: INPUT_TYPES.NUMBER,
        required: true,
        full_width: true,
    },
    source: {
        label: "Source of Income",
        type: INPUT_TYPES.SELECT,
        required: true,
        options: [
            { value: "Salaried", label: "Salaried" },
            { value: "Business", label: "Business" },
            { value: "Agriculture", label: "Agriculture" },
            { value: "Daily Wage", label: "Daily Wage" },
            { value: "Unemployed", label: "Unemployed" },
            { value: "Other", label: "Other" },
        ],
        full_width: true,
    },
    verified: {
        label: "Income Verified",
        type: INPUT_TYPES.CHECKBOX,
        required: false,
        full_width: true,
    },
    lastUpdated: {
        label: "Last Updated",
        type: INPUT_TYPES.DATE,
        required: false,
        full_width: true,
    },
};

export const EDUCATION_FORM = {
    level: {
        label: "Education Level",
        type: INPUT_TYPES.SELECT,
        required: true,
        options: [
            { value: "Primary", label: "Primary School" },
            { value: "Secondary", label: "Secondary School" },
            { value: "Higher Secondary", label: "Higher Secondary" },
            { value: "Graduate", label: "Graduate" },
            { value: "Post Graduate", label: "Post Graduate" },
            { value: "Doctorate", label: "Doctorate" },
        ],
        full_width: true,
    },
    field: {
        label: "Field of Study",
        type: INPUT_TYPES.TEXT,
        required: false,
        full_width: true,
    },
    institution: {
        label: "Institution",
        type: INPUT_TYPES.TEXT,
        required: false,
        full_width: true,
    },
    graduationYear: {
        label: "Graduation Year",
        type: INPUT_TYPES.NUMBER,
        required: false,
        full_width: true,
    },
};
