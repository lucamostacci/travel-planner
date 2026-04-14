import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return Response.json({ error: "Non autenticato" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { trips: { orderBy: { createdAt: 'desc' } } }
  })

  return Response.json({ trips: user?.trips || [] })
}

export async function POST(request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return Response.json({ error: "Non autenticato" }, { status: 401 })
  }

  const body = await request.json()
  const { title, startingPoint, cities, interests, places } = body

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { trips: true }
  })

  if (user.trips.length >= 3) {
    return Response.json({ error: "Limite di 3 itinerari raggiunto" }, { status: 403 })
  }

  const trip = await prisma.trip.create({
    data: {
      userId: user.id,
      title,
      startingPoint,
      cities,
      interests,
      places,
    }
  })

  return Response.json({ trip })
}

export async function DELETE(request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return Response.json({ error: "Non autenticato" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const tripId = searchParams.get("id")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  await prisma.trip.delete({
    where: { id: tripId, userId: user.id }
  })

  return Response.json({ success: true })
}