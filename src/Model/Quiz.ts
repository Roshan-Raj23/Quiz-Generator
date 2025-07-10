import mongoose, { Schema, Document , Types } from 'mongoose';

export interface Question extends Document {
    id: string;
    question: string;
    options: string[];
    type: "multiple-choice" | "true-false";
    correctAnswer: number;
}

const QuestionSchema: Schema<Question> = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    question: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
    type: {
        type: String,
        enum: ["multiple-choice", "true-false"],
        required: true,
    },
    correctAnswer: {
        type: Number,
        required: true,
    }
});

export interface Quiz extends Document {
    id: number;
    quizTitle: string;
    quizDescription: string;
    difficulty: string;
    timeLimit: boolean;
    timeLimitTotal: number;
    timeLimitMinutes: number;
    makeStrict: boolean;
    questions: Question[];
    creator: Types.ObjectId;
    creatorUsername: string;
    createdAt: Date;
    noofResponses: number;
    isDraft: boolean;
    averageScore?: number;
}

const QuizSchema: Schema<Quiz> = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    quizTitle: {
        type: String,
        required: true
    },
    quizDescription: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    timeLimit: {
        type: Boolean,
        required: true,
        default: false
    },
    timeLimitTotal: {
        type: Number,
        required: true,
        default: 1
    },
    timeLimitMinutes: {
        type: Number,
        required: true,
        default: 1
    },
    makeStrict: {
        type: Boolean,
        required: true,
        default: false,
    },
    questions: {
        type: [QuestionSchema],
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    creatorUsername: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    noofResponses: {
        type: Number,
        required: true,
        default: 0
    },
    isDraft: {
        type: Boolean,
        required: true,
        default: false
    },
    averageScore: {
        type: Number,
        required: true,
        default: 0
    }
});

const QuizModel = (mongoose.models.Quiz as mongoose.Model<Quiz>) || mongoose.model<Quiz>('Quiz', QuizSchema);

export default QuizModel;