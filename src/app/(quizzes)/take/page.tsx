"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, ChevronLeft, ChevronRight, Flag } from "lucide-react"

interface Question {
  id: string
  question: string
  type: "multiple-choice" | "true-false"
  options: string[]
  correctAnswer: number
}

const sampleQuiz = {
  title: "General Knowledge Quiz",
  description: "Test your general knowledge with these questions",
  timeLimit: 10,
  questions: [
    {
      id: "1",
      question: "What is the capital of France?",
      type: "multiple-choice" as const,
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2,
    },
    {
      id: "2",
      question: "The Earth is flat.",
      type: "true-false" as const,
      options: ["True", "False"],
      correctAnswer: 1,
    },
    {
      id: "3",
      question: "Which planet is known as the Red Planet?",
      type: "multiple-choice" as const,
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1,
    },
  ],
}

export default function TakeQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: number }>({})
  const [timeLeft, setTimeLeft] = useState(sampleQuiz.timeLimit * 60) // Convert to seconds
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleSubmit()
    }
  }, [timeLeft, isCompleted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setAnswers({
      ...answers,
      [sampleQuiz.questions[currentQuestion].id]: answerIndex,
    })
  }

  const handleNext = () => {
    if (currentQuestion < sampleQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    let correctAnswers = 0
    sampleQuiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })
    setScore(correctAnswers)
    setIsCompleted(true)
  }

  const handleRetake = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setTimeLeft(sampleQuiz.timeLimit * 60)
    setIsCompleted(false)
    setScore(0)
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="text-6xl font-bold text-primary">
                {score}/{sampleQuiz.questions.length}
              </div>
              <div className="text-xl text-gray-600 dark:text-gray-300">
                You scored {Math.round((score / sampleQuiz.questions.length) * 100)}%
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Review Your Answers</h3>
                {sampleQuiz.questions.map((question, index) => (
                  <div key={question.id} className="text-left p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="font-medium mb-2">
                      {index + 1}. {question.question}
                    </p>
                    <div className="space-y-1">
                      <p
                        className={`text-sm ${answers[question.id] === question.correctAnswer ? "text-green-600" : "text-red-600"}`}
                      >
                        Your answer: {question.options[answers[question.id]] || "Not answered"}
                      </p>
                      <p className="text-sm text-green-600">
                        Correct answer: {question.options[question.correctAnswer]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleRetake}>Retake Quiz</Button>
                <Button variant="outline">Share Results</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const question = sampleQuiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / sampleQuiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{sampleQuiz.title}</h1>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5" />
              <span className={timeLeft < 60 ? "text-red-500" : "text-gray-600 dark:text-gray-300"}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>
                Question {currentQuestion + 1} of {sampleQuiz.questions.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[question.id] === index
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        answers[question.id] === index
                          ? "border-primary bg-primary"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {answers[question.id] === index && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentQuestion === sampleQuiz.questions.length - 1 ? (
              <Button onClick={handleSubmit} className="flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={answers[question.id] === undefined}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
