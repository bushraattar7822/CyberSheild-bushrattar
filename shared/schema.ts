import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Password Check Schema
export const passwordChecks = pgTable("password_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  passwordHash: text("password_hash").notNull(),
  strength: text("strength").notNull(), // weak, medium, strong
  score: integer("score").notNull(),
  suggestions: text("suggestions").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPasswordCheckSchema = createInsertSchema(passwordChecks).omit({
  id: true,
  createdAt: true,
});

export type InsertPasswordCheck = z.infer<typeof insertPasswordCheckSchema>;
export type PasswordCheck = typeof passwordChecks.$inferSelect;

// URL Check Schema
export const urlChecks = pgTable("url_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  isSafe: text("is_safe").notNull(), // safe, suspicious, dangerous
  riskLevel: integer("risk_level").notNull(), // 0-100
  threats: text("threats").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUrlCheckSchema = createInsertSchema(urlChecks).omit({
  id: true,
  createdAt: true,
});

export type InsertUrlCheck = z.infer<typeof insertUrlCheckSchema>;
export type UrlCheck = typeof urlChecks.$inferSelect;

// Email Check Schema
export const emailChecks = pgTable("email_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  emailContent: text("email_content").notNull(),
  riskScore: integer("risk_score").notNull(), // 0-100
  riskLevel: text("risk_level").notNull(), // low, medium, high
  detectedThreats: text("detected_threats").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmailCheckSchema = createInsertSchema(emailChecks).omit({
  id: true,
  createdAt: true,
});

export type InsertEmailCheck = z.infer<typeof insertEmailCheckSchema>;
export type EmailCheck = typeof emailChecks.$inferSelect;

// Learning Module Schema
export const learningModules = pgTable("learning_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  quizQuestions: text("quiz_questions").notNull(), // JSON string
});

export const insertLearningModuleSchema = createInsertSchema(learningModules).omit({
  id: true,
});

export type InsertLearningModule = z.infer<typeof insertLearningModuleSchema>;
export type LearningModule = typeof learningModules.$inferSelect;

// User Progress Schema
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: varchar("module_id").notNull(),
  completed: text("completed").notNull(), // yes, no
  quizScore: integer("quiz_score"),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  completedAt: true,
});

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

// Security Report Types (aggregated data)
export type SecurityReport = {
  totalChecks: number;
  passwordChecks: PasswordCheck[];
  urlChecks: UrlCheck[];
  emailChecks: EmailCheck[];
  learningProgress: {
    completedModules: number;
    totalModules: number;
    averageQuizScore: number;
  };
  overallSecurityScore: number;
};
