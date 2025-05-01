import { 
  users, 
  User, 
  InsertUser, 
  lessonPlans, 
  LessonPlan, 
  InsertLessonPlan,
  templates,
  Template,
  InsertTemplate
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lesson plan methods
  getLessonPlan(id: number): Promise<LessonPlan | undefined>;
  getLessonPlansByUserId(userId: number): Promise<LessonPlan[]>;
  createLessonPlan(plan: InsertLessonPlan): Promise<LessonPlan>;
  updateLessonPlan(id: number, plan: InsertLessonPlan): Promise<LessonPlan>;
  deleteLessonPlan(id: number): Promise<void>;

  // Template methods
  getTemplate(id: number): Promise<Template | undefined>;
  getAllTemplates(): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;

  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private lessonPlans: Map<number, LessonPlan>;
  private templates: Map<number, Template>;
  sessionStore: session.SessionStore;
  
  currentUserId: number;
  currentLessonPlanId: number;
  currentTemplateId: number;

  constructor() {
    this.users = new Map();
    this.lessonPlans = new Map();
    this.templates = new Map();
    this.currentUserId = 1;
    this.currentLessonPlanId = 1;
    this.currentTemplateId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24h, prune expired entries
    });

    // Initialize with sample template data
    this.initializeTemplates();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getLessonPlan(id: number): Promise<LessonPlan | undefined> {
    return this.lessonPlans.get(id);
  }

  async getLessonPlansByUserId(userId: number): Promise<LessonPlan[]> {
    return Array.from(this.lessonPlans.values()).filter(
      (plan) => plan.userId === userId
    );
  }

  async createLessonPlan(insertPlan: InsertLessonPlan): Promise<LessonPlan> {
    const id = this.currentLessonPlanId++;
    const now = new Date();
    const plan: LessonPlan = { 
      ...insertPlan, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.lessonPlans.set(id, plan);
    return plan;
  }

  async updateLessonPlan(id: number, insertPlan: InsertLessonPlan): Promise<LessonPlan> {
    const existingPlan = this.lessonPlans.get(id);
    if (!existingPlan) {
      throw new Error(`Lesson plan with id ${id} not found`);
    }
    
    const updatedPlan: LessonPlan = {
      ...existingPlan,
      ...insertPlan,
      id,
      updatedAt: new Date()
    };
    
    this.lessonPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  async deleteLessonPlan(id: number): Promise<void> {
    this.lessonPlans.delete(id);
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = this.currentTemplateId++;
    const template: Template = {
      ...insertTemplate,
      id,
      createdAt: new Date()
    };
    this.templates.set(id, template);
    return template;
  }

  private initializeTemplates() {
    // Sample templates based on the design
    const templates: InsertTemplate[] = [
      {
        title: "Aula Colaborativa: Ciências",
        subject: "ciencias",
        grade: "fundamental_6",
        content: {
          introduction: "Aula colaborativa focada em descobertas científicas através de experimentos em grupo.",
          development: "Os alunos serão divididos em grupos para realizar experimentos simples e documentar suas observações.",
          conclusion: "Cada grupo apresentará seus resultados e conclusões para a turma."
        },
        classType: "laboratorio",
        topics: ["Método científico", "Trabalho em equipe", "Observação e registro"],
        objectives: "Desenvolver habilidades de trabalho em equipe e aplicação do método científico.",
        duration: 90
      },
      {
        title: "Análise Literária",
        subject: "portugues",
        grade: "medio_1",
        content: {
          introduction: "Apresentação da obra literária e seu contexto histórico.",
          development: "Análise dos elementos narrativos, personagens e temas principais.",
          conclusion: "Discussão sobre a relevância da obra na contemporaneidade."
        },
        classType: "debate",
        topics: ["Análise textual", "Contexto histórico", "Interpretação"],
        objectives: "Desenvolver habilidades de análise crítica e interpretação de textos literários.",
        duration: 100
      },
      {
        title: "Atividades Lúdicas",
        subject: "educacao_fisica",
        grade: "infantil_4",
        content: {
          introduction: "Acolhimento com música e movimentos corporais.",
          development: "Circuito de atividades lúdicas para desenvolvimento motor.",
          conclusion: "Relaxamento e feedback das atividades realizadas."
        },
        classType: "pratica",
        topics: ["Desenvolvimento motor", "Coordenação", "Socialização"],
        objectives: "Estimular o desenvolvimento motor e a socialização através de brincadeiras educativas.",
        duration: 45
      }
    ];

    templates.forEach(template => {
      const id = this.currentTemplateId++;
      this.templates.set(id, {
        ...template,
        id,
        createdAt: new Date()
      });
    });
  }
}

export const storage = new MemStorage();
