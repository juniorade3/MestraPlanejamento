import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("teacher"),
  school: text("school"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  role: true,
  school: true,
});

// Lesson plan model
export const lessonPlans = pgTable("lesson_plans", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  userId: integer("user_id").notNull(),
  content: json("content").notNull(),
  subject: text("subject").notNull(),
  grade: text("grade").notNull(),
  duration: integer("duration").notNull(),
  topics: text("topics").array().notNull(),
  objectives: text("objectives").notNull(),
  source: text("source").notNull().default("bncc"), // 'bncc' or 'custom'
  status: text("status").notNull().default("draft"), // 'draft', 'completed', etc.
  classType: text("class_type"),
  resources: text("resources").array(),
  specialNeeds: text("special_needs"),
  includeAssessment: boolean("include_assessment").default(false),
  includeHomework: boolean("include_homework").default(false),
  includeReferences: boolean("include_references").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLessonPlanSchema = createInsertSchema(lessonPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Templates model
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  grade: text("grade").notNull(),
  content: json("content").notNull(),
  classType: text("class_type").notNull(),
  topics: text("topics").array().notNull(),
  objectives: text("objectives").notNull(),
  duration: integer("duration").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
});

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LessonPlan = typeof lessonPlans.$inferSelect;
export type InsertLessonPlan = z.infer<typeof insertLessonPlanSchema>;
export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
