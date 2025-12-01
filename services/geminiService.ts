import { GoogleGenAI } from "@google/genai";
import { GeminiModel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSupportSlogan = async (candidateName: string, currentVotes: number): Promise<string> => {
  try {
    // Randomly select a style to ensure diversity
    const styles = [
      "霸气王者风 (强调登顶、无敌、断层领先)",
      "深情文艺风 (强调陪伴、星光、梦想)",
      "可爱彩虹屁 (夸赞颜值、才华、全能)",
      "幽默玩梗风 (押韵、顺口溜、网络热梗)"
    ];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];

    const prompt = `
      角色设定：你是一位资深的饭圈“粉头”（粉丝后援会会长），极其擅长写各种风格的控评文案。
      任务：请为候选人 "${candidateName}" 写一句中国饭圈风格的打榜应援语。
      当前背景：他/她目前拥有 ${currentVotes} 票。

      要求：
      1. 风格限定：${randomStyle}。
      2. 词汇参考：可以使用如“走花路”、“未来可期”、“神颜”、“入股不亏”、“YYDS”、“绝绝子”、“断层出道”等饭圈常用语。
      3. 长度：20字以内，短小精悍，极具煽动性和感染力。
      4. 格式：不要加引号，不要带解释，直接输出那句口号。
    `;

    const response = await ai.models.generateContent({
      model: GeminiModel.FLASH,
      contents: prompt,
      config: {
        temperature: 1.1, // Higher temperature for more creative/diverse outputs
        maxOutputTokens: 60,
      }
    });

    return response.text?.trim() || `${candidateName} 冲鸭！入股不亏，未来可期！`;
  } catch (error) {
    console.error("Error generating slogan:", error);
    // Fallback messages with more flavor
    const fallbacks = [
      `${candidateName} 勇敢飞，我们永相随！`,
      `始于颜值，陷于才华，忠于 ${candidateName}！`,
      `全世界最好的 ${candidateName}，送你出道！`
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};

export const generateBattleCommentary = async (leaderName: string, runnerUpName: string, gap: number): Promise<string> => {
  try {
    const prompt = `
      请用中文写一句“体育解说”或“电竞解说”风格的短评，描述第一名 ${leaderName} 和第二名 ${runnerUpName} 之间的激烈竞争。
      目前的票数差距是 ${gap} 票。让评论充满戏剧性和紧迫感。不要超过50个字。
    `;

     const response = await ai.models.generateContent({
      model: GeminiModel.FLASH,
      contents: prompt,
    });

    return response.text || "比赛进入白热化阶段，大家快来投票！";
  } catch (error) {
    return "战况十分焦灼，差距正在缩小，快来支持你的偶像！";
  }
}