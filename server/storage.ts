import { 
  type PasswordCheck, type InsertPasswordCheck,
  type UrlCheck, type InsertUrlCheck,
  type EmailCheck, type InsertEmailCheck,
  type LearningModule, type InsertLearningModule,
  type UserProgress, type InsertUserProgress,
  type SecurityReport
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Password Checks
  createPasswordCheck(check: InsertPasswordCheck): Promise<PasswordCheck>;
  getPasswordChecks(): Promise<PasswordCheck[]>;
  
  // URL Checks
  createUrlCheck(check: InsertUrlCheck): Promise<UrlCheck>;
  getUrlChecks(): Promise<UrlCheck[]>;
  
  // Email Checks
  createEmailCheck(check: InsertEmailCheck): Promise<EmailCheck>;
  getEmailChecks(): Promise<EmailCheck[]>;
  
  // Learning Modules
  getLearningModules(): Promise<LearningModule[]>;
  getLearningModule(id: string): Promise<LearningModule | undefined>;
  
  // User Progress
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getUserProgress(): Promise<UserProgress[]>;
  
  // Security Report
  getSecurityReport(): Promise<SecurityReport>;
}

export class MemStorage implements IStorage {
  private passwordChecks: Map<string, PasswordCheck>;
  private urlChecks: Map<string, UrlCheck>;
  private emailChecks: Map<string, EmailCheck>;
  private learningModules: Map<string, LearningModule>;
  private userProgress: Map<string, UserProgress>;

  constructor() {
    this.passwordChecks = new Map();
    this.urlChecks = new Map();
    this.emailChecks = new Map();
    this.learningModules = new Map();
    this.userProgress = new Map();
    
    // Initialize with learning modules
    this.initializeLearningModules();
  }

  private initializeLearningModules() {
    const modules: InsertLearningModule[] = [
      {
        title: "Identifying Phishing Attacks",
        description: "Learn how to spot fake emails and websites designed to steal your information",
        content: "Phishing is a type of cyber attack where attackers impersonate legitimate organizations to steal sensitive information. Look for suspicious sender addresses, urgent language, spelling errors, and unusual requests for personal information.",
        category: "Email Security",
        icon: "Mail",
        quizQuestions: JSON.stringify([
          {
            question: "What is a common sign of a phishing email?",
            options: ["Urgent requests for personal information", "Professional formatting", "Company logo present", "Addressed to you by name"],
            correctAnswer: 0
          },
          {
            question: "What should you do if you receive a suspicious email?",
            options: ["Click links to verify", "Reply with your info", "Report and delete it", "Forward to friends"],
            correctAnswer: 2
          }
        ])
      },
      {
        title: "Creating Strong Passwords",
        description: "Master the art of creating and managing secure passwords",
        content: "A strong password should be at least 12 characters long and include uppercase letters, lowercase letters, numbers, and special symbols. Never reuse passwords across different accounts. Use a password manager to keep track of your passwords securely.",
        category: "Account Security",
        icon: "Lock",
        quizQuestions: JSON.stringify([
          {
            question: "What is the minimum recommended password length?",
            options: ["6 characters", "8 characters", "10 characters", "12 characters"],
            correctAnswer: 3
          },
          {
            question: "Should you reuse passwords across different accounts?",
            options: ["Yes, for easy memory", "No, never", "Only for similar sites", "Only for unimportant accounts"],
            correctAnswer: 1
          }
        ])
      },
      {
        title: "Social Media Privacy",
        description: "Protect your personal information on social platforms",
        content: "Review your privacy settings regularly. Limit who can see your posts, personal information, and location. Be cautious about accepting friend requests from unknown people. Avoid sharing sensitive information like your address, phone number, or daily routines publicly.",
        category: "Privacy",
        icon: "Users",
        quizQuestions: JSON.stringify([
          {
            question: "What information should you avoid sharing publicly on social media?",
            options: ["Your interests", "Your home address", "Your favorite movies", "Your pet's name"],
            correctAnswer: 1
          },
          {
            question: "How often should you review your privacy settings?",
            options: ["Never", "Once a year", "Regularly", "Only when changing jobs"],
            correctAnswer: 2
          }
        ])
      },
      {
        title: "Two-Factor Authentication",
        description: "Add an extra layer of security to your accounts",
        content: "Two-factor authentication (2FA) adds an extra security step when logging into your accounts. Even if someone steals your password, they won't be able to access your account without the second factor. Use authenticator apps rather than SMS when possible for better security.",
        category: "Account Security",
        icon: "Shield",
        quizQuestions: JSON.stringify([
          {
            question: "What does 2FA provide?",
            options: ["Faster login", "Extra security layer", "Better passwords", "Free storage"],
            correctAnswer: 1
          },
          {
            question: "Which 2FA method is more secure?",
            options: ["SMS codes", "Authenticator apps", "Email codes", "Security questions"],
            correctAnswer: 1
          }
        ])
      },
      {
        title: "Safe Browsing Habits",
        description: "Stay safe while surfing the web",
        content: "Always check for HTTPS in the URL before entering sensitive information. Be cautious of pop-ups and unexpected downloads. Keep your browser and plugins updated. Use ad blockers and anti-tracking extensions to enhance your privacy and security.",
        category: "Web Security",
        icon: "Globe",
        quizQuestions: JSON.stringify([
          {
            question: "What does HTTPS indicate?",
            options: ["Fast website", "Secure connection", "Popular site", "Mobile friendly"],
            correctAnswer: 1
          },
          {
            question: "Should you click on unexpected pop-ups?",
            options: ["Yes, always", "Only from known sites", "No, close them", "Only on mobile"],
            correctAnswer: 2
          }
        ])
      },
      {
        title: "Public Wi-Fi Security",
        description: "Protect yourself on public networks",
        content: "Public Wi-Fi networks are often unsecured and can be monitored by attackers. Avoid accessing sensitive accounts or making financial transactions on public Wi-Fi. Use a VPN (Virtual Private Network) to encrypt your connection when using public networks.",
        category: "Network Security",
        icon: "Wifi",
        quizQuestions: JSON.stringify([
          {
            question: "What should you avoid on public Wi-Fi?",
            options: ["Reading news", "Checking weather", "Online banking", "Watching videos"],
            correctAnswer: 2
          },
          {
            question: "What tool can help secure public Wi-Fi connections?",
            options: ["Antivirus", "VPN", "Firewall", "Ad blocker"],
            correctAnswer: 1
          }
        ])
      }
    ];

    modules.forEach(module => {
      const id = randomUUID();
      const learningModule: LearningModule = { ...module, id };
      this.learningModules.set(id, learningModule);
    });
  }

  async createPasswordCheck(insertCheck: InsertPasswordCheck): Promise<PasswordCheck> {
    const id = randomUUID();
    const check: PasswordCheck = { 
      ...insertCheck, 
      id,
      createdAt: new Date()
    };
    this.passwordChecks.set(id, check);
    return check;
  }

  async getPasswordChecks(): Promise<PasswordCheck[]> {
    return Array.from(this.passwordChecks.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createUrlCheck(insertCheck: InsertUrlCheck): Promise<UrlCheck> {
    const id = randomUUID();
    const check: UrlCheck = { 
      ...insertCheck, 
      id,
      createdAt: new Date()
    };
    this.urlChecks.set(id, check);
    return check;
  }

  async getUrlChecks(): Promise<UrlCheck[]> {
    return Array.from(this.urlChecks.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createEmailCheck(insertCheck: InsertEmailCheck): Promise<EmailCheck> {
    const id = randomUUID();
    const check: EmailCheck = { 
      ...insertCheck, 
      id,
      createdAt: new Date()
    };
    this.emailChecks.set(id, check);
    return check;
  }

  async getEmailChecks(): Promise<EmailCheck[]> {
    return Array.from(this.emailChecks.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getLearningModules(): Promise<LearningModule[]> {
    return Array.from(this.learningModules.values());
  }

  async getLearningModule(id: string): Promise<LearningModule | undefined> {
    return this.learningModules.get(id);
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();
    const progress: UserProgress = { 
      ...insertProgress, 
      id,
      completedAt: new Date()
    };
    this.userProgress.set(id, progress);
    return progress;
  }

  async getUserProgress(): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values());
  }

  async getSecurityReport(): Promise<SecurityReport> {
    const passwordChecks = await this.getPasswordChecks();
    const urlChecks = await this.getUrlChecks();
    const emailChecks = await this.getEmailChecks();
    const userProgress = await this.getUserProgress();
    const allModules = await this.getLearningModules();

    const completedModules = new Set(
      userProgress
        .filter(p => p.completed === 'yes')
        .map(p => p.moduleId)
    ).size;

    const quizScores = userProgress
      .filter(p => p.quizScore !== null && p.quizScore !== undefined)
      .map(p => p.quizScore as number);
    
    const averageQuizScore = quizScores.length > 0
      ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length
      : 0;

    // Calculate overall security score (0-100)
    let securityScore = 50; // Base score
    
    // Strong passwords increase score
    const strongPasswords = passwordChecks.filter(p => p.strength === 'strong').length;
    if (strongPasswords > 0) securityScore += 15;
    
    // Safe URLs increase score
    const safeUrls = urlChecks.filter(u => u.isSafe === 'safe').length;
    if (safeUrls > 0) securityScore += 10;
    
    // Low risk emails increase score
    const safeEmails = emailChecks.filter(e => e.riskLevel === 'low').length;
    if (safeEmails > 0) securityScore += 10;
    
    // Learning progress increases score
    const learningBonus = Math.min((completedModules / allModules.length) * 15, 15);
    securityScore += learningBonus;

    return {
      totalChecks: passwordChecks.length + urlChecks.length + emailChecks.length,
      passwordChecks: passwordChecks.slice(0, 5),
      urlChecks: urlChecks.slice(0, 5),
      emailChecks: emailChecks.slice(0, 5),
      learningProgress: {
        completedModules,
        totalModules: allModules.length,
        averageQuizScore: Math.round(averageQuizScore)
      },
      overallSecurityScore: Math.min(Math.round(securityScore), 100)
    };
  }
}

export const storage = new MemStorage();
