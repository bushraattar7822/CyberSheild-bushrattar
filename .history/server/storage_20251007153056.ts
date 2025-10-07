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
  createPasswordCheck(check: InsertPasswordCheck): Promise<PasswordCheck>;
  getPasswordChecks(): Promise<PasswordCheck[]>;
  createUrlCheck(check: InsertUrlCheck): Promise<UrlCheck>;
  getUrlChecks(): Promise<UrlCheck[]>;
  createEmailCheck(check: InsertEmailCheck): Promise<EmailCheck>;
  getEmailChecks(): Promise<EmailCheck[]>;
  getLearningModules(): Promise<LearningModule[]>;
  getLearningModule(id: string): Promise<LearningModule | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getUserProgress(): Promise<UserProgress[]>;
  getSecurityReport(): Promise<SecurityReport>;
}

export class MemStorage implements IStorage {
  private passwordChecks = new Map<string, PasswordCheck>();
  private urlChecks = new Map<string, UrlCheck>();
  private emailChecks = new Map<string, EmailCheck>();
  private learningModules = new Map<string, LearningModule>();
  private userProgress = new Map<string, UserProgress>();

  constructor() {
    this.initializeLearningModules();
  }

  private initializeLearningModules() {
    const modules: InsertLearningModule[] = [
      // ... your learning modules array stays the same
    ];

    modules.forEach(module => {
      const id = randomUUID();
      const learningModule: LearningModule = { ...module, id };
      this.learningModules.set(id, learningModule);
    });
  }

  async createPasswordCheck(insertCheck: InsertPasswordCheck): Promise<PasswordCheck> {
    const id = randomUUID();
    const check: PasswordCheck = { ...insertCheck, id, createdAt: new Date() };
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
    const check: UrlCheck = { ...insertCheck, id, createdAt: new Date() };
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
    const check: EmailCheck = { ...insertCheck, id, createdAt: new Date() };
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

  // ✅ Fixed createUserProgress completely
  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();

    const progress: UserProgress = {
      ...insertProgress,
      id,
      completedAt: new Date(),
      quizScore: insertProgress.quizScore ?? null, // ensures it's never undefined
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
      userProgress.filter(p => p.completed === 'yes').map(p => p.moduleId)
    ).size;

    const quizScores = userProgress
      .filter(p => p.quizScore !== null)
      .map(p => p.quizScore as number);

    const averageQuizScore = quizScores.length > 0
      ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length
      : 0;

    let securityScore = 50;
    securityScore += passwordChecks.filter(p => p.strength === 'strong').length > 0 ? 15 : 0;
    securityScore += urlChecks.filter(u => u.isSafe === 'safe').length > 0 ? 10 : 0;
    securityScore += emailChecks.filter(e => e.riskLevel === 'low').length > 0 ? 10 : 0;
    securityScore += Math.min((completedModules / allModules.length) * 15, 15);

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
