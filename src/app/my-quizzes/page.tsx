"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreVertical, Edit, Trash2, Share, Eye, Users, Clock, BarChart3 } from "lucide-react"

interface Quiz {
  id: string
  title: string
  description: string
  questions: number
  difficulty: "easy" | "medium" | "hard"
  timeLimit?: number
  responses: number
  averageScore: number
  createdAt: string
  isPublished: boolean
}

const sampleQuizzes: Quiz[] = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics",
    questions: 15,
    difficulty: "medium",
    timeLimit: 20,
    responses: 45,
    averageScore: 78,
    createdAt: "2024-01-15",
    isPublished: true,
  },
  {
    id: "2",
    title: "World Geography",
    description: "How well do you know world capitals and countries?",
    questions: 20,
    difficulty: "hard",
    responses: 23,
    averageScore: 65,
    createdAt: "2024-01-10",
    isPublished: true,
  },
  {
    id: "3",
    title: "Movie Trivia",
    description: "Test your knowledge of classic and modern films",
    questions: 12,
    difficulty: "easy",
    timeLimit: 15,
    responses: 0,
    averageScore: 0,
    createdAt: "2024-01-20",
    isPublished: false,
  },
]

export default function MyQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(sampleQuizzes)

  const handleDelete = (quizId: string) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId))
    }
  }

  const handleShare = (quiz: Quiz) => {
    const shareUrl = `${window.location.origin}/quiz/${quiz.id}`
    navigator.clipboard.writeText(shareUrl)
    alert("Quiz link copied to clipboard!")
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Quizzes</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your created quizzes and view analytics</p>
          </div>
          <Button asChild className="mt-4 sm:mt-0">
            <Link href="/create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Quiz
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Quizzes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{quizzes.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Responses</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {quizzes.reduce((sum, quiz) => sum + quiz.responses, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {quizzes.filter((quiz) => quiz.isPublished).length}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(quizzes.reduce((sum, quiz) => sum + quiz.averageScore, 0) / quizzes.length) || 0}%
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz List */}
        <div className="space-y-6">
          {quizzes.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <BarChart3 className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No quizzes yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Create your first quiz to get started</p>
                <Button asChild>
                  <Link href="/create">Create Quiz</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{quiz.title}</CardTitle>
                        <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                        {!quiz.isPublished && <Badge variant="outline">Draft</Badge>}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">{quiz.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="h-4 w-4" />
                          {quiz.questions} questions
                        </span>
                        {quiz.timeLimit && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {quiz.timeLimit} min
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {quiz.responses} responses
                        </span>
                        {quiz.responses > 0 && <span>Avg. Score: {quiz.averageScore}%</span>}
                        <span>Created: {new Date(quiz.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/quiz/${quiz.id}`} className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View Quiz
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/edit/${quiz.id}`} className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare(quiz)}>
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(quiz.id)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
