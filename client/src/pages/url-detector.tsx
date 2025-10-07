import { useState } from "react";
import { Link as LinkIcon, Shield, AlertTriangle, XCircle, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

type UrlResult = {
  isSafe: 'safe' | 'suspicious' | 'dangerous';
  riskLevel: number;
  threats: string[];
};

export default function UrlDetector() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<UrlResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const checkUrlMutation = useMutation({
    mutationFn: async (url: string) => {
      return await apiRequest("POST", "/api/url-check", { url });
    },
    onSuccess: (data: any) => {
      setResult(data.analysis);
      queryClient.invalidateQueries({ queryKey: ["/api/url-checks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/security-report"] });
      toast({
        title: "URL Analysis Complete",
        description: "Your URL has been analyzed and saved to your security report.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze URL.",
        variant: "destructive",
      });
    }
  });

  const handleCheck = () => {
    if (url.length > 0) {
      checkUrlMutation.mutate(url);
    }
  };

  const safetyConfig = {
    safe: {
      icon: Check,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      borderColor: "border-chart-2",
      label: "Safe Website"
    },
    suspicious: {
      icon: AlertTriangle,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      borderColor: "border-chart-3",
      label: "Suspicious Link"
    },
    dangerous: {
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive",
      label: "Dangerous Link"
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-chart-1/10">
            <LinkIcon className="h-8 w-8 text-chart-1" />
          </div>
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl">Phishing URL Detector</h1>
          <p className="text-lg text-muted-foreground">
            Verify if a website link is safe or potentially dangerous
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Check URL Safety</CardTitle>
            <CardDescription>
              Paste a URL to check if it's a legitimate website or a potential phishing attempt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                data-testid="input-url"
              />
            </div>

            <Button 
              onClick={handleCheck} 
              disabled={url.length === 0 || checkUrlMutation.isPending}
              className="w-full"
              data-testid="button-check-url"
            >
              {checkUrlMutation.isPending ? "Analyzing..." : "Check URL Safety"}
            </Button>

            {result && (
              <div className="space-y-6 pt-4 border-t">
                {(() => {
                  const config = safetyConfig[result.isSafe];
                  const Icon = config.icon;
                  return (
                    <Card className={cn("border-2", config.borderColor, config.bgColor)}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full", config.bgColor)}>
                            <Icon className={cn("h-6 w-6", config.color)} />
                          </div>
                          <div className="flex-1">
                            <h3 className={cn("mb-1 text-lg font-semibold", config.color)} data-testid="text-url-safety">
                              {config.label}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Risk Level: {result.riskLevel}/100
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()}

                <div className="space-y-3">
                  <h3 className="font-semibold">Analysis Details</h3>
                  <div className="space-y-2">
                    {result.threats.map((threat, index) => (
                      <div key={index} className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm">
                        {result.isSafe === 'safe' ? (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-chart-2" />
                        ) : (
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-chart-3" />
                        )}
                        <span data-testid={`text-threat-${index}`}>{threat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h4 className="mb-2 font-semibold text-sm">How to Stay Safe</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Always verify the URL before clicking</li>
                      <li>• Look for HTTPS and a padlock icon</li>
                      <li>• Be cautious of misspelled domain names</li>
                      <li>• Hover over links to see the real destination</li>
                      <li>• Don't click links from unknown sources</li>
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
