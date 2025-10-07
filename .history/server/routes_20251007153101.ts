import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzePasswordStrength, analyzeUrl, analyzeEmail } from "./security-analysis";
import { insertUserProgressSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Password Strength Checker
  app.post("/api/password-check", async (req, res) => {
    try {
      const { password } = req.body;
      
      if (!password || typeof password !== 'string') {
        return res.status(400).json({ message: "Password is required" });
      }
      

      // Perform server-side analysis
      const analysis = analyzePasswordStrength(password);
      
      // Create hash for storage (privacy)
      const passwordHash = `hash_${password.length}_${analysis.score}`;
      
      const result = await storage.createPasswordCheck({
        passwordHash,
        strength: analysis.strength,
        score: analysis.score,
        suggestions: analysis.suggestions
      });

      res.json({
        ...result,
        analysis // Include analysis in response
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze password" });
    }
  });

  app.get("/api/password-checks", async (req, res) => {
    try {
      const checks = await storage.getPasswordChecks();
      res.json(checks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch password checks" });
    }
  });

  // URL Safety Checker
  app.post("/api/url-check", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ message: "URL is required" });
      }

      // Perform server-side analysis
      const analysis = analyzeUrl(url);
      
      const result = await storage.createUrlCheck({
        url,
        isSafe: analysis.isSafe,
        riskLevel: analysis.riskLevel,
        threats: analysis.threats
      });

      res.json({
        ...result,
        analysis // Include analysis in response
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze URL" });
    }
  });

  app.get("/api/url-checks", async (req, res) => {
    try {
      const checks = await storage.getUrlChecks();
      res.json(checks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch URL checks" });
    }
  });

  // Email Threat Analyzer
  app.post("/api/email-check", async (req, res) => {
    try {
      const { emailContent } = req.body;
      
      if (!emailContent || typeof emailContent !== 'string') {
        return res.status(400).json({ message: "Email content is required" });
      }

      // Perform server-side analysis
      const analysis = analyzeEmail(emailContent);
      
      const result = await storage.createEmailCheck({
        emailContent: emailContent.substring(0, 500), // Store only first 500 chars
        riskScore: analysis.riskScore,
        riskLevel: analysis.riskLevel,
        detectedThreats: analysis.detectedThreats
      });

      res.json({
        ...result,
        analysis // Include analysis in response
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze email" });
    }
  });

  app.get("/api/email-checks", async (req, res) => {
    try {
      const checks = await storage.getEmailChecks();
      res.json(checks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch email checks" });
    }
  });

  // Learning Modules
  app.get("/api/learning-modules", async (req, res) => {
    try {
      const modules = await storage.getLearningModules();
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch learning modules" });
    }
  });

  app.get("/api/learning-modules/:id", async (req, res) => {
    try {
      const module = await storage.getLearningModule(req.params.id);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      res.json(module);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch learning module" });
    }
  });

  // User Progress
  app.post("/api/learning-progress", async (req, res) => {
    try {
      const data = insertUserProgressSchema.parse(req.body);
      const result = await storage.createUserProgress(data);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save progress" });
    }
  });

  app.get("/api/learning-progress", async (req, res) => {
    try {
      const progress = await storage.getUserProgress();
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Security Report
  app.get("/api/security-report", async (req, res) => {
    try {
      const report = await storage.getSecurityReport();
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate security report" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
