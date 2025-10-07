import { Link } from "wouter";
import { Shield, Lock, Link as LinkIcon, Mail, BookOpen, BarChart3, AlertTriangle, Bug, Database, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const threats = [
  {
    icon: Mail,
    title: "Phishing Attacks",
    description: "Fake emails designed to steal your credentials and personal information",
    color: "text-chart-3"
  },
  {
    icon: Bug,
    title: "Malware",
    description: "Malicious software that can damage your system or steal data",
    color: "text-chart-5"
  },
  {
    icon: Database,
    title: "Data Theft",
    description: "Unauthorized access to your sensitive personal or business data",
    color: "text-chart-1"
  },
  {
    icon: Key,
    title: "Password Leaks",
    description: "Exposed passwords from data breaches that put your accounts at risk",
    color: "text-destructive"
  }
];

const tools = [
  {
    path: "/password-checker",
    icon: Lock,
    title: "Password Strength Checker",
    description: "Test your password security and get instant recommendations",
    color: "bg-chart-2/10 text-chart-2 border-chart-2/20"
  },
  {
    path: "/url-detector",
    icon: LinkIcon,
    title: "Phishing URL Detector",
    description: "Verify if a website link is safe or potentially dangerous",
    color: "bg-chart-1/10 text-chart-1 border-chart-1/20"
  },
  {
    path: "/email-analyzer",
    icon: Mail,
    title: "Email Threat Analyzer",
    description: "Scan emails for phishing indicators and security risks",
    color: "bg-chart-3/10 text-chart-3 border-chart-3/20"
  },
  {
    path: "/learning",
    icon: BookOpen,
    title: "Cyber Awareness Learning",
    description: "Interactive lessons and quizzes to improve your security knowledge",
    color: "bg-primary/10 text-primary border-primary/20"
  }
];

const stats = [
  { value: "500K+", label: "Threats Blocked" },
  { value: "50K+", label: "Users Protected" },
  { value: "99.9%", label: "Detection Rate" },
  { value: "24/7", label: "Protection" }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              Advanced Threat Detection
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              CyberShield
              <br />
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Protect Yourself from Cyber Threats
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Stay safe online with our comprehensive cybersecurity tools. Check passwords, detect phishing, analyze threats, and learn security best practices.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/password-checker">
                <Button size="lg" className="gap-2" data-testid="button-check-security">
                  <Lock className="h-5 w-5" />
                  Check My Security
                </Button>
              </Link>
              <Link href="/learning">
                <Button size="lg" variant="outline" className="gap-2" data-testid="button-learn-safety">
                  <BookOpen className="h-5 w-5" />
                  Learn Cyber Safety
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Threats */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Common Cyber Threats</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Understanding these threats is the first step to protecting yourself online
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {threats.map((threat, index) => {
              const Icon = threat.icon;
              return (
                <Card key={index} className="hover-elevate transition-all">
                  <CardHeader>
                    <div className={cn("mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted", threat.color)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{threat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{threat.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Tools */}
      <section className="bg-muted/50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Security Tools</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Powerful tools to help you identify and prevent cyber threats
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Link key={index} href={tool.path}>
                  <Card className="h-full hover-elevate active-elevate-2 transition-all cursor-pointer" data-testid={`card-tool-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border", tool.color)}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="mb-2">{tool.title}</CardTitle>
                          <CardDescription>{tool.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 to-chart-1/10">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center">
                <BarChart3 className="mx-auto mb-6 h-12 w-12 text-primary" />
                <h2 className="mb-4 text-3xl font-bold sm:text-4xl">View Your Security Report</h2>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                  Get a comprehensive overview of your security checks and learning progress
                </p>
                <Link href="/report">
                  <Button size="lg" data-testid="button-view-report">
                    View Security Report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
