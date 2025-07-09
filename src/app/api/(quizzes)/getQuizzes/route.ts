import QuizModel from "@/Model/Quiz";
import connectToDatabase from "@/lib/db";
import { getUserFromSession } from "@/lib/sessions";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {

    try {
        connectToDatabase();

        const currentUser = await getUserFromSession(await cookies());
        const quiz_ids = currentUser.quizzes;
        let currentQuiz;

        const quiz = [];

        for(let i = 0;i< quiz_ids.length;i++){
            currentQuiz = await QuizModel.findOne({ _id : quiz_ids[i]})
            if (currentQuiz)
                quiz.push(currentQuiz);
        }

        return NextResponse.json({quiz , status: 200});
    } catch {
        return NextResponse.json({error: "Error in server" , status: 500})
        // return NextResponse.json({error: err , status: 500})
    }
    
}
