import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    uuid: { type: String, required: true, unique: true },
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export { User };