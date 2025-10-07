import { useState } from "react";
import { Lock, Check, X, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

type PasswordStrength = {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
  suggestions: string[];
};

export default function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<PasswordStrength | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const checkPasswordMutation = useMutation({
    mutationFn: async (password: string) => {
      return await apiRequest("POST", "/api/password-check", { password });
    },
    onSuccess: (data: any) => {
      setResult(data.analysis);
      queryClient.invalidateQueries({ queryKey: ["/api/password-checks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/security-report"] });
      toast({
        title: "Password Analysis Complete",
        description: "Your password has been analyzed and saved to your security report.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze password.",
        variant: "destructive",
      });
    }
  });

  const handleCheck = () => {
    if (password.length > 0) {
      checkPasswordMutation.mutate(password);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-chart-2/10">
            <Lock className="h-8 w-8 text-chart-2" />
          </div>
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl">Password Strength Checker</h1>
          <p className="text-lg text-muted-foreground">
            Test your password security and get instant recommendations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Check Your Password</CardTitle>
            <CardDescription>
              Enter a password to analyze its strength. We analyze it securely on our server.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password to test"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-24"
                  data-testid="input-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleCheck} 
              disabled={password.length === 0 || checkPasswordMutation.isPending}
              className="w-full"
              data-testid="button-check-password"
            >
              {checkPasswordMutation.isPending ? "Analyzing..." : "Check Password Strength"}
            </Button>

            {result && (
              <div className="space-y-6 pt-4 border-t">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Password Strength</span>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "capitalize",
                        result.strength === 'strong' && "border-chart-2 bg-chart-2/10 text-chart-2",
                        result.strength === 'medium' && "border-chart-3 bg-chart-3/10 text-chart-3",
                        result.strength === 'weak' && "border-destructive bg-destructive/10 text-destructive"
                      )}
                      data-testid="badge-password-strength"
                    >
                      {result.strength}
                    </Badge>
                  </div>
                  <Progress 
                    value={result.score} 
                    className="h-3"
                    data-testid="progress-password-strength"
                  />
                  <p className="text-sm text-muted-foreground">
                    Security Score: {result.score}/100
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Security Recommendations</h3>
                  <div className="space-y-2">
                    {result.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        {result.strength === 'strong' && index === result.suggestions.length - 1 ? (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-chart-2" />
                        ) : result.strength === 'weak' ? (
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        ) : (
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-chart-3" />
                        )}
                        <span className={cn(
                          result.strength === 'strong' && index === result.suggestions.length - 1 
                            ? "text-chart-2" 
                            : "text-muted-foreground"
                        )}>
                          {suggestion}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h4 className="mb-2 font-semibold text-sm">Password Best Practices</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Use at least 12 characters</li>
                      <li>• Mix uppercase, lowercase, numbers, and symbols</li>
                      <li>• Avoid common words and personal information</li>
                      <li>• Use a unique password for each account</li>
                      <li>• Consider using a password manager</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
