import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Mongoose schema for a user object
const userSchema = new Schema({
    uid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export { User };