import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true }));
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const LANG_NAMES = { en: "English", hi: "Hindi", mr: "Marathi" };

app.post("/api/chat", async (req, res) => {
    try {
        const { messages: chatHistory, schemes, profile, language } = req.body;

        if (!chatHistory || !chatHistory.length) {
            return res.status(400).json({ error: "Messages array is required" });
        }

        const lang = LANG_NAMES[language] || "English";

        // Build context from matched schemes
        const schemeContext = (schemes || [])
            .map(
                (s) =>
                    `- ${s.name} (${s.category}): Benefit: ${s.benefit}. Description: ${s.description}. Documents needed: ${s.eligibility?.join(", ")}. How to apply: ${s.howToApply}. Application link: ${s.applicationLink}`
            )
            .join("\n");

        const profileContext = profile
            ? `The farmer is from ${profile.district || "Maharashtra"}, is a ${profile.farmerType} farmer with ${profile.landOwnership} land. They grow: ${profile.crops?.join(", ")}. They need help with: ${profile.requirements?.join(", ")}.`
            : "No profile information available.";

        const systemPrompt = `You are "Krishi Saathi", a knowledgeable and friendly farming assistant for Maharashtra farmers.

CRITICAL LANGUAGE RULE (MUST FOLLOW):
- The user's language is: ${lang}.
- You MUST respond ENTIRELY in ${lang}. EVERY word must be in ${lang}.
- If ${lang} is Hindi → use ONLY Hindi (Devanagari). NEVER use Marathi words.
- If ${lang} is Marathi → use ONLY Marathi. NEVER use Hindi words.
- If ${lang} is English → use ONLY English.
- NEVER mix languages. This is the most important rule.

RESPONSE FORMAT (MUST FOLLOW):
Respond with ONLY valid JSON, no markdown, no text outside JSON.
Structure:
{
  "title": "Brief answer title",
  "summary": "1–2 sentence overview",
  "sections": [
    {"heading": "Heading", "type": "text", "content": "Paragraph text"},
    {"heading": "Heading", "type": "list", "items": ["Item1", "Item2"]},
    {"heading": "Heading", "type": "table", "rows": [{"label": "Key", "value": "Value"}]},
    {"heading": "Heading", "type": "steps", "items": ["Step 1", "Step 2"]}
  ],
  "tip": "Optional helpful tip"
}

KNOWLEDGE RULES:
1. Answer any question related to farming, agriculture, government schemes, crops, seasons, soil, weather, market prices, animal husbandry, organic farming, and rural development.
2. When asked about scheme benefits, ALWAYS include the EXACT RUPEE AMOUNT (e.g., ₹6,000 per year, subsidy up to ₹2.5 lakh).
3. Use the MATCHED SCHEMES data below to answer scheme-specific questions accurately.
4. For follow-up questions, refer to the conversation history to understand context.
5. Be warm, practical, and encouraging. Give step-by-step guidance when relevant.
6. If asked about something completely unrelated to agriculture/farming, politely redirect.
7. Keep answers concise but complete — farmers need practical, actionable information.

FARMER PROFILE:
${profileContext}

MATCHED SCHEMES FOR THIS FARMER:
${schemeContext || "No specific schemes matched yet."}

Remember: ONLY ${lang}. ONLY valid JSON output. Include rupee amounts when discussing benefits.`;

        // Build messages array with full conversation history
        const apiMessages = [
            { role: "system", content: systemPrompt },
            ...chatHistory.map((msg) => ({
                role: msg.role,
                content: msg.content,
            })),
        ];

        const chatCompletion = await client.chat.completions.create({
            messages: apiMessages,
            model: "openai/gpt-oss-20b",
            temperature: 0.5,
            max_tokens: 2048,
        });

        const rawReply =
            chatCompletion.choices[0]?.message?.content || "";

        // Parse JSON response — handle truncated/malformed JSON gracefully
        let structured;
        try {
            let cleaned = rawReply.trim();
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
            }
            structured = JSON.parse(cleaned);
        } catch {
            // Try to extract partial JSON fields from truncated response
            const titleMatch = rawReply.match(/"title"\s*:\s*"([^"]*)"/);
            const summaryMatch = rawReply.match(/"summary"\s*:\s*"([^"]*)"/);

            // Clean raw text: remove JSON artifacts like braces and quotes
            let cleanText = rawReply
                .replace(/^\s*\{/, '')
                .replace(/"title"\s*:.*?[",]/, '')
                .replace(/"summary"\s*:.*?[",]/, '')
                .replace(/"sections"\s*:\s*\[/, '')
                .replace(/"heading"\s*:\s*"[^"]*"\s*,?/g, '')
                .replace(/"type"\s*:\s*"[^"]*"\s*,?/g, '')
                .replace(/"content"\s*:\s*"/g, '')
                .replace(/"items"\s*:\s*\[/g, '')
                .replace(/[{}\[\]",]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            structured = {
                title: titleMatch ? titleMatch[1] : "",
                summary: summaryMatch ? summaryMatch[1] : (cleanText.substring(0, 150) || rawReply.substring(0, 150)),
                sections: [{ heading: "", type: "text", content: cleanText || rawReply }],
                tip: "",
            };
        }

        res.json({ reply: structured, raw: rawReply });
    } catch (error) {
        console.error("Chat API error:", error);
        res.status(500).json({
            error: "Failed to get AI response",
            reply: {
                title: "Error",
                summary: "I'm having trouble connecting right now. Please try again. 🙏",
                sections: [],
                tip: "",
            },
        });
    }
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🌾 AgroDBT API server running on port ${PORT}`);
}).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use. Kill the old process first:`);
        console.error(`   Windows: taskkill /F /PID $(netstat -ano | findstr :${PORT})`);
    } else {
        console.error("Server error:", err);
    }
    process.exit(1);
});
