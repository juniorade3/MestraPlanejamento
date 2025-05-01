import fetch from 'node-fetch';

type ContentItem = {
  type: string;
  text?: string;
  image_url?: { url: string };
};

type MessageItem = {
  role: 'user' | 'assistant' | 'system';
  content: string | ContentItem[];
};

type DeepseekRequestBody = {
  model: string;
  messages: MessageItem[];
  max_tokens?: number;
  temperature?: number;
  response_format?: { type: 'json_object' };
};

type DeepseekResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_MODEL = 'deepseek-chat'; // Modelo padrão

if (!DEEPSEEK_API_KEY) {
  console.warn('Aviso: DEEPSEEK_API_KEY não está definido no ambiente.');
}

async function callDeepseekAPI(requestBody: DeepseekRequestBody): Promise<DeepseekResponse> {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API Deepseek: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json() as DeepseekResponse;
  } catch (error) {
    console.error('Erro ao chamar a API Deepseek:', error);
    throw error;
  }
}

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
    classType = '',
    resources = [],
    specialNeeds = '',
    includeAssessment = false,
    includeHomework = false,
    includeReferences = false
  } = params;

  const prompt = `Crie um plano de aula detalhado com base nas seguintes informações:

Título: ${title}
Matéria: ${subject}
Série/Ano: ${grade}
Duração: ${duration} minutos
Tópicos: ${topics}
Objetivos: ${objectives}
${classType ? `Tipo de aula: ${classType}\n` : ''}
${resources.length > 0 ? `Recursos: ${resources.join(', ')}\n` : ''}
${specialNeeds ? `Necessidades especiais: ${specialNeeds}\n` : ''}

O plano de aula deve incluir:
1. Introdução
2. Desenvolvimento
3. Conclusão
${includeAssessment ? '4. Método de avaliação\n' : ''}
${includeHomework ? '5. Atividade para casa\n' : ''}
${includeReferences ? '6. Referências bibliográficas\n' : ''}

Retorne o plano de aula em formato JSON com a seguinte estrutura:
{
  "introduction": "Texto detalhado da introdução",
  "development": "Texto detalhado do desenvolvimento",
  "conclusion": "Texto detalhado da conclusão",
  ${includeAssessment ? '"assessment": "Método de avaliação detalhado",\n' : ''}
  ${includeHomework ? '"homework": "Descrição da atividade para casa",\n' : ''}
  ${includeReferences ? '"references": ["Referência 1", "Referência 2"],\n' : ''}
  "tips": "Dicas adicionais para o professor"
}`;

  try {
    const requestBody: DeepseekRequestBody = {
      model: DEEPSEEK_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    };

    const response = await callDeepseekAPI(requestBody);
    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error: any) {
    console.error('Erro ao gerar plano de aula:', error);
    throw new Error(`Falha ao gerar plano de aula: ${error.message || 'Erro desconhecido'}`);
  }
}

export async function generateLessonPlanFromPdf(params: LessonPlanPdfParams): Promise<any> {
  try {
    // Para importar o módulo só quando necessário
    const pdfParse = await import('pdf-parse').then(module => module.default);
    
    const { pdfBuffer, ...otherParams } = params;
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text;
    
    // Criar um prompt que inclui o texto do PDF
    const prompt = `Com base no seguinte texto extraído de diretrizes curriculares: \n\n${pdfText}\n\nE nas seguintes informações fornecidas pelo professor:\n\n` +
      `Título: ${otherParams.title}\n` +
      `Matéria: ${otherParams.subject}\n` +
      `Série/Ano: ${otherParams.grade}\n` +
      `Duração: ${otherParams.duration} minutos\n` +
      `Tópicos: ${otherParams.topics}\n` +
      `Objetivos: ${otherParams.objectives}\n` +
      `${otherParams.classType ? `Tipo de aula: ${otherParams.classType}\n` : ''}` +
      `${otherParams.resources && otherParams.resources.length > 0 ? `Recursos: ${otherParams.resources.join(', ')}\n` : ''}` +
      `${otherParams.specialNeeds ? `Necessidades especiais: ${otherParams.specialNeeds}\n` : ''}\n` +
      `Crie um plano de aula detalhado com a seguinte estrutura em formato JSON:\n` +
      `{\n` +
      `  "introduction": "Texto detalhado da introdução",\n` +
      `  "development": "Texto detalhado do desenvolvimento",\n` +
      `  "conclusion": "Texto detalhado da conclusão",\n` +
      `  ${otherParams.includeAssessment ? '"assessment": "Método de avaliação detalhado",\n' : ''}` +
      `  ${otherParams.includeHomework ? '"homework": "Descrição da atividade para casa",\n' : ''}` +
      `  ${otherParams.includeReferences ? '"references": ["Referência 1", "Referência 2"],\n' : ''}` +
      `  "tips": "Dicas adicionais para o professor"\n` +
      `}`;
    
    const requestBody: DeepseekRequestBody = {
      model: DEEPSEEK_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    };

    const response = await callDeepseekAPI(requestBody);
    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error: any) {
    console.error('Erro ao gerar plano de aula a partir do PDF:', error);
    throw new Error(`Falha ao gerar plano de aula a partir do PDF: ${error.message || 'Erro desconhecido'}`);
  }
}
