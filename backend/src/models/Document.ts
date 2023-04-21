import mongoose from "mongoose";

const Schema = mongoose.Schema;

const documentSchema = new Schema({
    createdBy: { type: String, required: true },
    title: { type: String, required: true },
    sharedWith: [String],
    lastUpdatedBy: String
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

export { Document };