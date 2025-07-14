import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Facebook, Twitter, Instagram, Mail } from "lucide-react"

export default function Footer() {

    return (
        <>
            <hr />
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center space-x-2 mb-4">
                        <Brain className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold">QuizMaster</span>
                    </div>
                    <p className="text-gray-400 mb-4">
                        The ultimate platform for creating and taking interactive quizzes. Engage, educate, and entertain with
                        our powerful quiz tools.
                    </p>
                    <div className="flex space-x-4">
                        <Button variant="ghost" size="icon">
                        <Facebook className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                        <Twitter className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                        <Instagram className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                        <Mail className="h-5 w-5" />
                        </Button>
                    </div>
                    </div>

                    <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li>
                        <Link href="/create" className="text-gray-400 hover:text-white transition-colors">
                            Create Quiz
                        </Link>
                        </li>
                        <li>
                        <Link href="/take" className="text-gray-400 hover:text-white transition-colors">
                            Take Quiz
                        </Link>
                        </li>
                        <li>
                        <Link href="/my-quizzes" className="text-gray-400 hover:text-white transition-colors">
                            My Quizzes
                        </Link>
                        </li>
                        <li>
                        <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                            About
                        </Link>
                        </li>
                    </ul>
                    </div>

                    <div>
                    <h3 className="text-lg font-semibold mb-4">Support</h3>
                    <ul className="space-y-2">
                        <li>
                        <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                            Contact Us
                        </Link>
                        </li>
                        <li>
                        <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                            Help Center
                        </Link>
                        </li>
                        <li>
                        <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        </li>
                        <li>
                        <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                        </li>
                    </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                    <p className="text-gray-400">© 2025 QuizMaster. All rights reserved.</p>
                </div>
                </div>
            </footer>
        </>
    )
}
