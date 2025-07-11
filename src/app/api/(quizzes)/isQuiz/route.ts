import connectToDatabase from "@/lib/db";
import { getUserFromSession } from "@/lib/sessions";
import QuizModel from "@/Model/Quiz";
import { User } from "@/Model/User";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(request: Request) {

    try {
        connectToDatabase();
        const { id } = await request.json()

        const quiz = await QuizModel.findOne({ id })
        const currentUser = await getUserFromSession(await cookies()) as User;
        let check = false;

        if (quiz) {
            check = !quiz.isDraft;
            if (quiz.isDraft) {
                if (currentUser) 
                    check = (currentUser._id == quiz.creator?.toHexString());
                
            } else 
                check = true;
        }

        return NextResponse.json({message : "Answer in find" , quiz , find: check , status: 200});
    } catch (err) {
        console.log(err);
        return NextResponse.json({error : "Server Error" , find: false , status: 500});
        // return NextResponse.json({error : err , find: false , status: 500});
    }

}