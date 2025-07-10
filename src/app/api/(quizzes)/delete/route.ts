import QuizModel, { Quiz } from "@/Model/Quiz";
import connectToDatabase from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { id } = await request.json();

        // Find the quiz by id
        const quiz = await QuizModel.findOne({ id }) as Quiz;
        if (!quiz) {
            return NextResponse.json({ error: "Quiz not found or not authorized", status: 404 });
        }

        // Delete the quiz
        await QuizModel.deleteOne({ _id: quiz._id });

        return NextResponse.json({ message: "Quiz deleted successfully", status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Error in server", status: 500 });
    }
}
