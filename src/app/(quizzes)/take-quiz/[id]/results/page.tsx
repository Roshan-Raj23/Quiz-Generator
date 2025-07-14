"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageLoader } from "@/components/loading"
import {
  Trophy,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  Users,
  Star,
  Download,
  Share2,
  RotateCcw,
  ArrowLeft,
  Award,
  Zap,
  Brain,
  Timer,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
} from "lucide-react"

interface QuestionResult {
  id: string
  question: string
  type: string
  userAnswer: number | string
  correctAnswer: number | string
  isCorrect: boolean
  timeSpent: number
  points: number
  earnedPoints: number
  explanation?: string
  difficulty: "easy" | "medium" | "hard"
}

interface QuizResults {
  quizId: string
  quizTitle: string
  totalQuestions: number
  answeredQuestions: number
  correctAnswers: number
  totalPoints: number
  earnedPoints: number
  percentage: number
  timeSpent: number
  timeLimit: number
  completedAt: string
  questions: QuestionResult[]
  rank: number
  totalParticipants: number
  averageScore: number
  recommendations: string[]
}

// Sample detailed results data
const sampleResults: QuizResults = {
  quizId: "js-fundamentals",
  quizTitle: "Advanced JavaScript & Web Development Quiz",
  totalQuestions: 6,
  answeredQuestions: 6,
  correctAnswers: 4,
  totalPoints: 75,
  earnedPoints: 55,
  percentage: 73,
  timeSpent: 1245, // seconds
  timeLimit: 1800, // 30 minutes
  completedAt: "2024-01-15T14:30:00Z",
  rank: 156,
  totalParticipants: 1247,
  averageScore: 68,
  recommendations: [
    "Review JavaScript data types and typeof operator",
    "Practice more with React component patterns",
    "Study array methods like map(), filter(), and reduce()",
  ],
  questions: [
    {
      id: "q1",
      question: "What is the output of the following JavaScript code?\n\nconsole.log(typeof null);",
      type: "multiple-choice",
      userAnswer: 2,
      correctAnswer: 2,
      isCorrect: true,
      timeSpent: 45,
      points: 10,
      earnedPoints: 10,
      explanation: "In JavaScript, typeof null returns 'object'. This is a well-known quirk in the language.",
      difficulty: "medium",
    },
    {
      id: "q2",
      question: "Which of the following are valid JavaScript data types?",
      type: "multiple-select",
      
      userAnswer: 2,
      correctAnswer: 2,
      // userAnswer: [0, 1, 2, 3, 4],
      // correctAnswer: [0, 1, 2, 3, 4, 5],
      isCorrect: false,
      timeSpent: 120,
      points: 15,
      earnedPoints: 0,
      explanation: "You missed 'function' which is also a valid JavaScript data type.",
      difficulty: "hard",
    },
    {
      id: "q3",
      question: "React components must always return a single JSX element.",
      type: "true-false",
      userAnswer: 1,
      correctAnswer: 1,
      isCorrect: true,
      timeSpent: 30,
      points: 5,
      earnedPoints: 5,
      explanation:
        "False. React components can return fragments, arrays, or multiple elements wrapped in React.Fragment.",
      difficulty: "easy",
    },
    {
      id: "q4",
      question: "Complete the code: const [count, ____] = useState(0);",
      type: "fill-blank",
      userAnswer: "setCount",
      correctAnswer: "setCount",
      isCorrect: true,
      timeSpent: 25,
      points: 10,
      earnedPoints: 10,
      explanation:
        "The useState hook returns an array with the state value and a setter function, conventionally named with 'set' prefix.",
      difficulty: "easy",
    },
    {
      id: "q5",
      question: "Match the JavaScript methods with their descriptions:",
      type: "matching",
      userAnswer: 1,
      correctAnswer: 2,
      // userAnswer: {
      //   "map()": "Creates new array with transformed elements",
      //   "filter()": "Creates new array with filtered elements",
      //   "reduce()": "Transforms array to single value",
      //   "forEach()": "Executes function for each element",
      // },
      // correctAnswer: {
      //   "map()": "Creates new array with transformed elements",
      //   "filter()": "Creates new array with filtered elements",
      //   "reduce()": "Transforms array to single value",
      //   "forEach()": "Executes function for each element",
      // },
      isCorrect: true,
      timeSpent: 180,
      points: 20,
      earnedPoints: 20,
      explanation: "Perfect! You correctly matched all JavaScript array methods with their descriptions.",
      difficulty: "medium",
    },
    {
      id: "q6",
      question: "What does this code snippet demonstrate?",
      type: "image-based",
      userAnswer: 1,
      correctAnswer: 0,
      isCorrect: false,
      timeSpent: 90,
      points: 15,
      earnedPoints: 0,
      explanation:
        "The code demonstrates Async/Await syntax, not Promise chaining. Async/await provides a cleaner way to handle asynchronous operations.",
      difficulty: "hard",
    },
  ],
}

export default function QuizResultsPage({ params }: { params: Promise<{ id: number }> }) {

  const { id } = React.use(params);
  const router = useRouter()
  const [results, setResults] = useState<QuizResults | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Simulate loading results
    const timer = setTimeout(() => {
      setResults(sampleResults)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [id])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: "Excellent", color: "text-green-600", bgColor: "bg-green-100" }
    if (percentage >= 80) return { level: "Very Good", color: "text-cyan-600", bgColor: "bg-cyan-100" }
    if (percentage >= 70) return { level: "Good", color: "text-yellow-600", bgColor: "bg-yellow-100" }
    if (percentage >= 60) return { level: "Fair", color: "text-orange-600", bgColor: "bg-orange-100" }
    return { level: "Needs Improvement", color: "text-red-600", bgColor: "bg-red-100" }
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

  if (isLoading) {
    return <PageLoader />
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Results Not Found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We couldn&apos;t find the results for this quiz. Please try again.
              </p>
              <Button asChild>
                <Link href="/take">Take Another Quiz</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const performance = getPerformanceLevel(results.percentage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="h-6 border-l border-gray-300 dark:border-gray-600"></div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quiz Results</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">{results.quizTitle}</p>
        </div>

        {/* Score Overview */}
        <Card className="mb-8 animate-scale-in">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 text-white text-3xl font-bold mb-4 animate-bounce-in">
                {results.percentage}%
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{performance.level}</h2>
              <Badge className={`${performance.bgColor} ${performance.color} text-sm px-3 py-1`}>
                {results.correctAnswers} out of {results.totalQuestions} correct
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center animate-slide-in-left" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-100 text-cyan-600 mx-auto mb-2">
                  <Target className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{results.earnedPoints}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Points Earned</div>
              </div>

              <div className="text-center animate-slide-in-left" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mx-auto mb-2">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(results.timeSpent)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Time Spent</div>
              </div>

              <div className="text-center animate-slide-in-right" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 mx-auto mb-2">
                  <Trophy className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">#{results.rank}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Your Rank</div>
              </div>

              <div className="text-center animate-slide-in-right" style={{ animationDelay: "0.4s" }}>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mx-auto mb-2">
                  <Users className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{results.totalParticipants}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Participants</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="recommendations">Tips</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Performance Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Performance Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Correct Answers</span>
                      <span>
                        {results.correctAnswers}/{results.totalQuestions}
                      </span>
                    </div>
                    <Progress value={(results.correctAnswers / results.totalQuestions) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Points Earned</span>
                      <span>
                        {results.earnedPoints}/{results.totalPoints}
                      </span>
                    </div>
                    <Progress value={(results.earnedPoints / results.totalPoints) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Time Efficiency</span>
                      <span>{Math.round((1 - results.timeSpent / results.timeLimit) * 100)}%</span>
                    </div>
                    <Progress value={(1 - results.timeSpent / results.timeLimit) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Performance Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium">Your Score</span>
                    <span className="text-lg font-bold text-primary">{results.percentage}%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium">Average Score</span>
                    <span className="text-lg font-bold text-gray-600">{results.averageScore}%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium">Difference</span>
                    <span
                      className={`text-lg font-bold ${results.percentage > results.averageScore ? "text-green-600" : "text-red-600"}`}
                    >
                      {results.percentage > results.averageScore ? "+" : ""}
                      {results.percentage - results.averageScore}%
                    </span>
                  </div>

                  <div className="text-center pt-4">
                    <Badge variant="outline" className="text-sm">
                      Better than {Math.round((1 - results.rank / results.totalParticipants) * 100)}% of participants
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Retake Quiz
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Share2 className="h-4 w-4" />
                    Share Results
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Download Certificate
                  </Button>
                  <Button variant="outline" asChild className="flex items-center gap-2 bg-transparent">
                    <Link href="/take">
                      <BookOpen className="h-4 w-4" />
                      Take Another Quiz
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              {results.questions.map((question, index) => (
                <Card key={question.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                          <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {question.points} pts
                          </Badge>
                        </div>
                        <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{question.question}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {question.isCorrect ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-500" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div
                          className={`p-3 rounded-lg border-2 ${question.isCorrect ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-red-500 bg-red-50 dark:bg-red-900/20"}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {question.isCorrect ? (
                              <ThumbsUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <ThumbsDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-medium text-sm">Your Answer</span>
                          </div>
                          <p className="text-sm">{JSON.stringify(question.userAnswer)}</p>
                        </div>

                        <div className="p-3 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-900/20">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-sm">Correct Answer</span>
                          </div>
                          <p className="text-sm">{JSON.stringify(question.correctAnswer)}</p>
                        </div>
                      </div>

                      {question.explanation && (
                        <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="h-4 w-4 text-cyan-600" />
                            <span className="font-medium text-sm text-cyan-800 dark:text-cyan-300">Explanation</span>
                          </div>
                          <p className="text-sm text-cyan-700 dark:text-cyan-300">{question.explanation}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Timer className="h-4 w-4" />
                            {formatTime(question.timeSpent)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {question.earnedPoints}/{question.points} points
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 animate-fade-in">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Time Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Time</span>
                      <span className="font-semibold">{formatTime(results.timeSpent)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average per Question</span>
                      <span className="font-semibold">
                        {formatTime(Math.round(results.timeSpent / results.totalQuestions))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Time Remaining</span>
                      <span className="font-semibold">{formatTime(results.timeLimit - results.timeSpent)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Difficulty Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["easy", "medium", "hard"].map((difficulty) => {
                      const questionsOfDifficulty = results.questions.filter((q) => q.difficulty === difficulty)
                      const correctOfDifficulty = questionsOfDifficulty.filter((q) => q.isCorrect).length
                      const percentage =
                        questionsOfDifficulty.length > 0
                          ? (correctOfDifficulty / questionsOfDifficulty.length) * 100
                          : 0

                      return (
                        <div key={difficulty}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{difficulty}</span>
                            <span>
                              {correctOfDifficulty}/{questionsOfDifficulty.length}
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Personalized Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg animate-slide-in-left"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500 text-white text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-cyan-800 dark:text-cyan-300">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button className="h-auto p-4 flex-col items-start">
                    <Award className="h-6 w-6 mb-2" />
                    <span className="font-semibold">Practice More</span>
                    <span className="text-sm opacity-90">Take similar quizzes to improve</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col items-start bg-transparent">
                    <BookOpen className="h-6 w-6 mb-2" />
                    <span className="font-semibold">Study Resources</span>
                    <span className="text-sm opacity-90">Access learning materials</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
