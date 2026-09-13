/**
 * OpenRouter AI Configuration & API Service
 *
 * Configured with model: nvidia/nemotron-3.5-lightning:free
 * Free keys and model directory: https://openrouter.ai
 */

// Load OpenRouter API Key from environment variables
export const OPENROUTER_API_KEY =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env["VITE_OPENROUTER_API_KEY"]) ||
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env["OPENROUTER_API_KEY"]) ||
  "";

// Primary default model as requested by user
export const PRIMARY_MODEL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env["VITE_OPENROUTER_MODEL"]) ||
  "nvidia/nemotron-3.5-lightning:free";

// Active high-speed free fallback models on OpenRouter
export const FALLBACK_MODELS = [
  "nex-agi/nex-n2.5-mini:free",
  "liquid/lfm-2.5-2.6b:free",
  "poolside/laguna-s-2.1:free",
];

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "system";
  text: string;
  timestamp: Date;
  modelUsed?: string;
  error?: boolean;
}

export const SYSTEM_INSTRUCTION = `You are "Chef Hub" (also known as RecipeBot), the friendly, knowledgeable, and enthusiastic culinary AI assistant for the RecipeHub web application.

Your capabilities and personality:
1. Culinary Expertise: Help users discover recipes, meal plan for the week, invent dishes from ingredients they currently have in their pantry/fridge, suggest healthy ingredient substitutions, and advise on kitchen techniques.
2. Structured & Clear Recipes: When providing a recipe, always include:
   - 🍽️ Recipe Title
   - ⏱️ Prep Time & Cook Time | 👥 Servings | 📊 Difficulty level
   - 🛒 Ingredients (with clear quantities)
   - 👨‍🍳 Step-by-step numbered instructions
   - 💡 Pro Chef Tips or Variations
3. Tone: Warm, encouraging, editorial, and concise. Avoid overly long disclaimers.
4. RecipeHub App Awareness: You know RecipeHub helps home cooks organize their favorite recipes, build meal plans, and track groceries. You can encourage them to save great recipes to their collection!
5. Formatting: Use clean Markdown formatting (bolding, bullet points, numbered lists) for great readability.`;

/**
 * Resolves the active OpenRouter API key strictly from environment variables.
 */
export function getActiveApiKey(): string {
  const key = (
    (typeof import.meta !== "undefined" && import.meta.env && import.meta.env["VITE_OPENROUTER_API_KEY"]) ||
    (typeof import.meta !== "undefined" && import.meta.env && import.meta.env["OPENROUTER_API_KEY"]) ||
    OPENROUTER_API_KEY ||
    ""
  ).trim();

  return key;
}

/**
 * Sends conversation messages to OpenRouter API with model nvidia/nemotron-3.5-lightning:free
 * and robust automatic fallback if provider errors or capacity issues occur.
 */
export async function sendToOpenRouter(
  history: ChatMessage[],
  apiKeyOverride?: string
): Promise<{ text: string; modelUsed: string }> {
  const apiKey = (apiKeyOverride || getActiveApiKey()).trim();

  if (!apiKey) {
    throw new Error("ASSISTANT_UNAVAILABLE");
  }

  // Format messages into OpenAI/OpenRouter chat completions structure
  const formattedMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: SYSTEM_INSTRUCTION },
  ];

  for (const msg of history) {
    if (msg.role === "user") {
      formattedMessages.push({ role: "user", content: msg.text });
    } else if (msg.role === "model") {
      formattedMessages.push({ role: "assistant", content: msg.text });
    }
  }

  if (formattedMessages.length <= 1) {
    throw new Error("No messages to send.");
  }

  // Build unique models list starting with primary model
  const modelsToTry = Array.from(new Set([PRIMARY_MODEL, ...FALLBACK_MODELS]));
  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://recipehub.app",
          "X-Title": "RecipeHub",
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.error?.message || `HTTP ${response.status} ${response.statusText}`;

        console.warn(`OpenRouter model ${model} failed (${response.status}: ${errorMessage}), trying next fallback...`);
        lastError = new Error(errorMessage);
        continue;
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      const rawText = choice?.message?.content || choice?.message?.reasoning;

      if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
        console.warn(`OpenRouter model ${model} returned empty content, trying next fallback...`);
        lastError = new Error(data?.error?.message || "Received empty response from OpenRouter AI.");
        continue;
      }

      // Strip reasoning / think tags if emitted in content
      const cleanText = rawText
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .replace(/^Here's a thinking process:[\s\S]*?\n\n/i, "")
        .trim();

      return {
        text: cleanText || rawText.trim(),
        modelUsed: model,
      };
    } catch (err: any) {
      console.warn(`OpenRouter model ${model} request error:`, err?.message);
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error("All culinary assistant models are currently busy. Please try again in a moment.");
}
