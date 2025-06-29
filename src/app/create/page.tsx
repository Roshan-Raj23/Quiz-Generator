"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Eye, Save } from "lucide-react"

interface Question {
  id: string
  question: string
  type: "multiple-choice" | "true-false"
  options: string[]
  correctAnswer: number
}

export default function CreateQuizPage() {
  const [quizTitle, setQuizTitle] = useState("")
  const [quizDescription, setQuizDescription] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [timeLimit, setTimeLimit] = useState(false)
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(10)
  const [difficulty, setDifficulty] = useState("medium")

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: 0,
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, options: q.options.map((opt, idx) => (idx === optionIndex ? value : opt)) } : q,
      ),
    )
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const handleSave = () => {
    // Save quiz logic here
    console.log("Saving quiz:", { quizTitle, quizDescription, questions, timeLimit, timeLimitMinutes, difficulty })
    alert("Quiz saved successfully!")
  }

  const handlePreview = () => {
    // Preview logic here
    console.log("Previewing quiz")
    alert("Preview functionality would open here!")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Quiz</h1>
          <p className="text-gray-600 dark:text-gray-300">Build an engaging quiz with custom questions and settings</p>
        </div>

        {/* Quiz Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                placeholder="Enter quiz title..."
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your quiz..."
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quiz Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quiz Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="time-limit">Time Limit</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Set a time limit for the entire quiz</p>
              </div>
              <Switch id="time-limit" checked={timeLimit} onCheckedChange={setTimeLimit} />
            </div>

            {timeLimit && (
              <div>
                <Label htmlFor="minutes">Time Limit (minutes)</Label>
                <Input
                  id="minutes"
                  type="number"
                  min="1"
                  max="120"
                  value={timeLimitMinutes}
                  onChange={(e) => setTimeLimitMinutes(Number.parseInt(e.target.value))}
                  className="w-32"
                />
              </div>
            )}

            <div>
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Questions ({questions.length})</CardTitle>
            <Button onClick={addQuestion} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Question
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No questions added yet. Click "Add Question" to get started.
              </div>
            ) : (
              questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                    <div className="flex items-center gap-2">
                      <Select
                        value={question.type}
                        onValueChange={(value: "multiple-choice" | "true-false") =>
                          updateQuestion(question.id, "type", value)
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="true-false">True/False</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="destructive" size="icon" onClick={() => deleteQuestion(question.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Question Text</Label>
                      <Textarea
                        placeholder="Enter your question..."
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Answer Options</Label>
                      <div className="space-y-2 mt-2">
                        {question.type === "true-false" ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={question.correctAnswer === 0}
                                onChange={() => updateQuestion(question.id, "correctAnswer", 0)}
                              />
                              <span>True</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={question.correctAnswer === 1}
                                onChange={() => updateQuestion(question.id, "correctAnswer", 1)}
                              />
                              <span>False</span>
                            </div>
                          </div>
                        ) : (
                          question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={question.correctAnswer === optionIndex}
                                onChange={() => updateQuestion(question.id, "correctAnswer", optionIndex)}
                              />
                              <Input
                                placeholder={`Option ${optionIndex + 1}`}
                                value={option}
                                onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                              />
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button variant="outline" onClick={handlePreview} className="flex items-center gap-2 bg-transparent">
            <Eye className="h-4 w-4" />
            Preview Quiz
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Quiz
          </Button>
        </div>
      </div>
    </div>
  )
}
