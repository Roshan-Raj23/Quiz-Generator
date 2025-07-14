'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Zap, Users, Trophy, Clock, Target} from "lucide-react"
import { useEffect, useState } from "react"
import { User } from "@/Model/User"
import { usePathname } from "next/navigation"
import axios from "axios"
import { PageLoader } from "@/components/loading"

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: "Smart Quiz Creation",
      description: "Create engaging quizzes with multiple question types and customizable settings.",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get immediate feedback and detailed analytics on quiz performance.",
    },
    {
      icon: Users,
      title: "Share & Collaborate",
      description: "Share your quizzes with friends or embed them on your website.",
    },
    {
      icon: Trophy,
      title: "Leaderboards",
      description: "Track high scores and compete with other quiz takers.",
    },
    {
      icon: Clock,
      title: "Timed Challenges",
      description: "Add time limits to create exciting, fast-paced quiz experiences.",
    },
    {
      icon: Target,
      title: "Difficulty Levels",
      description: "Set different difficulty levels to challenge users appropriately.",
    },
  ]

  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser , setCurrentUser] = useState<User>()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    getUser();
  }, [pathname]);


  const getUser = async () => {
    const response = await axios.get('/api/getCurrentUser')

    setCurrentUser(response.data.user);
  }
    
  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Create Amazing
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                {" "}
                Quizzes
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Build interactive quizzes, engage your audience, and track results with our powerful quiz generator
              platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser && currentUser.isCreator && 
                <Button asChild size="lg" className="text-lg px-8 py-3">
                  <Link href="/create">Create a Quiz</Link>
                </Button>
              }

              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                <Link href="/take">Take a Quiz</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 dark:bg-purple-800 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-30 animate-bounce"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to create, share, and analyze engaging quizzes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="quiz-card hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="feature-icon mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of educators, trainers, and quiz enthusiasts who trust QuizMaster
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
            <Link href="/create">Start Creating Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
