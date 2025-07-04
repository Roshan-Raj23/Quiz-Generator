'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Eye , EyeOff } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { redirect } from "next/navigation"
import { toast } from 'sonner';

export default function Page() {

    const [username , setUsername] = useState("");
    const [password , setPassword] = useState("");
    const [viewPassword , setViewPassword] = useState(false);

    const handleSignin = async (event: React.FormEvent) => {
        event.preventDefault();
        const response = await axios.post('/api/login' , {username , password})

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
                    <CardTitle className="flex justify-center items-center">Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignin} className="space-y-4">
                        <div>
                            <Label htmlFor="userEmail" className="text-gray-700 dark:text-gray-300">User Email</Label>
                            <Input
                            id="userEmail"
                            placeholder="Email"
                            type="email"
                            value={username}
                            required
                            onChange={(e) => setUsername(e.target.value)}
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

                        <div className="flex justify-center mt-7">
                            <Button type="submit">
                                Sign In
                            </Button>
                        </div>
                    </form>
                </CardContent>

                <CardContent className="flex justify-center items-center">

                    <pre className="flex text-sm text-gray-700 dark:text-gray-300 space-x-2">
                        <pre>Doesn&apos;t have an account?</pre>
                        <Link href="/signup" className="text-blue-400">
                            SignUp
                        </Link>
                    </pre>

                </CardContent>
            </Card>
                
        </div>
    )
}
