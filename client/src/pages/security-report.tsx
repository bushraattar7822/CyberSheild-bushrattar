import { BarChart3, Shield, Lock, Link as LinkIcon, Mail, BookOpen, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import type { SecurityReport as SecurityReportType } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function SecurityReport() {
  const { data: report, isLoading } = useQuery<SecurityReportType>({
    queryKey: ["/api/security-report"],
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <BarChart3 className="mx-auto mb-4 h-12 w-12 animate-pulse text-primary" />
          <p className="text-muted-foreground">Generating security report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <BarChart3 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No report data available</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-chart-2";
    if (score >= 40) return "text-chart-3";
    return "text-destructive";
  };

  const stats = [
    {
      icon: Lock,
      label: "Password Checks",
      value: report.passwordChecks.length,
      color: "text-chart-2"
    },
    {
      icon: LinkIcon,
      label: "URL Checks",
      value: report.urlChecks.length,
      color: "text-chart-1"
    },
    {
      icon: Mail,
      label: "Email Checks",
      value: report.emailChecks.length,
      color: "text-chart-3"
    },
    {
      icon: BookOpen,
      label: "Modules Completed",
      value: report.learningProgress.completedModules,
      color: "text-primary"
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl">Security Report</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive overview of your security checks and learning progress
          </p>
        </div>

        <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-6">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-background">
                <Shield className={cn("h-12 w-12", getScoreColor(report.overallSecurityScore))} />
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-2xl font-bold">Overall Security Score</h2>
                <div className="mb-4 flex items-center gap-3">
                  <span className={cn("text-4xl font-bold", getScoreColor(report.overallSecurityScore))} data-testid="text-security-score">
                    {report.overallSecurityScore}
                  </span>
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <Progress 
                  value={report.overallSecurityScore} 
                  className="h-3 mb-3"
                  data-testid="progress-security-score"
                />
                <p className="text-sm text-muted-foreground">
                  {report.overallSecurityScore >= 70 
                    ? "Excellent! You're maintaining strong security practices."
                    : report.overallSecurityScore >= 40
                    ? "Good start! Keep improving your security knowledge and practices."
                    : "You need to improve your security practices. Complete more checks and learning modules."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted", stat.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Recent Password Checks
              </CardTitle>
              <CardDescription>Your latest password strength analyses</CardDescription>
            </CardHeader>
            <CardContent>
              {report.passwordChecks.length === 0 ? (
                <div className="py-8 text-center">
                  <Lock className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No password checks yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Start by checking a password</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {report.passwordChecks.map((check, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-muted p-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Password #{index + 1}</p>
                        <p className="text-xs text-muted-foreground">
                          Score: {check.score}/100
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          check.strength === 'strong' && "border-chart-2 bg-chart-2/10 text-chart-2",
                          check.strength === 'medium' && "border-chart-3 bg-chart-3/10 text-chart-3",
                          check.strength === 'weak' && "border-destructive bg-destructive/10 text-destructive"
                        )}
                      >
                        {check.strength}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Recent URL Checks
              </CardTitle>
              <CardDescription>Your latest phishing detection scans</CardDescription>
            </CardHeader>
            <CardContent>
              {report.urlChecks.length === 0 ? (
                <div className="py-8 text-center">
                  <LinkIcon className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No URL checks yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Start by checking a URL</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {report.urlChecks.map((check, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-muted p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{check.url}</p>
                        <p className="text-xs text-muted-foreground">
                          Risk: {check.riskLevel}/100
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize ml-2 shrink-0",
                          check.isSafe === 'safe' && "border-chart-2 bg-chart-2/10 text-chart-2",
                          check.isSafe === 'suspicious' && "border-chart-3 bg-chart-3/10 text-chart-3",
                          check.isSafe === 'dangerous' && "border-destructive bg-destructive/10 text-destructive"
                        )}
                      >
                        {check.isSafe}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Learning Progress
              </CardTitle>
              <CardDescription>Your cybersecurity education journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Modules Completed</span>
                  <span className="text-sm text-muted-foreground">
                    {report.learningProgress.completedModules}/{report.learningProgress.totalModules}
                  </span>
                </div>
                <Progress 
                  value={(report.learningProgress.completedModules / report.learningProgress.totalModules) * 100}
                  className="h-2"
                  data-testid="progress-modules"
                />
              </div>
              {report.learningProgress.averageQuizScore > 0 && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Average Quiz Score</span>
                    <span className="text-sm text-muted-foreground">
                      {report.learningProgress.averageQuizScore}%
                    </span>
                  </div>
                  <Progress 
                    value={report.learningProgress.averageQuizScore}
                    className="h-2"
                    data-testid="progress-quiz-average"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recommendations
              </CardTitle>
              <CardDescription>Next steps to improve your security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.passwordChecks.length === 0 && (
                  <div className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm">
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-chart-2" />
                    <span>Check your password strength to ensure account security</span>
                  </div>
                )}
                {report.urlChecks.length === 0 && (
                  <div className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm">
                    <LinkIcon className="mt-0.5 h-4 w-4 shrink-0 text-chart-1" />
                    <span>Verify suspicious URLs before clicking on them</span>
                  </div>
                )}
                {report.emailChecks.length === 0 && (
                  <div className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-chart-3" />
                    <span>Scan suspicious emails for phishing attempts</span>
                  </div>
                )}
                {report.learningProgress.completedModules < report.learningProgress.totalModules && (
                  <div className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm">
                    <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>Complete {report.learningProgress.totalModules - report.learningProgress.completedModules} more learning modules to boost your knowledge</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
