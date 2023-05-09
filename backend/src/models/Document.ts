import mongoose from "mongoose";

const Schema = mongoose.Schema;

const pageSchema = new Schema({
    width: Number,
    height: Number,
    annotations: [Object]
});

const documentSchema = new Schema({
    owner: {
        uid: { type: String, required: true },
        email: { type: String, required: true },
        name: { type: String },
    },
    title: { type: String, required: true },
    sharedWith: [String],
    lastUpdatedBy: String,
    uuid: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    pages: { type: [pageSchema] /*, required: true */}
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

export { Document };