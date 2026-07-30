"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type RoomInput = {
  name: string
  capacity: number
  location?: string
}

export async function createRoom(data: RoomInput) {
  try {
    const { name, capacity, location } = data

    if (!name || !capacity) {
      return { success: false, error: "Nome e capacidade são obrigatórios." }
    }

    const newRoom = await prisma.room.create({
      data: {
        name,
        capacity: Number(capacity),
        location: location || "Dizevolv - Sede",
      },
    })

    revalidatePath("/")
    return { success: true, room: newRoom }
  } catch (error) {
    console.error("Erro ao criar sala:", error)
    return { success: false, error: "Erro ao cadastrar a sala." }
  }
}

export async function deleteRoom(id: string) {
  try {
    // Opcional: Verificar se há reservas ativas antes de excluir
    await prisma.room.delete({
      where: { id },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao deletar sala:", error)
    return { success: false, error: "Não é possível excluir uma sala que possui histórico de reservas." }
  }
}