import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  // @ts-ignore - process is polyfilled in index.html for static deployment
  const apiKey = process.env.API_KEY || (window.process && window.process.env && window.process.env.API_KEY);
  
  if (!apiKey) {
    console.error("API Key is missing. Please add it to index.html or environment variables.");
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeSecretImage = async (base64Image: string): Promise<{ title: string; description: string }> => {
  try {
    const ai = getClient();
    
    // Remove data:image/...;base64, prefix if present
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: "你是一个住在魔法相机里的神秘精灵。这张图片刚刚出现，取代了用户实际拍摄的内容。1. 给它一个简短、神秘的标题（3-5个字）。2. 写一句简短、有趣或神秘的解释，说明为什么会出现这张图片（例如，“这是你的真实气场”，“矩阵的故障揭示了这一点”）。请用中文回答。返回 JSON。"
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["title", "description"]
        }
      }
    });

    const text = response.text;
    if (!text) return { title: "神秘影像", description: "虚空正在回望你。" };
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini analysis failed:", error);
    
    if (error.message === "API_KEY_MISSING") {
       return {
        title: "配置错误",
        description: "请在代码 index.html 中填入 API Key 才能使用魔法功能。"
      };
    }

    return {
      title: "检测到故障",
      description: "相机传感器被这张图片的能量淹没了。"
    };
  }
};