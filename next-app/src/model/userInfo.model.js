import mongoose, { Schema } from "mongoose";

const userInfoSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },

    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
        type: String,
        unique: true,
        lowercase: true,
        match: [
            /^\w+([-.]?\w+)*@\w+([-.]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email",
        ],
    },

    age: {
        type: Number,
        required: [true, "Age is required"],
        min: [18, "Must be at least 18 years old"],
        max: [120, "Invalid age"],
    },

    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"],
    },

    preferredLanguage: {
        type: String,
        required: true,
        enum: [
            "en",
            "hi",
            "te",
            "ta",
            "bn",
            "gu",
            "kn",
            "ml",
            "mr",
            "or",
            "pa",
            "ur",
        ],
        default: "en",
    },

    emailVerified: {
        type: Boolean,
        default: false,
    },

    location: {
        state: {
            type: String,
            required: [true, "State is required"],
        },
        district: {
            type: String,
            required: [true, "District is required"],
        },
        pincode: {
            type: String,
            required: [true, "Pincode is required"],
            match: [/^\d{6}$/, "Invalid pincode format"],
        },
        address: String,
    },

    demographics: {
        category: {
            type: String,
            required: true,
            enum: ["General", "OBC", "SC", "ST", "EWS"],
        },
        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female", "Other"],
        },
        maritalStatus: {
            type: String,
            required: true,
            enum: ["Single", "Married", "Divorced", "Widowed"],
        },
        disability: {
            type: Boolean,
            default: false,
        },
        religion: String,
        caste: String,
    },

    income: {
        annual: {
            type: Number,
            required: true,
            min: [0, "Income cannot be negative"],
        },
        source: {
            type: String,
            required: true,
            enum: [
                "Salaried",
                "Business",
                "Agriculture",
                "Daily Wage",
                "Unemployed",
                "Other",
            ],
        },
        verified: {
            type: Boolean,
            default: false,
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },

    education: {
        level: {
            type: String,
            required: true,
            enum: [
                "Primary",
                "Secondary",
                "Higher Secondary",
                "Graduate",
                "Post Graduate",
                "Doctorate",
            ],
        },
        field: String,
        institution: String,
        graduationYear: {
            type: Number,
            min: [1950, "Invalid graduation year"],
            max: [
                new Date().getFullYear(),
                "Future graduation year not allowed",
            ],
        },
    },

    aiAttributes: {
        keywords: [
            {
                type: String,
                trim: true,
            },
        ],
        lastAnalyzed: Date,
    },
});

export const UserInfo =
    mongoose.models.userInfo || mongoose.model("userInfo", userInfoSchema);
