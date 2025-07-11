"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Search, Play, Clock, Users, BarChart3, Zap, TrendingUp, Star } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

// Sample available quizzes
const featuredQuizzes = [
  {
    id: "js-fundamentals",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics, ES6 features, and modern development practices",
    difficulty: "Medium",
    questions: 15,
    timeLimit: 20,
    participants: 1247,
    rating: 4.8,
    category: "Programming",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "react-advanced",
    title: "Advanced React Concepts",
    description: "Deep dive into React hooks, context, performance optimization, and advanced patterns",
    difficulty: "Hard",
    questions: 25,
    timeLimit: 35,
    participants: 892,
    rating: 4.9,
    category: "Programming",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "world-geography",
    title: "World Geography Challenge",
    description: "Test your knowledge of world capitals, countries, landmarks, and geographical features",
    difficulty: "Medium",
    questions: 30,
    timeLimit: 25,
    participants: 2156,
    rating: 4.6,
    category: "Geography",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "science-trivia",
    title: "General Science Trivia",
    description: "Explore physics, chemistry, biology, and earth science concepts in this comprehensive quiz",
    difficulty: "Easy",
    questions: 20,
    timeLimit: 15,
    participants: 3421,
    rating: 4.7,
    category: "Science",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "history-world",
    title: "World History Timeline",
    description: "Journey through major historical events, civilizations, and influential figures",
    difficulty: "Hard",
    questions: 40,
    timeLimit: 45,
    participants: 756,
    rating: 4.5,
    category: "History",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "math-algebra",
    title: "Algebra Mastery",
    description: "Solve equations, work with polynomials, and master algebraic concepts",
    difficulty: "Medium",
    questions: 18,
    timeLimit: 30,
    participants: 1089,
    rating: 4.4,
    category: "Mathematics",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
]

const categories = ["All", "Programming", "Science", "Geography", "History", "Mathematics", "Literature", "Arts"]

export default function TakeQuizPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "notFound") {
      toast.error("Quiz not found!");
    }
  }, [error]);


  const router = useRouter()
  const [quizId, setQuizId] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const handleStartQuiz = (id: string) => {
    // router.push(`/take-quiz/${id}`)

    // Doing nothing as this is a call from dummy card
    console.log("Go to this id : " , id);
  }

  const handleQuizIdSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // if (quizId.trim()) {
    //   router.push(`/take-quiz/${quizId.trim()}`)
    // }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const filteredQuizzes = featuredQuizzes.filter((quiz) => {
    const matchesCategory = selectedCategory === "All" || quiz.category === selectedCategory
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const findQuiz = async () => {
    if (quizId.trim().length === 0) {
      toast.error("Enter a quiz id");
      return;
    }

    const response = await axios.post('/api/isQuiz' , {id : quizId})
    const responseStatus = response.data.status;
    if (responseStatus == 200 && response.data.find) {
      router.push(`/take-quiz/${quizId}`)
    } else {
      toast.error("No quiz with this Quiz ID");
    }

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Take a
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"> Quiz</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Challenge yourself with our curated collection of quizzes or enter a specific quiz ID to get started
          </p>
        </div>

        {/* Quiz ID Input Section */}
        <Card className="mb-12 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleQuizIdSubmit} className="space-y-4">
              <div>
                <Label htmlFor="quiz-id" className="text-base font-medium">
                  Enter Quiz ID
                </Label>
                <div className="flex gap-3 mt-2">
                  <Input
                    id="quiz-id"
                    placeholder="e.g., js-fundamentals, react-advanced..."
                    value={quizId}
                    onChange={(e) => setQuizId(e.target.value)}
                    className="flex-1 text-lg p-3"
                  />
                  <Button type="submit" size="lg" className="px-8" onClick={findQuiz}>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Have a quiz code? Enter it above to jump straight to the quiz
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory !== category ? "bg-transparent" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Quizzes Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedCategory === "All" ? "Featured Quizzes" : `${selectedCategory} Quizzes`}
            </h2>
            <Badge variant="secondary" className="text-sm">
              {filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 ? "es" : ""} available
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div className="relative overflow-hidden">
                  <img 
                    src={quiz.thumbnail || "/placeholder.svg"}
                    alt={quiz.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                      {quiz.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{quiz.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4" />
                        {quiz.questions} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {quiz.timeLimit} min
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {quiz.participants.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {quiz.rating}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {quiz.category}
                    </Badge>
                  </div>

                  <Button
                    onClick={() => handleStartQuiz(quiz.id)}
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredQuizzes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No quizzes found</h3>
              <p className="text-gray-600 dark:text-gray-300">Try adjusting your search terms or category filter</p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Quizzes Available</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Quiz Attempts</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">4.8★</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Create Your Own Quiz?</h2>
            <p className="text-purple-100 mb-6">
              Join thousands of educators and quiz creators who use our platform to engage their audience
            </p>
            <Button asChild variant="secondary" size="lg">
              <Link href="/create">
                <TrendingUp className="h-4 w-4 mr-2" />
                Create Quiz
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
