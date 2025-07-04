import UserModel from "@/Model/User";
import connectToDatabase from "@/lib/db";
import { createUserSession } from "@/lib/sessions";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    try {
        connectToDatabase();
        const {username , password} = await request.json();

        const findUser = await UserModel.findOne({email: username});
        if (!findUser) {
            return NextResponse.json({message: "User doesn't exists" , status: 400});
        }

        const isMatch = await bcrypt.compare(password, findUser.password);
        if (isMatch) {
            await createUserSession(findUser , await cookies());
            return NextResponse.json({message: "Password matched" , status: 200});
        }
        
        return NextResponse.json({message: "Username or Password Incorrect" , status: 400});
    } catch (err) {
        // return NextResponse.json({error: "Error in server" , status: 500})
        return NextResponse.json({error: err , status: 500})
    }
    
}
