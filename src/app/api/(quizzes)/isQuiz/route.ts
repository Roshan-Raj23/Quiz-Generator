import connectToDatabase from "@/lib/db";
import QuizModel from "@/Model/Quiz";
import { NextResponse } from "next/server";
// import { getUserFromSession } from "@/lib/sessions";
// import { cookies } from "next/headers";


export async function POST(request: Request) {

    try {
        connectToDatabase();
        const { id } = await request.json()

        const quiz = await QuizModel.findOne({ id })
        let check = false;

        if (quiz) {
            check = !quiz.isDraft;
            // if (quiz.isDraft) {
            //     const currentUser = await getUserFromSession(await cookies());

            //     if (currentUser) {
            //         // console.log(currentUser._id);                
            //         // console.log(quiz.creator?.toHexString());      
            //         check = (currentUser._id == quiz.creator?.toHexString());
            //         if (check)
            //             return NextResponse.json({message : "Answer in find" , quiz , find: true , status: 200});
            //     } else 
            //         check = false;
            // } else 
            //     check = true;
        }

        return NextResponse.json({message : "Answer in find" , quiz , find: check , status: 200});
    } catch (err) {
        console.log(err);
        return NextResponse.json({error : "Server Error" , find: false , status: 500});
        // return NextResponse.json({error : err , find: false , status: 500});
    }

}