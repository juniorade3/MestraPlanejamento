import OpenAI from "openai";
import * as pdfParse from "pdf-parse";

// Função para garantir que não tente ler arquivos durante a inicialização
const parsePdf = async (buffer: Buffer) => {
  return await pdfParse.default(buffer);
};

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface LessonPlanParams {
  title: string;
  subject: string;
  grade: string;
  duration: number;
  topics: string;
  objectives: string;
  classType?: string;
  resources?: string[];
  specialNeeds?: string;
  includeAssessment?: boolean;
  includeHomework?: boolean;
  includeReferences?: boolean;
}

interface LessonPlanPdfParams extends LessonPlanParams {
  pdfBuffer: Buffer;
}

export async function generateLessonPlan(params: LessonPlanParams): Promise<any> {
  const {
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
  } = params;

  const prompt = `
    Crie um plano de aula detalhado com base na Base Nacional Comum Curricular (BNCC) brasileira com os seguintes parâmetros:
    
    Título: ${title}
    Disciplina: ${subject}
    Série/Ano: ${grade}
    Duração: ${duration} minutos
    Tópicos: ${topics}
    Objetivos: ${objectives}
    ${classType ? `Tipo de aula: ${classType}` : ''}
    ${resources?.length ? `Recursos necessários: ${resources.join(', ')}` : ''}
    ${specialNeeds ? `Adaptações para necessidades especiais: ${specialNeeds}` : ''}
    
    O plano deve incluir:
    1. Introdução/Abertura
    2. Desenvolvimento detalhado com atividades
    3. Fechamento/Conclusão
    ${includeAssessment ? '4. Métodos de avaliação' : ''}
    ${includeHomework ? '5. Tarefas para casa' : ''}
    ${includeReferences ? '6. Referências bibliográficas' : ''}
    
    Certifique-se de que o plano esteja alinhado com as competências e habilidades da BNCC para esta disciplina e série.
    
    Responda com JSON contendo as seções do plano de aula estruturadas para fácil exibição.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Você é um especialista em educação brasileira com profundo conhecimento da BNCC." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    throw new Error("Falha ao gerar o plano de aula com IA");
  }
}

export async function generateLessonPlanFromPdf(params: LessonPlanPdfParams): Promise<any> {
  const { pdfBuffer, ...otherParams } = params;
  
  try {
    // Extract text from PDF
    const pdfData = await parsePdf(pdfBuffer);
    const pdfContent = pdfData.text;
    
    const prompt = `
      Analise as diretrizes educacionais do PDF a seguir e crie um plano de aula personalizado que esteja alinhado com essas diretrizes.
      
      Título: ${otherParams.title}
      Disciplina: ${otherParams.subject}
      Série/Ano: ${otherParams.grade}
      Duração: ${otherParams.duration} minutos
      Tópicos: ${otherParams.topics}
      Objetivos: ${otherParams.objectives}
      ${otherParams.classType ? `Tipo de aula: ${otherParams.classType}` : ''}
      ${otherParams.resources?.length ? `Recursos necessários: ${otherParams.resources.join(', ')}` : ''}
      ${otherParams.specialNeeds ? `Adaptações para necessidades especiais: ${otherParams.specialNeeds}` : ''}
      
      Conteúdo do PDF com as diretrizes:
      ${pdfContent}
      
      O plano deve incluir:
      1. Introdução/Abertura
      2. Desenvolvimento detalhado com atividades
      3. Fechamento/Conclusão
      ${otherParams.includeAssessment ? '4. Métodos de avaliação' : ''}
      ${otherParams.includeHomework ? '5. Tarefas para casa' : ''}
      ${otherParams.includeReferences ? '6. Referências bibliográficas' : ''}
      
      Certifique-se de que o plano esteja alinhado com as diretrizes específicas mencionadas no PDF.
      
      Responda com JSON contendo as seções do plano de aula estruturadas para fácil exibição.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Você é um especialista em educação brasileira com habilidade para interpretar diretrizes educacionais e criar planos de aula personalizados." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error generating lesson plan from PDF:", error);
    throw new Error("Falha ao gerar o plano de aula a partir do PDF");
  }
}
