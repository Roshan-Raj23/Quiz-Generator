import mongoose from "mongoose";

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    isCreator: boolean;
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isCreator: {
        type: Boolean,
        default: false,
    },
})

const UserModel = mongoose.models.User || mongoose.model('User' , userSchema)

export default UserModel