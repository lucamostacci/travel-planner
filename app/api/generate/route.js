import Anthropic from "@anthropic-ai/sdk"

export async function POST(request) {
  const body = await request.json()
  const { startingPoint, startCoords, cities, interests, radius } = body

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY})

const prompt = `Sei un esperto di viaggi. Il viaggiatore si trova esattamente a queste coordinate GPS: latitudine ${startCoords?.lat}, longitudine ${startCoords?.lon} (indirizzo: ${startingPoint}).

Vuole visitare attrazioni in: ${cities.join(", ")}.
I suoi interessi sono: ${interests.join(", ")}.

REGOLE IMPORTANTI:
- Genera SOLO attrazioni entro ${radius}km dal punto di partenza (${startCoords?.lat}, ${startCoords?.lon})
- Calcola la distanza euclidea da queste coordinate prima di includere un posto
- Se un posto è fuori da questo raggio, NON includerl
- NON includere posti nei dintorni, nelle province o fuori città
- Se l'utente ha specificato una sola città, tutti gli 8 posti devono essere in quella città
- Tutte le attrazioni devono essere raggiungibili a piedi o con mezzi pubblici urbani
- Le coordinate lat/lon devono essere precise e dentro la città specificata

Restituisci SOLO un array JSON valido, senza testo prima o dopo, senza backtick. Genera 8 attrazioni. Ogni oggetto ha:
- "name": nome dell'attrazione
- "city": città esatta
- "description": 1-2 frasi in italiano
- "tags": array di 2 stringhe in italiano
- "opening_hours": orari tipici
- "avg_visit_time": tempo medio visita
- "lat": latitudine precisa del posto dentro la città
- "lon": longitudine precisa del posto dentro la citt
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