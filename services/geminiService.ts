import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize safely. If no key is present, we handle it in the UI.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateJournalEntry = async (): Promise<string> => {
  if (!ai) {
    throw new Error("API Key is missing.");
  }

  const model = "gemini-3-flash-preview";
  const prompt = `
    你是 Minecraft 的史蒂夫。你正带着你驯服的狼在“现实世界”的森林里奔跑。
    场面混乱、快速且模糊。
    用中文写一段简短、有趣且上气不接下气的日志（最多100字）来描述这个瞬间。
    提到逼真的画质（光影太强了？）、速度以及狼在做什么。
    隐喻地使用 Minecraft 的术语（方块、区块、饥饿条、怪物）。
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text || "无法写入日志...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "服务器卡顿... 无法写入日志。";
  }
};