const cron = require("node-cron");
const axios = require("axios");
const News = require("../models/news");

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
const newsCategories = [
  "technology",
  "business",
  "general",
  "science",
  "sports",
  "entertainment",
];

async function fetchArticles(category) {
  try {
    const res = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${NEWS_API_KEY}`
    );
    return res.data.articles || [];
  } catch (err) {
    console.error(`Error fetching ${category} news:`, err.message);
    return [];
  }
}

function buildGeminiPrompt(articles) {
  const input = articles
    .slice(0, 3)
    .map(
      (a, i) =>
        `Article ${i + 1}:\nTitle: ${a.title}\nDescription: ${
          a.description || "N/A"
        }\nURL: ${a.url}`
    )
    .join("\n\n");

  return `You are a creative, energetic news summarizer tasked with generating lively, engaging summaries of news articles for WhatsApp. Your goal is to make the summaries punchy, informative, and inviting, encouraging the reader to learn more. Please follow these guidelines:

1. *Formatting:*
   - Use WhatsApp-compatible markdown. For bold text, use single asterisks (*), not double asterisks (**). For example, *bold text*.
   - Each summary should be a bullet point starting with an asterisk (*).

2. *Content:*
   - Begin with a warm greeting like: *Greetings, Alertly readers! 💜 Here’s your news fix:*
   - Summarize each article with vivid language in 2-3 sentences max.
   - After each summary, include: Read more: [URL]

3. *Attribution:*
   - End with: *Brought to you by Adetona Adegbite – the brain behind Alertly 💜 | IG: Tona_Tech*

Here are the articles to summarize:\n\n${input}`;
}

async function getGeminiResponse(prompt) {
  try {
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };
    const res = await axios.post(GEMINI_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
    return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.error("Gemini error:", err.message);
    return null;
  }
}

// Update news categories
async function updateCategoryContent() {
  for (const category of newsCategories) {
    const articles = await fetchArticles(category);
    if (articles.length) {
      const prompt = buildGeminiPrompt(articles);
      const summary = await getGeminiResponse(prompt);

      if (summary) {
        try {
          await News.upsert({
            category,
            content: summary,
            updated_at: new Date(),
          });
          console.log(`Updated ${category} at ${new Date()}`);
        } catch (err) {
          console.error(`DB Error updating ${category}:`, err.message);
        }
      }
    }
  }

  // Fun facts section
  const funPrompt = `You're a quirky, fun, and curious fact collector! 
Your mission is to surprise users with *3 truly interesting and uncommon fun facts* they probably haven't heard before. Follow these instructions:

1. **Formatting:**
   - Use WhatsApp-compatible markdown. For bold text, use single asterisks (*), not double asterisks (**). For example, *bold text*.
   - Each fun fact should be a bullet point starting with an asterisk (*).
   - Ensure clear spacing between sections for readability.

2. **Content:**
   - Begin with a cheerful greeting, like: "Hey there! 💜 Time for your daily dose of fun facts!"
   - Each fact should be weird, surprising, or just super interesting.
   - Use an energetic, friendly tone. Make it feel like a quick, delightful read.
   - Prioritize facts that are mind-blowing/controversial, weird, or unexpected.
   - Avoid overly common or boring trivia.
   - Include facts from science, history, pop culture, animals, or space.

3. **Attribution:**
   - At the end, include this sign-off: "Brought to you by Adetona Adegbite – the brain behind Alertly 💜 | IG: Tona_Tech"

**Example Format:**

* *Did you know?* A shrimp's heart is in its head.
* *Fun fact:* Bananas are technically berries, but strawberries aren’t.
* *Weird but true:* Octopuses have three hearts and blue blood.

Make sure to use the exact markdown style and tone above.`;

  const funFacts = await getGeminiResponse(funPrompt);
  if (funFacts) {
    try {
      await News.upsert({
        category: "fun facts",
        content: funFacts,
        updated_at: new Date(),
      });
      console.log("Updated funfacts");
    } catch (err) {
      console.error("DB Error updating funfacts:", err.message);
    }
  }
}

// updateCategoryContent();

function scheduleContentUpdate() {
  cron.schedule("0 */5 * * *", async () => {
    console.log("Running Alertly auto-update...");
    const apiKey = process.env.WHATSAPP_API_KEY;

    try {
      await axios.post(
        "https://waapi.app/api/v1/instances/51717/client/action/send-message",
        {
          chatId: `2349017010040@c.us`,
          message: "Database Updated Sir.",
        },
        {
          headers: {
            accept: "application/json",
            authorization: `Bearer ${apiKey}`,
            "content-type": "application/json",
          },
        }
      );
    } catch (e) {
      console.log(e);
    }

    await updateCategoryContent();
  });
}
module.exports = { scheduleContentUpdate };
