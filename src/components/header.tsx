"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Brain, Menu, X , CircleUserRound} from "lucide-react"
import { useEffect, useState } from "react"
import { User } from "@/Model/User"
import axios from "axios"


export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentUser , setCurrentUser] = useState<User>()
  const navItems = [
    { href: "/", label: "Home", check: true},
    { href: "/create", label: "Create Quiz", check: currentUser ? currentUser.isCreator : false},
    { href: "/take", label: "Take Quiz", check: true},
    { href: "/my-quizzes", label: "My Quizzes", check: currentUser ? currentUser.isCreator : false},
    { href: "/about", label: "About", check: true},
  ]
  

  useEffect(() => {
    getUser();
    setIsMenuOpen(false);
  }, [pathname]);

  const getUser = async () => {
    const response = await axios.get('/api/getCurrentUser')

    setCurrentUser(response.data.user);
  }

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">QuizMaster</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.check && <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <ModeToggle />

            {currentUser ? 
              <Link href="/profile">
                <CircleUserRound size={28} />
              </Link>
              :
              <Link href="/signin">
                <Button>Sign In</Button>
              </Link>
            }

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-gray-600 dark:text-gray-300"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-2">
                {currentUser ? 
                  <Link href="/profile">
                    <Button className="w-full">Profile</Button>
                  </Link>
                  :
                  <Link href="/signin">
                    <Button className="w-full">Sign In</Button>
                  </Link>
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
