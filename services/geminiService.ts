import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, DailyMetric } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const COACH_MODEL = 'gemini-2.5-flash';
const RECIPE_MODEL = 'gemini-2.5-flash';

/**
 * Generates a personalized health analysis based on user data.
 */
export const generateHealthAnalysis = async (
  profile: UserProfile,
  latestMetric: DailyMetric | undefined,
  metricHistory: DailyMetric[]
): Promise<string> => {
  if (!latestMetric) return "No data available yet. Please log your daily metrics.";

  const prompt = `
    Act as an empathetic and highly knowledgeable Medical Health Coach.
    Analyze the following user data and provide a concise daily summary, highlighting risks based on family history and current metrics.

    User Profile:
    - Name: ${profile.name}
    - Age: ${profile.age}
    - BMI: ${(latestMetric.weight / (profile.height * profile.height)).toFixed(2)}
    - Family History: ${JSON.stringify(profile.familyHistory)}
    - Chronic Diseases: ${profile.chronicDiseases}

    Today's Metrics:
    - Steps: ${latestMetric.steps}
    - Heart Rate: ${latestMetric.heartRate} bpm
    - Sleep: ${latestMetric.sleepHours} hours
    - Mood: ${latestMetric.mood}
    - Symptoms: ${latestMetric.symptoms.join(', ') || 'None'}

    History Trend (Last 3 entries): ${JSON.stringify(metricHistory.slice(-3))}

    Provide:
    1. A "Wellness Score" out of 100 based on the data.
    2. A brief analysis of their day.
    3. One specific actionable recommendation.
    
    Format the response in clear Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: COACH_MODEL,
      contents: prompt,
      config: {
        systemInstruction: "You are BioSync, an advanced AI health assistant.",
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for speed on flash
      }
    });
    return response.text || "Unable to generate analysis.";
  } catch (error) {
    console.error("Analysis Error:", error);
    return "Error generating analysis. Please try again later.";
  }
};

/**
 * Generates a recipe based on health constraints.
 */
export const generateSmartRecipe = async (
  profile: UserProfile,
  weight: number,
  preference: string
): Promise<string> => {
    const bmi = (weight / (profile.height * profile.height)).toFixed(2);
    
    const prompt = `
      Create a healthy, delicious recipe for a user with the following context:
      - Preference/Craving: ${preference}
      - BMI: ${bmi}
      - Family History Risks: ${JSON.stringify(profile.familyHistory)}
      
      The recipe must be specifically tailored to mitigate their health risks (e.g., low sodium for hypertension history, low sugar for diabetes history).
      Include:
      1. Recipe Name
      2. Why this is good for them (Health Benefit)
      3. Ingredients list
      4. Brief instructions
      5. Approximate calories
    `;

    try {
      const response = await ai.models.generateContent({
        model: RECIPE_MODEL,
        contents: prompt,
      });
      return response.text || "Could not generate recipe.";
    } catch (error) {
        console.error("Recipe Error:", error);
        return "Error generating recipe.";
    }
}
