export const runtime = 'edge'

export async function POST(req: Request) {
  const { message } = await req.json()

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.SITE_URL || '', // Opcional para ranking
      'X-Title': process.env.SITE_NAME || '', // Opcional para ranking
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    }),
  })

  const data = await res.json()
  const reply = data?.choices?.[0]?.message?.content || 'Sin respuesta de la IA'

  return Response.json({ response: reply })
}
