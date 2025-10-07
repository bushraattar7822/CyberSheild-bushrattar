import { useState } from "react";
import { Mail, AlertTriangle, Shield, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

type EmailResult = {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  detectedThreats: string[];
};

export default function EmailAnalyzer() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<EmailResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const checkEmailMutation = useMutation({
    mutationFn: async (emailContent: string) => {
      return await apiRequest("POST", "/api/email-check", { emailContent });
    },
    onSuccess: (data: any) => {
      setResult(data.analysis);
      queryClient.invalidateQueries({ queryKey: ["/api/email-checks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/security-report"] });
      toast({
        title: "Email Analysis Complete",
        description: "Your email has been analyzed and saved to your security report.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze email.",
        variant: "destructive",
      });
    }
  });

  const handleAnalyze = () => {
    if (email.length > 0) {
      checkEmailMutation.mutate(email);
    }
  };

  const riskConfig = {
    low: {
      icon: Shield,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      borderColor: "border-chart-2",
      label: "Low Risk",
      description: "This email appears to be relatively safe"
    },
    medium: {
      icon: AlertTriangle,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      borderColor: "border-chart-3",
      label: "Medium Risk",
      description: "Be cautious - this email has some suspicious indicators"
    },
    high: {
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive",
      label: "High Risk",
      description: "Warning! This email shows multiple phishing indicators"
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-chart-3/10">
            <Mail className="h-8 w-8 text-chart-3" />
          </div>
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl">Email Threat Analyzer</h1>
          <p className="text-lg text-muted-foreground">
            Scan emails for phishing indicators and security risks
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analyze Email Content</CardTitle>
            <CardDescription>
              Paste the email content below to scan for potential phishing attempts and security threats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Textarea
                placeholder="Paste email content here..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                rows={10}
                data-testid="input-email-content"
              />
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={email.length === 0 || checkEmailMutation.isPending}
              className="w-full"
              data-testid="button-analyze-email"
            >
              {checkEmailMutation.isPending ? "Analyzing..." : "Analyze Email"}
            </Button>

            {result && (
              <div className="space-y-6 pt-4 border-t">
                {(() => {
                  const config = riskConfig[result.riskLevel];
                  const Icon = config.icon;
                  return (
                    <Card className={cn("border-2", config.borderColor, config.bgColor)}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full", config.bgColor)}>
                            <Icon className={cn("h-6 w-6", config.color)} />
                          </div>
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <h3 className={cn("text-lg font-semibold", config.color)} data-testid="text-risk-level">
                                {config.label}
                              </h3>
                              <Badge variant="outline" data-testid="badge-risk-score">
                                {result.riskScore}/100
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {config.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()}

                <div className="space-y-3">
                  <h3 className="font-semibold">Detected Threats & Indicators</h3>
                  <div className="space-y-2">
                    {result.detectedThreats.map((threat, index) => (
                      <div key={index} className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm">
                        {result.riskLevel === 'low' ? (
                          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-chart-2" />
                        ) : result.riskLevel === 'medium' ? (
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-chart-3" />
                        ) : (
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        )}
                        <span data-testid={`text-threat-${index}`}>{threat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h4 className="mb-2 font-semibold text-sm">Email Security Tips</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Verify sender's email address carefully</li>
                      <li>• Don't click on suspicious links or attachments</li>
                      <li>• Legitimate companies won't ask for passwords via email</li>
                      <li>• Be wary of urgent requests for personal information</li>
                      <li>• When in doubt, contact the company directly</li>
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
