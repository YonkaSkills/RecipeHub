/**
 * Gemini AI Configuration & API Service
 *
 * You can directly paste your Gemini API Key into the GEMINI_API_KEY constant below.
 * Free keys can be created at: https://aistudio.google.com/app/apikey
 */

// >>> PASTE YOUR GEMINI API KEY DIRECTLY HERE <<<
export const GEMINI_API_KEY = "AQ.Ab8RN6L8-JspgwrihDDfaglbFOwy7XEegUN-FyFCj6ewyADFVw";

// Primary requested model: Gemini 3.1 Flash Lite
export const PRIMARY_MODEL = "gemini-3.1-flash-lite";

// Fallback models in case the requested model name is not yet active/supported on the API endpoint
export const FALLBACK_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
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
 * Resolves the active API key (from file constant first, then localStorage fallback).
 */
export function getActiveApiKey(): string {
  if (GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 0) {
    return GEMINI_API_KEY.trim();
  }

  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("recipehub_gemini_api_key");
    if (stored && stored.trim().length > 0) {
      return stored.trim();
    }
  }

  return "";
}

/**
 * Saves an API key to localStorage if the user inputs it via the UI.
 */
export function saveApiKeyToLocalStorage(key: string): void {
  if (typeof window !== "undefined") {
    if (key.trim()) {
      window.localStorage.setItem("recipehub_gemini_api_key", key.trim());
    } else {
      window.localStorage.removeItem("recipehub_gemini_api_key");
    }
  }
}

/**
 * Sends a conversation to the Google Gemini API with automatic fallback.
 */
export async function sendToGemini(
  history: ChatMessage[],
  apiKeyOverride?: string
): Promise<{ text: string; modelUsed: string }> {
  const apiKey = (apiKeyOverride || getActiveApiKey()).trim();

  if (!apiKey) {
    throw new Error(
      "MISSING_API_KEY: Please provide your Gemini API key in src/lib/gemini.ts or enter it in the chatbot settings."
    );
  }

  // Format messages into Gemini API structure
  // Gemini expects roles: "user" and "model"
  const contents = history
    .filter((msg) => msg.role === "user" || msg.role === "model")
    .map((msg) => ({
      role: msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

  if (contents.length === 0) {
    throw new Error("No messages to send.");
  }

  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];
  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.error?.message || `HTTP ${response.status} ${response.statusText}`;

        // If the model does not exist (e.g. 404), try next fallback model
        if (
          response.status === 404 ||
          errorMessage.toLowerCase().includes("not found") ||
          errorMessage.toLowerCase().includes("is not supported")
        ) {
          console.warn(`Gemini model ${model} not available, trying fallback...`);
          lastError = new Error(errorMessage);
          continue;
        }

        // For other errors (e.g. invalid API key, quota exceeded), throw immediately
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("Received empty response from Gemini AI.");
      }

      return {
        text,
        modelUsed: model,
      };
    } catch (err: any) {
      lastError = err;
      if (err.message && !err.message.toLowerCase().includes("not found")) {
        throw err;
      }
    }
  }

  throw lastError || new Error("Failed to generate response from Gemini AI.");
}
