import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema({
    scheme_id: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    scheme_name: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    benefits: {
        type: String,
        required: true,
    },
    documents: {
        type: String,
        required: true,
    },
    schemeCategory: {
        type: [String],
        required: true,
    },
    tags: {
        type: [String],
        required: true,
    },
});

const SchemeModel =
    mongoose.models.schemes || mongoose.model("schemes", schemeSchema);

export default SchemeModel;
