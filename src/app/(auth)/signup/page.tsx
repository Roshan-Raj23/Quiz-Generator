'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Eye , EyeOff } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { toast } from 'sonner';
import { redirect } from "next/navigation"
import validation from "@/lib/authFormValidation"


export default function Page() {

    const [username , setUsername] = useState("");
    const [userEmail , setUserEmail] = useState("");
    const [password , setPassword] = useState("");
    const [confirmPassword , setConfirmPassword] = useState("");
    const [viewPassword , setViewPassword] = useState(false);
    const [viewConfirmPassword , setViewConfirmPassword] = useState(false);

    const handleSignup = async (event: React.FormEvent) => {
        event.preventDefault();

        if (password !== confirmPassword) { 
            toast.warning("Passwords doesn't match");
            return;
        }

        const valid = validation(userEmail , password);
        if (!valid)
            return;


        const response = await axios.post('/api/register' , {username , userEmail , password})

        const responseStatus = response.data.status;
        if (responseStatus == 200) {
            toast.success("Logged In");
            redirect("/")
        } else if (responseStatus == 400) {
            toast.warning(response.data.message);
        } else {
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="py-10 flex justify-center items-center">
            <Card className="w-[400px] shadow-2xl">
                <CardHeader>
                    <CardTitle className="flex justify-center items-center">Create Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-2">
                        <div>
                            <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">Name</Label>
                            <Input
                            id="username"
                            placeholder="Name"
                            type="text"
                            value={username}
                            required
                            onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="userEmail" className="text-gray-700 dark:text-gray-300">User Email</Label>
                            <Input
                            id="userEmail"
                            placeholder="Email"
                            type="email"
                            value={userEmail}
                            required
                            onChange={(e) => setUserEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                            <Input
                            id="password"
                            placeholder="Password"
                            value={password}
                            type={viewPassword ? "text" : "password"}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            className="pr-10"
                            />

                            <Button variant="link" type="button" onClick={() => setViewPassword(viewPassword => !viewPassword)}
                            className="absolute right-0 bottom-0"
                            >
                                {viewPassword ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>
                        <div className="relative">
                            <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Confirm Password</Label>
                            <Input
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            type={viewConfirmPassword ? "text" : "password"}
                            required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pr-10"
                            />

                            <Button variant="link" type="button" onClick={() => setViewConfirmPassword(viewConfirmPassword => !viewConfirmPassword)}
                            className="absolute right-0 bottom-0"
                            >
                                {viewConfirmPassword ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>

                        <div className="flex justify-center mt-7">
                            <Button type="submit">
                                Sign Up
                            </Button>
                        </div>
                    </form>
                </CardContent>

                <CardContent className="flex justify-center items-center">

                    <pre className="flex text-sm text-gray-700 dark:text-gray-300 space-x-2">
                        <pre>Already have an account?</pre>
                        <Link href="/signin" className="text-blue-400">
                            SignIn
                        </Link>
                    </pre>

                </CardContent>
            </Card>
                
        </div>
    )
}
