import QuizModel, { Quiz } from "@/Model/Quiz";
import { User } from "@/Model/User";
import connectToDatabase from "@/lib/db";
import { getUserFromSession } from "@/lib/sessions";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {

    try {
        connectToDatabase();

        const currentUser = await getUserFromSession(await cookies()) as User;
        const quizzes = await QuizModel.find({ creator: currentUser._id }) as Quiz[];
        return NextResponse.json({ quiz: quizzes, status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: "Error in server" , status: 500})
        // return NextResponse.json({error: err , status: 500})
    }
    
}
