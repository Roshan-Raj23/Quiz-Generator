import UserModel from "@/Model/User";
import connectToDatabase from "@/lib/db";
import { createUserSession } from "@/lib/sessions";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    try {
        connectToDatabase();
        const {username , userEmail , password} = await request.json();

        const userAlreadyExists = await UserModel.findOne({email: userEmail});
        if (userAlreadyExists) {
            return NextResponse.json({message: "User already exists" , status: 400});
        }

        const hashedPassword = await bcrypt.hash(password , 10);
        const newUser = new UserModel({
            username,
            email: userEmail,
            password: hashedPassword
        });
        await newUser.save();

        await createUserSession(newUser , await cookies());

        return NextResponse.json({message: "User created sucessfully" , status: 200});
    } catch {
        return NextResponse.json({error: "Error in server" , status: 500})
        // return NextResponse.json({error: err , status: 500})
    }
    
}
