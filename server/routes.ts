import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  generateLessonPlan, 
  generateLessonPlanFromPdf 
} from "./openai";
import multer from "multer";
import { z } from "zod";
import { insertLessonPlanSchema, insertTemplateSchema } from "@shared/schema";

// Configure multer for PDF uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Lesson Plans API
  app.get("/api/lesson-plans", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const lessonPlans = await storage.getLessonPlansByUserId(req.user!.id);
      res.json(lessonPlans);
    } catch (error) {
      console.error("Error fetching lesson plans:", error);
      res.status(500).send("Internal server error");
    }
  });

  app.get("/api/lesson-plans/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const lessonPlan = await storage.getLessonPlan(parseInt(req.params.id));
      
      if (!lessonPlan) {
        return res.status(404).send("Lesson plan not found");
      }
      
      if (lessonPlan.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }
      
      res.json(lessonPlan);
    } catch (error) {
      console.error("Error fetching lesson plan:", error);
      res.status(500).send("Internal server error");
    }
  });

  app.post("/api/lesson-plans", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const validatedData = insertLessonPlanSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const lessonPlan = await storage.createLessonPlan(validatedData);
      res.status(201).json(lessonPlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      console.error("Error creating lesson plan:", error);
      res.status(500).send("Internal server error");
    }
  });

  app.put("/api/lesson-plans/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const lessonPlanId = parseInt(req.params.id);
      const existingPlan = await storage.getLessonPlan(lessonPlanId);
      
      if (!existingPlan) {
        return res.status(404).send("Lesson plan not found");
      }
      
      if (existingPlan.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }
      
      const validatedData = insertLessonPlanSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const updatedPlan = await storage.updateLessonPlan(lessonPlanId, validatedData);
      res.json(updatedPlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      console.error("Error updating lesson plan:", error);
      res.status(500).send("Internal server error");
    }
  });

  app.delete("/api/lesson-plans/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const lessonPlanId = parseInt(req.params.id);
      const existingPlan = await storage.getLessonPlan(lessonPlanId);
      
      if (!existingPlan) {
        return res.status(404).send("Lesson plan not found");
      }
      
      if (existingPlan.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }
      
      await storage.deleteLessonPlan(lessonPlanId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting lesson plan:", error);
      res.status(500).send("Internal server error");
    }
  });

  // AI Generation API
  app.post("/api/generate-lesson-plan", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const { title, subject, grade, duration, topics, objectives, classType, resources, specialNeeds, includeAssessment, includeHomework, includeReferences } = req.body;
      
      const generatedContent = await generateLessonPlan({
        title,
        subject,
        grade,
        duration,
        topics,
        objectives,
        classType,
        resources,
        specialNeeds,
        includeAssessment,
        includeHomework,
        includeReferences
      });
      
      res.json({ content: generatedContent });
    } catch (error) {
      console.error("Error generating lesson plan:", error);
      res.status(500).send("Internal server error");
    }
  });

  app.post("/api/generate-from-pdf", upload.single('pdf'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      if (!req.file) {
        return res.status(400).send("No PDF file uploaded");
      }
      
      const { title, subject, grade, duration, topics, objectives, classType, resources, specialNeeds, includeAssessment, includeHomework, includeReferences } = req.body;
      
      const pdfBuffer = req.file.buffer;
      
      const generatedContent = await generateLessonPlanFromPdf({
        pdfBuffer,
        title,
        subject,
        grade,
        duration,
        topics,
        objectives,
        classType,
        resources,
        specialNeeds,
        includeAssessment,
        includeHomework,
        includeReferences
      });
      
      res.json({ content: generatedContent });
    } catch (error) {
      console.error("Error generating lesson plan from PDF:", error);
      res.status(500).send("Internal server error");
    }
  });

  // Templates API
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getAllTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).send("Internal server error");
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplate(parseInt(req.params.id));
      
      if (!template) {
        return res.status(404).send("Template not found");
      }
      
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).send("Internal server error");
    }
  });

  app.post("/api/templates", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const validatedData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      console.error("Error creating template:", error);
      res.status(500).send("Internal server error");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
