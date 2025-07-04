import { removeUserFromSession } from "@/lib/sessions"
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export async function GET() {
    await removeUserFromSession(await cookies());
    return NextResponse.json({message: "Logged out User successfully" , status: 200});
}