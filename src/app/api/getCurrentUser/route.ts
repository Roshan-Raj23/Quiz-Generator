import { cookies } from "next/headers";
import { getUserFromSession } from "@/lib/sessions";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation"

export async function GET() {
    const user = await getUserFromSession(await cookies());

    if (user == null) 
        return redirect('/signin');

    // if (!user)
    //     return NextResponse.json({message : "No User found" , user: null , status: 500});

    return NextResponse.json({user: user, status:200});
}