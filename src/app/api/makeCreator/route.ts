import connectToDatabase from "@/lib/db";
import { updateUserSessionData } from "@/lib/sessions";
import UserModel from "@/Model/User";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    try {
        connectToDatabase();
        
        const { email } = await request.json();


        await UserModel.updateOne(
            { email },
            { $set: {isCreator : true } }
        );
        const user = await UserModel.findOne({email})

        await updateUserSessionData(user, await cookies())

        return NextResponse.json({message: "User updated sucessfully" , status: 200});
    } catch {
        return NextResponse.json({error: "Error in server" , status: 500})
    }


}
