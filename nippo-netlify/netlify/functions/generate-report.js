// AI週報・月報生成用のNetlify Function
// Netlifyの環境変数に ANTHROPIC_API_KEY を設定してください
// (Site configuration → Environment variables)

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY が未設定です" },
      { status: 500 }
    );
  }

  let prompt;
  try {
    const body = await req.json();
    prompt = body.prompt;
    if (!prompt || typeof prompt !== "string") throw new Error("no prompt");
  } catch (e) {
    return Response.json({ error: "リクエスト形式が不正です" }, { status: 400 });
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      return Response.json(
        { error: data?.error?.message || "API呼び出しに失敗しました" },
        { status: 502 }
      );
    }
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    return Response.json({ text });
  } catch (e) {
    return Response.json({ error: "サーバーエラー" }, { status: 500 });
  }
};
