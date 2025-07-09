
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

              {quiz?.allowSkip && (
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
                <span>Total Questions: {quiz?.questions.length}</span>
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