import { useState } from "react";
import { BookOpen, Award, CheckCircle2, Lock, Users, Globe, Wifi, Shield, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import type { LearningModule, UserProgress } from "@shared/schema";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
};

const iconMap: Record<string, any> = {
  Mail, Lock, Users, Shield, Globe, Wifi
};

export default function Learning() {
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: modules = [], isLoading: modulesLoading } = useQuery<LearningModule[]>({
    queryKey: ["/api/learning-modules"],
  });

  const { data: progressData = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/learning-progress"],
  });

  const saveProgressMutation = useMutation({
    mutationFn: async (data: { moduleId: string; completed: string; quizScore: number }) => {
      return await apiRequest("POST", "/api/learning-progress", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/learning-progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/security-report"] });
    },
  });

  const completedModuleIds = new Set(
    progressData.filter(p => p.completed === 'yes').map(p => p.moduleId)
  );
  
  const completedCount = completedModuleIds.size;
  const progress = modules.length > 0 ? (completedCount / modules.length) * 100 : 0;

  const handleStartQuiz = () => {
    if (selectedModule) {
      try {
        const questions = JSON.parse(selectedModule.quizQuestions);
        setQuizQuestions(questions);
        setShowQuiz(true);
        setCurrentQuestion(0);
        setScore(0);
        setQuizComplete(false);
        setSelectedAnswer(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load quiz questions",
          variant: "destructive",
        });
      }
    }
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizComplete(true);
    }
  };

  const handleModuleComplete = () => {
    if (selectedModule) {
      const quizScorePercentage = Math.round((score / quizQuestions.length) * 100);
      
      saveProgressMutation.mutate({
        moduleId: selectedModule.id,
        completed: 'yes',
        quizScore: quizScorePercentage
      });

      toast({
        title: "Module Completed!",
        description: `You scored ${score} out of ${quizQuestions.length}. Keep learning!`,
      });
    }
    
    setSelectedModule(null);
    setShowQuiz(false);
  };

  if (modulesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading learning modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {!selectedModule ? (
          <>
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mb-3 text-3xl font-bold sm:text-4xl">Cyber Awareness Learning</h1>
              <p className="text-lg text-muted-foreground">
                Interactive lessons and quizzes to improve your security knowledge
              </p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Your Progress</h3>
                    <p className="text-sm text-muted-foreground">
                      {completedCount} of {modules.length} modules completed
                    </p>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <Award className="h-3 w-3" />
                    {Math.round(progress)}%
                  </Badge>
                </div>
                <Progress value={progress} className="h-2" data-testid="progress-learning" />
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => {
                const Icon = iconMap[module.icon] || BookOpen;
                const isCompleted = completedModuleIds.has(module.id);
                return (
                  <Card 
                    key={module.id} 
                    className="hover-elevate active-elevate-2 transition-all cursor-pointer"
                    onClick={() => setSelectedModule(module)}
                    data-testid={`card-module-${module.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base">{module.title}</CardTitle>
                            {isCompleted && (
                              <CheckCircle2 className="h-5 w-5 shrink-0 text-chart-2" />
                            )}
                          </div>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {module.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        ) : !showQuiz ? (
          <div className="mx-auto max-w-3xl">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedModule(null)}
              className="mb-6"
              data-testid="button-back-to-modules"
            >
              ← Back to Modules
            </Button>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    {(() => {
                      const Icon = iconMap[selectedModule.icon] || BookOpen;
                      return <Icon className="h-6 w-6 text-primary" />;
                    })()}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{selectedModule.title}</CardTitle>
                    <CardDescription className="mt-2">{selectedModule.category}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-foreground">{selectedModule.content}</p>
                </div>

                <Button 
                  onClick={handleStartQuiz}
                  className="w-full"
                  data-testid="button-start-quiz"
                >
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : !quizComplete ? (
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Quiz</CardTitle>
                  <Badge variant="outline">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-medium">
                    {quizQuestions[currentQuestion].question}
                  </h3>
                  <RadioGroup
                    value={selectedAnswer?.toString()}
                    onValueChange={(value) => setSelectedAnswer(parseInt(value))}
                  >
                    {quizQuestions[currentQuestion].options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 rounded-lg border p-3 hover-elevate">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} data-testid={`radio-option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Button 
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  className="w-full"
                  data-testid="button-next-question"
                >
                  {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl">
            <Card className="border-2 border-primary">
              <CardContent className="p-8 text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Award className="h-10 w-10 text-primary" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">Quiz Complete!</h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  You scored {score} out of {quizQuestions.length}
                </p>
                <div className="mb-6">
                  <Progress 
                    value={(score / quizQuestions.length) * 100} 
                    className="h-3"
                    data-testid="progress-quiz-score"
                  />
                </div>
                <Button 
                  onClick={handleModuleComplete} 
                  className="w-full"
                  disabled={saveProgressMutation.isPending}
                  data-testid="button-complete-module"
                >
                  {saveProgressMutation.isPending ? "Saving..." : "Complete Module"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
