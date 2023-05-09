import mongoose from "mongoose";

const Schema = mongoose.Schema;

const documentSchema = new Schema({
    owner: {
        uid: { type: String, required: true },
        email: { type: String, required: true },
        name: { type: String },
    },
    title: { type: String, required: true },
    sharedWith: [String],
    lastUpdatedBy: String,
    annotations: [Object],
    uuid: { type: String, required: true, unique: true }
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

export { Document };