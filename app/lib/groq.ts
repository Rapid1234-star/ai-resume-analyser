import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface AIResponse {
  index: number;
  message: {
    role: string;
    content: string;
    refusal: null | string;
    annotations: any[];
  };
  logprobs: null | any;
  finish_reason: string;
  usage: {
    type: string;
    model: string;
    amount: number;
    cost: number;
  }[];
  via_ai_chat_service: boolean;
}

export async function analyzeResume(
  resumeText: string,
  systemPrompt: string
): Promise<AIResponse | undefined> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Resume content:\n${resumeText}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1800,
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (content) {
      return {
        index: 0,
        message: {
          role: "assistant",
          content,
          refusal: null,
          annotations: [],
        },
        logprobs: null,
        finish_reason: "stop",
        usage: [],
        via_ai_chat_service: false,
      };
    }
  } catch (error) {
    console.error("Error analyzing resume with Groq:", error);
  }
  return undefined;
}
