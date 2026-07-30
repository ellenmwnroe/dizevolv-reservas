import DashboardClient from "../components/dashboard-client"
import { prisma } from "../lib/prisma"

// Garante que a página não fique em cache, buscando dados reais a cada recarregamento
export const dynamic = "force-dynamic"

export default async function Page() {
  // 1. Busca os dados REAIS do Supabase via Prisma incluindo as relações de Sala e Usuário
  const dbRooms = await prisma.room.findMany()
  const dbBookings = await prisma.booking.findMany({
    include: {
      room: true, // Traz os dados da sala (nome, capacidade, etc.)
      user: true, // Traz os dados do usuário (nome, email, cargo)
    },
    orderBy: {
      startTime: "asc",
    },
  })

  // 2. Repassa para a interface interativa
  return <DashboardClient initialRooms={dbRooms} initialBookings={dbBookings} />
}