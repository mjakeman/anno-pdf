import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IPage {
    annotations: Object[]
}

const pageSchema = new Schema<IPage>({
    annotations: [Object]
});


interface IOwner {
    uid: string;
    email: string;
    name?: string;
}

interface IDocument extends Document {
    owner: IOwner;
    title: string;
    sharedWith: string[];
    lastUpdatedBy?: string;
    uuid: string;
    pages: IPage[];
    createdAt?: Date;
    updatedAt?: Date;
}

// Mongoose schema for a document object
const documentSchema = new Schema<IDocument>({
    owner: {
        uid: { type: String, required: true },
        email: { type: String, required: true },
        name: { type: String },
    },
    title: { type: String, required: true },
    sharedWith: [String],
    lastUpdatedBy: String,
    uuid: { type: String, required: true, unique: true },
    pages: { type: [pageSchema]}
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

export { Document };