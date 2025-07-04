import mongoose, { Schema, Document , Types } from 'mongoose';

export interface Question extends Document {
    question: string;
    options: string[];
    correctAnswer: number;
}

const QuestionSchema: Schema<Question> = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
    correctAnswer: {
        type: Number,
        required: true,
    }
});

export interface Quiz extends Document {
    id: number;
    questions: Question[];
    creator: Types.ObjectId;
}

const QuizSchema: Schema<Quiz> = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    questions: {
        type: [QuestionSchema],
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    }
});

const QuizModel = (mongoose.models.Quiz as mongoose.Model<Quiz>) || mongoose.model<Quiz>('Quiz', QuizSchema);

export default QuizModel;