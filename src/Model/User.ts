import mongoose , { Schema, Types } from "mongoose";

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    isCreator: boolean;
    quizzes?: [Types.ObjectId];
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
    quizzes: { 
        type: [Schema.Types.ObjectId],
        ref: 'Quiz'
    },
})

const UserModel = mongoose.models.User || mongoose.model('User' , userSchema)

export default UserModel