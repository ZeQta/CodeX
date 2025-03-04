const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export default async function handler(req, res) {
  const { message } = req.query;
  if (!message) {
    return res.status(400).json({ content: "No message provided" });
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.API_KEY}`, // API_KEY from Vercel env
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free", // Confirm this is your intended model
        messages: [
          {
            role: "system",
            content: "You are CodeX, an AI coding assistant specialized in coding. Provide clear, detailed answers.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get raw response for more info
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    console.error("Error Details:", error.message); // Logs to Vercel
    res.status(500).json({
      content: `Error: Couldn’t connect to the AI service. Details: ${error.message}`,
    });
  }
}