import QuizModel from "@/Model/Quiz";
import { User } from "@/Model/User";
import connectToDatabase from "@/lib/db";
import { getUserFromSession } from "@/lib/sessions";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    try {
        connectToDatabase();
        const { quiz , isEdit , id } = await request.json();

        if (!isEdit) {
            // Assigning every quiz to a six digit id for searching in /take tab
            let randomSixDigit = Math.floor(100000 + Math.random() * 900000);
            let checkExists = await QuizModel.findOne({ id : randomSixDigit });
            while(checkExists) {
                randomSixDigit = Math.floor(100000 + Math.random() * 900000);
                checkExists = await QuizModel.findOne({ id : randomSixDigit});
            }

            const currentUser = await getUserFromSession(await cookies()) as User;
            const newQuiz = new QuizModel({
                id: randomSixDigit,
                quizTitle: quiz.quizTitle,
                quizDescription: quiz.quizDescription,
                difficulty: quiz.difficulty,
                timeLimit: quiz.timeLimit,
                timeLimitMinutes: quiz.timeLimitMinutes,
                timeLimitTotal: quiz.timeLimitTotal,
                questions: quiz.questions,
                isDraft: quiz.isDraft,
                makeStrict: quiz.makeStrict,
                creator: currentUser._id,
                creatorUsername: currentUser.username
            });

            await newQuiz.save();
            return NextResponse.json({message: "Quiz created sucessfully" , status: 200});
        } else {
            const updatedQuiz = await QuizModel.findOneAndUpdate(
                { id }, // Find by quiz id
                {
                    quizTitle: quiz.quizTitle,
                    quizDescription: quiz.quizDescription,
                    difficulty: quiz.difficulty,
                    timeLimit: quiz.timeLimit,
                    timeLimitMinutes: quiz.timeLimitMinutes,
                    timeLimitTotal: quiz.timeLimitTotal,
                    questions: quiz.questions,
                    isDraft: quiz.isDraft,
                    makeStrict: quiz.makeStrict,
                },
                { new: true } // Return the updated document
            );
            if (!updatedQuiz) {
                return NextResponse.json({ error: "Quiz not found", status: 404 });
            }
            return NextResponse.json({ message: "Quiz updated successfully", status: 200 });
        }
        

        // await UserModel.updateOne(
        //     { email : currentUser.email },
        //     { $push: { quizzes: newQuiz._id } }
        // );
        // const user = await UserModel.findOne({email : currentUser.email})

        // await updateUserSessionData(user, await cookies())

    } catch (err) {
        console.log(err);
        return NextResponse.json({error: "Error in server" , status: 500})
        // return NextResponse.json({error: err , status: 500})
    }
    
}
