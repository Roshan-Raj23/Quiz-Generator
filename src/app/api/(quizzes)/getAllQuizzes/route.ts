import QuizModel, { Quiz } from "@/Model/Quiz";
import connectToDatabase from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {

    try {
        connectToDatabase();

        const quizzes = await QuizModel.find({ 
            isDraft: false , 
            category: { $not: /^others\s*$/i, $exists: true, $ne: null }
        }) as Quiz[];
        // console.log(quizzes);
        return NextResponse.json({ quiz: quizzes, status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: "Error in server" , status: 500})
        // return NextResponse.json({error: err , status: 500})
    }
    
}
