"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Eye, Save, X } from "lucide-react"
import { toast } from 'sonner';

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
  const [generateDifficulty, setGenerateDifficulty] = useState("medium")
  const [topic, setTopic] = useState("");
  const [useAIBox , setUseAIBox] = useState(false);
  const [generateQuestionsCount , setGenerateQuestionsCount] = useState(1);
  const [generatingResponse , setGeneratingResponse] = useState(false);
  const [generateQuestionsType , setGenerateQuestionsType] = useState<"multiple-choice" | "true-false">("multiple-choice")

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

  const handleSave = (event: React.FormEvent) => {

    if (questions.length === 0) {
      event.preventDefault();
      toast.error("No questions added. Please add at least one question before saving");
      return;
    }

    // Save quiz logic here
    console.log("Saving quiz:", { quizTitle, quizDescription, questions, timeLimit, timeLimitMinutes, difficulty })
    alert("Quiz saved successfully!")
  }

  const handlePreview = (event: React.FormEvent) => {
    event.preventDefault();

    // Preview logic here
    console.log("Previewing quiz")
    alert("Preview functionality would open here!")
  }

  const resetAIPanel = () => { 
    setGenerateDifficulty('medium');
    setTopic('');
    setUseAIBox(false);
    setGenerateQuestionsCount(1);
    setGeneratingResponse(false);
    setGenerateQuestionsType("multiple-choice");
  }

  const cleanString = (input: string = ""): string => {

    const match = input.match(/[a-zA-Z0-9(].*[a-zA-Z0-9?).]/);
    return match ? match[0] : '';
  }

  const parseQuestion = (input: string) => {
    let question = "" , temp = "";
    const options = [];

    const idx = input.search(/Correct Answer/); // returns -1 if not found
    const n = input.length;
    let check = true , addElement = true , char , open = false , correctAnswer = 1;

    for(let i = 0;i< n;i++){
      char = input.charAt(i);
      if (char == '\n') {
        temp = cleanString(temp);
        if (temp.length == 0)
          continue;

        if (check) {
          check = false;
          question = temp;
        } else {
          options.push(temp);
          if (options.length == 4)
            break;
        }
        addElement = false;

        temp = "";
      }


      if (!/^[a-zA-Z]$/.test(char)) {
        if (i+2 < n && input.charAt(i+1) <= 'd' && input.charAt(i+1) >= 'a' && input.charAt(i+2) == ')') {
          addElement = true;
          i+= 2;
          continue;
        } else if (!open && char == ')') {
          addElement = true;
          continue;
        }
      } 

      if (input.charAt(i) == '(')
        open = true;
      else if (input.charAt(i) == ')') 
        open = false;

      if (addElement)
        temp = temp + char;
    }
    if (options.length != 4) {
      temp = cleanString(temp);
      options.push(temp);
    }
    
    for (let j = idx+14;j< n;j++) {
      if (/^[a-z]$/.test(input[j])) {
        correctAnswer = input[j].charCodeAt(0) - 97;
        break;
      }
    }
    
    return { question , options , correctAnswer };
  }

  const generateQuizAI = (data: string): void => {
    // This will seperate the questions like 1. 2. 3.
    const parts = data.split(/\b\d+[:.]\s*/);
    const newQuestions: Question[] = [];

    for(let i = 1;i< parts.length; i++) {
      const { question , options , correctAnswer } = parseQuestion(parts[i]);

      newQuestions.push({
        id: (Date.now() * i).toString(),
        question,
        type: generateQuestionsType,
        options,
        correctAnswer: correctAnswer,
      });
    }
    setQuestions([...questions, ...newQuestions]);
  }
  
  const geminiResponse = async () => {


    // const API_KEY: string = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    // const genAI = new GoogleGenerativeAI(API_KEY);

    // // This function sends any question to Gemini and returns the response
    // async function askGemini(question: string) {
    //   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // or "gemini-1.5-pro"
      
    //   const result = await model.generateContent(question);
    //   const response = await result.response;
    //   const text = response.text();

    //   return text;
    // }

    // askGemini(topic);


    const prompt = `Generate a quiz on the topic of ${topic} with ${generateDifficulty} difficulty. The quiz should contain ${generateQuestionsCount} questions and be in the format of ${generateQuestionsType} only (e.g., multiple choice, true/false, etc.). For each question, provide a list of answer options, and explicitly state the correct answer clearly after all the options.`;

    const payload = {
      "contents": [{
        "parts": [{
            "text": prompt
        }]
      }]
    }

    const url = process.env.NEXT_PUBLIC_GEMINI_URL;

    let response = await fetch(url , {
      method: 'POST',
      body: JSON.stringify(payload),
      // 'Content-Type' : 'application/json'
    })

    response = await response.json();
    return response.candidates[0].content.parts[0].text;
  }

  const generateQuestions = async () => {
    setGeneratingResponse(true);

    try {
        const data = await geminiResponse()
        generateQuizAI(data);
    } catch (err) {
        console.error(err);
        toast.error('Error generating quiz');
    } finally {
        setGeneratingResponse(false);
    }
  };

  const generateAIHandler = async () => {
    if (topic.trim() === '') {
      toast.error("Please enter a topic for the quiz");
      return;
    }
    if (generateQuestionsCount === 0) {
      toast.error("Please enter no.of questions to generate");
      return;
    }

    toast.success("Processing");
    await generateQuestions();
    toast.success("Generated all the responses")
    resetAIPanel();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Quiz</h1>
          <p className="text-gray-600 dark:text-gray-300">Build an engaging quiz with custom questions and settings</p>
        </div>

        

        <form onSubmit={handleSave}>

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
                  required
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
                    onChange={(e) => {
                      e.target.value = (e.target.value) ? e.target.value : "1";
                      setTimeLimitMinutes(Number.parseInt(e.target.value))
                    }}
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
              <div className="flex items-center gap-4">
                <Button type="button" onClick={() => {setUseAIBox(true);}} className="flex items-center gap-2">
                  Use AI
                </Button>
                <Button type="button" onClick={addQuestion} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {useAIBox && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Ask AI</h3>
                    <div className="flex items-center gap-2">
                      {/* <Select
                        value={generateQuestionsType}
                        onValueChange={(value: "multiple-choice" | "true-false") =>
                          setGenerateQuestionsType(value)
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="true-false">True/False</SelectItem>
                        </SelectContent>
                      </Select> */}
                      <Button variant="outline" type="button" size="icon" 
                      onClick={resetAIPanel}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="topic">Quiz Topic</Label>
                    <Input
                      id="topic"
                      placeholder="Enter quiz topic..."
                      value={topic}
                      required
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>

                  <div className="flex w-full justify-between items-center py-4">
                    <div>
                      <Label htmlFor="questionsCount">Generate No.of Questions</Label>
                      <Input
                        id="questionsCount"
                        type="number"
                        min="1"
                        max="120"
                        value={generateQuestionsCount}
                        onChange={(e) => {
                          e.target.value = (e.target.value) ? e.target.value : '1';
                          setGenerateQuestionsCount(Number.parseInt(e.target.value));
                        }}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label htmlFor="generateDifficulty">Generate Difficulty Level</Label>
                      <Select value={generateDifficulty} onValueChange={setGenerateDifficulty}>
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

                    <div>
                      <Button type="button" onClick={generateAIHandler} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Generate Questions
                      </Button>
                    </div>

                  </div>

                </div>
              )
              }

              {/* Questions */}
              {(questions.length === 0 && !useAIBox) ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No questions added yet. Click &quot;Add Question&quot; to get started.
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
                          required
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
                                  required
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
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Quiz
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}
