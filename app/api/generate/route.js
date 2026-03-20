import Anthropic from "@anthropic-ai/sdk"

export async function POST(request) {
  const body = await request.json()
  const { startingPoint, startCoords, cities, interests } = body

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY})

  const prompt = `Sei un esperto di viaggi. Il viaggiatore si trova esattamente a queste coordinate GPS: latitudine ${startCoords?.lat}, longitudine ${startCoords?.lon} (indirizzo: ${startingPoint}).

Vuole visitare attrazioni in: ${cities.join(", ")}.
I suoi interessi sono: ${interests.join(", ")}.

Restituisci SOLO un array JSON valido, senza testo prima o dopo, senza backtick. Genera 8 attrazioni. Ogni oggetto ha:
- "name": nome dell'attrazione
- "city": città
- "description": 1-2 frasi in italiano
- "tags": array di 2 stringhe
- "opening_hours": orari tipici
- "avg_visit_time": tempo medio visita
- "lat": latitudine del posto (numero decimale)
- "lon": longitudine del posto (numero decimale)
- "visit_order": numero da 1 a 8, ordinato per distanza dalle coordinate ${startCoords?.lat},${startCoords?.lon} — il numero 1 deve essere il posto geograficamente più vicino a queste coordinate, il numero 8 il più lontano`

  const message = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }]
  })

  const text = message.content[0].text
  const clean = text.replace(/```json|```/g, "").trim()
  const places = JSON.parse(clean)

  return Response.json({ places })
}