const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export default async function handler(req, res) {
  const { message } = req.query;
  if (!message) return res.status(400).json({ content: "No message provided" });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`, // Uses API_KEY
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "system",
            content: "You are CodeX, an AI coding assistant specialized in coding. Provide clear, detailed answers.",
          },
          { role: "user", content: message },
        ],
      }),
    });
    const data = await response.json();
    res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ content: "Sorry, I encountered an error." });
  }
}
