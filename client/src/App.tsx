import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import Home from "@/pages/home";
import PasswordChecker from "@/pages/password-checker";
import UrlDetector from "@/pages/url-detector";
import EmailAnalyzer from "@/pages/email-analyzer";
import Learning from "@/pages/learning";
import SecurityReport from "@/pages/security-report";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/password-checker" component={PasswordChecker} />
      <Route path="/url-detector" component={UrlDetector} />
      <Route path="/email-analyzer" component={EmailAnalyzer} />
      <Route path="/learning" component={Learning} />
      <Route path="/report" component={SecurityReport} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
