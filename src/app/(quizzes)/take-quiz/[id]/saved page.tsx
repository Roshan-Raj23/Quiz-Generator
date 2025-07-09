"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  Bookmark,
  BookmarkCheck,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Languages,
  Save,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Grid3X3 } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Quiz } from "@/Model/Quiz"

interface Question {
  id: string
  type: "multiple-choice" | "multiple-select" | "true-false" | "fill-blank" | "matching" | "image-based"
  question: string
  description?: string
  image?: string
  options?: string[]
  correctAnswer?: number | number[] | string | { [key: string]: string }
  points: number
  timeLimit?: number
  required: boolean
  matchingPairs?: { left: string[]; right: string[] }
}

interface QuizData {
  id: string
  title: string
  description: string
  timeLimit: number // in minutes
  allowPause: boolean
  allowSkip: boolean
  allowReview: boolean
  showProgress: boolean
  randomizeQuestions: boolean
  questions: Question[]
}

interface UserAnswer {
  questionId: string
  answer: any
  timeSpent: number
  flagged: boolean
  skipped: boolean
}

const sampleQuiz: QuizData = {
  id: "1",
  title: "Advanced JavaScript & Web Development Quiz",
  description: "Test your knowledge of modern JavaScript, React, and web development concepts",
  timeLimit: 30,
  allowPause: true,
  allowSkip: true,
  allowReview: true,
  showProgress: true,
  randomizeQuestions: false,
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "What is the output of the following JavaScript code?\n\nconsole.log(typeof null);",
      options: ["null", "undefined", "object", "boolean"],
      correctAnswer: 2,
      points: 10,
      required: true,
    },
    {
      id: "q2",
      type: "multiple-select",
      question: "Which of the following are valid JavaScript data types? (Select all that apply)",
      options: ["string", "number", "boolean", "symbol", "bigint", "function"],
      correctAnswer: [0, 1, 2, 3, 4, 5],
      points: 15,
      required: true,
    },
    {
      id: "q3",
      type: "true-false",
      question: "React components must always return a single JSX element.",
      correctAnswer: 1, // false
      points: 5,
      required: true,
    },
    {
      id: "q4",
      type: "fill-blank",
      question: "Complete the code: const [count, ____] = useState(0);",
      correctAnswer: "setCount",
      points: 10,
      required: true,
    },
    {
      id: "q5",
      type: "matching",
      question: "Match the JavaScript methods with their descriptions:",
      matchingPairs: {
        left: ["map()", "filter()", "reduce()", "forEach()"],
        right: [
          "Executes function for each element",
          "Creates new array with filtered elements",
          "Transforms array to single value",
          "Creates new array with transformed elements",
        ],
      },
      correctAnswer: {
        "map()": "Creates new array with transformed elements",
        "filter()": "Creates new array with filtered elements",
        "reduce()": "Transforms array to single value",
        "forEach()": "Executes function for each element",
      },
      points: 20,
      required: true,
    },
    {
      id: "q6",
      type: "image-based",
      question: "What does this code snippet demonstrate?",
      image: "/placeholder.svg?height=200&width=400",
      options: ["Async/Await", "Promise chaining", "Callback hell", "Event handling"],
      correctAnswer: 0,
      points: 15,
      required: true,
    },
  ],
}

const currentUser = {
  name: "Sarah Johnson",
  avatar: "/placeholder.svg?height=40&width=40",
  email: "sarah@example.com",
}

export default function TakeQuizPage({ params }: { params: Promise<{ id: number }> }) {

  // Core state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: UserAnswer }>({})
  const [timeLeft, setTimeLeft] = useState(sampleQuiz.timeLimit * 60)
  const [isPaused, setIsPaused] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
  const [showQuestionNavigator, setShowQuestionNavigator] = useState(false)

  // UI state
  const [language, setLanguage] = useState("en")
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [showReviewMode, setShowReviewMode] = useState(false)

  // Refs
  const questionStartTime = useRef<number>(Date.now())
  const speechSynthesis = useRef<SpeechSynthesis | null>(null)

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      speechSynthesis.current = window.speechSynthesis
    }
  }, [])

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isPaused && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isCompleted) {
      handleAutoSubmit()
    }
  }, [timeLeft, isPaused, isCompleted])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          handlePrevious()
          break
        case "ArrowRight":
        case "Enter":
          e.preventDefault()
          handleNext()
          break
        case "f":
        case "F":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            toggleFlag()
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentQuestionIndex])

  // Voice synthesis
  const speakText = useCallback(
    (text: string) => {
      if (voiceEnabled && speechSynthesis.current) {
        speechSynthesis.current.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.8
        utterance.pitch = 1
        speechSynthesis.current.speak(utterance)
      }
    },
    [voiceEnabled],
  )

  // Question change effect
  useEffect(() => {
    questionStartTime.current = Date.now()
    if (voiceEnabled) {
      const currentQuestion = sampleQuiz.questions[currentQuestionIndex]
      speakText(currentQuestion.question)
    }
  }, [currentQuestionIndex, voiceEnabled, speakText])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getCurrentQuestion = () => sampleQuiz.questions[currentQuestionIndex]
  const getProgress = () => ((currentQuestionIndex + 1) / sampleQuiz.questions.length) * 100

  const saveAnswer = (questionId: string, answer: any) => {
    const timeSpent = Date.now() - questionStartTime.current
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        answer,
        timeSpent,
        flagged: flaggedQuestions.has(questionId),
        skipped: false,
      },
    }))
  }

  const handleAnswerChange = (answer: any) => {
    const currentQuestion = getCurrentQuestion()
    saveAnswer(currentQuestion.id, answer)
  }

  const handleNext = () => {
    const currentQuestion = getCurrentQuestion()
    const currentAnswer = answers[currentQuestion.id]

    if (
      currentQuestion.required &&
      (!currentAnswer || currentAnswer.answer === undefined || currentAnswer.answer === "")
    ) {
      toast.error("Please answer this question before proceeding");
      return
    }

    if (currentQuestionIndex < sampleQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSkip = () => {
    if (sampleQuiz.allowSkip) {
      const currentQuestion = getCurrentQuestion()
      const timeSpent = Date.now() - questionStartTime.current
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          questionId: currentQuestion.id,
          answer: null,
          timeSpent,
          flagged: flaggedQuestions.has(currentQuestion.id),
          skipped: true,
        },
      }))

      if (currentQuestionIndex < sampleQuiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }
    }
  }

  const toggleFlag = () => {
    const currentQuestion = getCurrentQuestion()
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id)
      } else {
        newSet.add(currentQuestion.id)
      }
      return newSet
    })
  }

  const togglePause = () => {
    if (sampleQuiz.allowPause) {
      setIsPaused(!isPaused)
    }
  }

  const handleSubmit = () => {
    setShowSubmitDialog(true)
  }

  const confirmSubmit = () => {
    setIsCompleted(true)
    setShowSubmitDialog(false)
    // Process results here
    toast.success("Your answers have been saved successfully");
  }

  const handleAutoSubmit = () => {
    setIsCompleted(true)
    toast.error("Time's Up! \nQuiz has been automatically submitted");
  }

  const saveForLater = () => {
    // Save current progress
    localStorage.setItem(
      `quiz_${sampleQuiz.id}_progress`,
      JSON.stringify({
        currentQuestionIndex,
        answers,
        timeLeft,
        flaggedQuestions: Array.from(flaggedQuestions),
      }),
    )

    toast.error("Progress Saved \nYou can resume this quiz later");
  }

  const renderQuestion = () => {
    const question = getCurrentQuestion()
    const currentAnswer = answers[question.id]?.answer

    switch (question.type) {
      case "multiple-choice":
        return (
          <RadioGroup
            value={currentAnswer?.toString()}
            onValueChange={(value) => handleAnswerChange(Number.parseInt(value))}
            className="space-y-3"
          >
            {question.options?.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "multiple-select":
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Checkbox
                  id={`option-${index}`}
                  checked={currentAnswer?.includes(index) || false}
                  onCheckedChange={(checked) => {
                    const newAnswer = currentAnswer || []
                    if (checked) {
                      handleAnswerChange([...newAnswer, index])
                    } else {
                      handleAnswerChange(newAnswer.filter((i: number) => i !== index))
                    }
                  }}
                />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case "true-false":
        return (
          <RadioGroup
            value={currentAnswer?.toString()}
            onValueChange={(value) => handleAnswerChange(Number.parseInt(value))}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <RadioGroupItem value="0" id="true" />
              <Label htmlFor="true" className="flex-1 cursor-pointer">
                True
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <RadioGroupItem value="1" id="false" />
              <Label htmlFor="false" className="flex-1 cursor-pointer">
                False
              </Label>
            </div>
          </RadioGroup>
        )

      case "fill-blank":
        return (
          <div className="space-y-4">
            <Input
              placeholder="Type your answer here..."
              value={currentAnswer || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="text-lg p-4"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">Enter your answer in the text field above</p>
          </div>
        )

      case "matching":
        return (
          <MatchingQuestion question={question} currentAnswer={currentAnswer} onAnswerChange={handleAnswerChange} />
        )

      case "image-based":
        return (
          <div className="space-y-6">
            {question.image && (
              <div className="flex justify-center">
                <img
                  src={question.image || "/placeholder.svg"}
                  alt="Question image"
                  className="max-w-full h-auto rounded-lg border shadow-sm"
                />
              </div>
            )}
            <RadioGroup
              value={currentAnswer?.toString()}
              onValueChange={(value) => handleAnswerChange(Number.parseInt(value))}
              className="space-y-3"
            >
              {question.options?.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <RadioGroupItem value={index.toString()} id={`img-option-${index}`} />
                  <Label htmlFor={`img-option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      default:
        return <div>Question type not supported</div>
    }
  }

  if (isCompleted) {
    return <QuizResults quiz={sampleQuiz} answers={answers} />
  }

  const currentQuestion = getCurrentQuestion()
  const isLastQuestion = currentQuestionIndex === sampleQuiz.questions.length - 1
  const isFlagged = flaggedQuestions.has(currentQuestion.id)


  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">

      {/* Quiz Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{sampleQuiz.title}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">{sampleQuiz.description}</p>
            </div>

            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                  <AvatarFallback>
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                  {currentUser.name}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setVoiceEnabled(!voiceEnabled)} title="Toggle voice">
                  {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>

                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-16">
                    <Languages className="h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">EN</SelectItem>
                    <SelectItem value="es">ES</SelectItem>
                    <SelectItem value="fr">FR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Progress and Timer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* <QuestionNavigator /> */}
              <DropdownMenu open={showQuestionNavigator} onOpenChange={setShowQuestionNavigator}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                    <Grid3X3 className="h-4 w-4" />
                    Question {currentQuestionIndex + 1}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto">
                  <div className="p-2">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 px-2">Jump to Question</div>
                    <div className="grid grid-cols-5 gap-2">
                      {sampleQuiz.questions.map((question, index) => {
                        const isAnswered = answers[question.id] && !answers[question.id].skipped
                        const isFlagged = flaggedQuestions.has(question.id)
                        const isCurrent = index === currentQuestionIndex

                        return (
                          <button
                            key={question.id}
                            onClick={() => {
                              setCurrentQuestionIndex(index)
                              setShowQuestionNavigator(false)
                            }}
                            className={`
                              relative w-12 h-12 rounded-lg border-2 text-sm font-medium transition-all
                              ${
                                isCurrent
                                  ? "border-primary bg-primary text-white"
                                  : isAnswered
                                    ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                                    : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                              }
                            `}
                            title={`Question ${index + 1}${isAnswered ? " (Answered)" : ""}${isFlagged ? " (Flagged)" : ""}`}
                          >
                            {index + 1}
                            {isFlagged && <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"></div>}
                            {isAnswered && !isCurrent && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                    <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 px-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Answered</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span>Flagged</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <span>Current</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {sampleQuiz.showProgress && (
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(getProgress())}% Complete</span>
                  </div>
                  <Progress value={getProgress()} className="h-2 w-48" />
                </div>
              )}
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2">
              {sampleQuiz.allowPause && (
                <Button variant="ghost" size="icon" onClick={togglePause} title={isPaused ? "Resume" : "Pause"}>
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
              )}

              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  timeLeft < 300
                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span className="font-mono font-semibold">{isPaused ? "PAUSED" : formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>

                  {/* {currentQuestion.required && (
                    <Badge variant="destructive" className="text-xs">
                      Required
                    </Badge>
                  )} */}

                  {currentQuestion.points && (
                    <Badge variant="secondary" className="text-xs">
                      {/* {currentQuestion.points} pts */}
                      10 pts
                    </Badge>
                  )}
                </div>

                <p className="text-gray-900 dark:text-white text-lg leading-relaxed whitespace-pre-wrap">
                  {currentQuestion.question}
                </p>

                {currentQuestion.description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{currentQuestion.description}</p>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFlag}
                className={isFlagged ? "text-yellow-600" : "text-gray-400"}
                title={isFlagged ? "Remove flag" : "Flag for review"}
              >
                {isFlagged ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {renderQuestion()}

              {/* Answer Status */}
              <div className="flex items-center gap-2 text-sm">
                {answers[currentQuestion.id] ? (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>Answered</span>
                  </div>
                ) : 
                // currentQuestion.required ? (
                //   <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                //     <AlertTriangle className="h-4 w-4" />
                //     <span>Not Answered</span>
                //   </div>
                // ) : 
                (
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <XCircle className="h-4 w-4" />
                    <span>Not answered</span>
                  </div>
                )}

                {isFlagged && (
                  <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                    <Flag className="h-4 w-4" />
                    <span>Flagged for review</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {sampleQuiz.allowSkip && (
                <Button variant="ghost" onClick={handleSkip} className="text-gray-600 dark:text-gray-400">
                  Skip Question
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={saveForLater} className="flex items-center gap-2 bg-transparent">
                <Save className="h-4 w-4" />
                Save for Later
              </Button>

              {isLastQuestion ? (
                <Button onClick={handleSubmit} className="flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  Submit Quiz
                </Button>
              ) : (
                <Button onClick={handleNext} className="flex items-center gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>


              Are you sure you want to submit your quiz? You won't be able to change your answers after submission.
              <span className="mt-4 space-y-2 text-sm"> 
                <span>Total Questions: {sampleQuiz.questions.length}</span>
                <span>Answered: {Object.keys(answers).length}</span>
                <span>Flagged: {flaggedQuestions.size}</span>
                <span>Time Remaining: {formatTime(timeLeft)}</span>
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Answers</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit}>Submit Quiz</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Matching Question Component
function MatchingQuestion({
  question,
  currentAnswer,
  onAnswerChange,
}: {
  question: Question
  currentAnswer: any
  onAnswerChange: (answer: any) => void
}) {
  const [matches, setMatches] = useState<{ [key: string]: string }>(currentAnswer || {})

  const handleMatch = (left: string, right: string) => {
    const newMatches = { ...matches, [left]: right }
    setMatches(newMatches)
    onAnswerChange(newMatches)
  }

  const removeMatch = (left: string) => {
    const newMatches = { ...matches }
    delete newMatches[left]
    setMatches(newMatches)
    onAnswerChange(newMatches)
  }

  if (!question.matchingPairs) return null

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">Items</h4>
          {question.matchingPairs.left.map((item, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                matches[item]
                  ? "border-primary bg-primary/10"
                  : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
              }`}
              onClick={() => matches[item] && removeMatch(item)}
            >
              <div className="flex items-center justify-between">
                <span>{item}</span>
                {matches[item] && (
                  <Badge variant="secondary" className="text-xs">
                    Matched
                  </Badge>
                )}
              </div>
              {matches[item] && <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">→ {matches[item]}</div>}
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">Descriptions</h4>
          {question.matchingPairs.right.map((item, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                Object.values(matches).includes(item)
                  ? "border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 opacity-50"
                  : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
              }`}
              onClick={() => {
                if (!Object.values(matches).includes(item)) {
                  // Find unmatched left item to match with
                  const unmatchedLeft = question.matchingPairs!.left.find((leftItem) => !matches[leftItem])
                  if (unmatchedLeft) {
                    handleMatch(unmatchedLeft, item)
                  }
                }
              }}
            >
              <span>{item}</span>
              {Object.values(matches).includes(item) && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Used
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Click on items from the left column, then click on their matching descriptions from the right column. Progress:{" "}
        {Object.keys(matches).length}/{question.matchingPairs.left.length} matched
      </div>
    </div>
  )
}

// Quiz Results Component
function QuizResults({
  quiz,
  answers,
}: {
  quiz: QuizData
  answers: { [key: string]: UserAnswer }
}) {
  const calculateScore = () => {
    let totalPoints = 0
    let earnedPoints = 0

    quiz.questions.forEach((question) => {
      totalPoints += question.points
      const userAnswer = answers[question.id]

      if (userAnswer && !userAnswer.skipped) {
        // Simple scoring logic - would need more sophisticated comparison for real app
        if (JSON.stringify(userAnswer.answer) === JSON.stringify(question.correctAnswer)) {
          earnedPoints += question.points
        }
      }
    })

    return { earnedPoints, totalPoints, percentage: Math.round((earnedPoints / totalPoints) * 100) }
  }

  const score = calculateScore()
  const answeredQuestions = Object.values(answers).filter((a) => !a.skipped).length
  const flaggedCount = Object.values(answers).filter((a) => a.flagged).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-2">Quiz Completed!</CardTitle>
            <p className="text-gray-600 dark:text-gray-300">{quiz.title}</p>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            <div className="text-6xl font-bold text-primary">{score.percentage}%</div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{score.earnedPoints}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Points Earned</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{score.totalPoints}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Points</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{answeredQuestions}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Questions Answered</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.questions.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Questions</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.location.reload()} className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Retake Quiz
              </Button>
              <Button variant="outline" className="bg-transparent">
                Share Results
              </Button>
              <Button variant="outline" className="bg-transparent">
                View Detailed Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
