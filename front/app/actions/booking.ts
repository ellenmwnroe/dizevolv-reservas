"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { hasTimeConflict } from "@/lib/conflict"

type CreateBookingInput = {
  roomId: string
  userId: string
  title: string
  date: string      // "YYYY-MM-DD"
  startTime: string // "HH:mm"
  endTime: string   // "HH:mm"
}

export async function createBooking(data: CreateBookingInput) {
  try {
    const { roomId, userId, title, date, startTime, endTime } = data

    const startDateTime = new Date(`${date}T${startTime}:00`)
    const endDateTime = new Date(`${date}T${endTime}:00`)

    if (endDateTime <= startDateTime) {
      return { success: false, error: "O horário de término deve ser posterior ao início." }
    }

    // Busca reservas existentes na mesma sala para o mesmo dia
    const existingBookings = await prisma.booking.findMany({
      where: { roomId },
    })

    // Valida conflito usando a regra de buffer de 10 minutos
    const hasConflict = existingBookings.some((b) =>
      hasTimeConflict(new Date(b.startTime), new Date(b.endTime), startDateTime, endDateTime, 10)
    )

    if (hasConflict) {
      return { 
        success: false, 
        error: "A sala precisa de um intervalo de pelo menos 10 minutos entre as reservas!" 
      }
    }

    const newBooking = await prisma.booking.create({
      data: {
        title: title || "Reunião de Equipe",
        userId,
        roomId,
        startTime: startDateTime,
        endTime: endDateTime,
      },
      include: {
        room: true,
        user: true,
      }
    })

    revalidatePath("/")
    return { success: true, booking: newBooking }
  } catch (error) {
    console.error("Erro ao criar reserva:", error)
    return { success: false, error: "Erro interno no servidor ao processar a reserva." }
  }
}

export async function deleteBooking(id: string) {
  try {
    await prisma.booking.delete({
      where: { id },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao deletar reserva:", error)
    return { success: false, error: "Não foi possível cancelar a reserva." }
  }
}

type UpdateBookingInput = {
  id: string
  roomId: string
  date: string      // "YYYY-MM-DD"
  startTime: string // "HH:mm"
  endTime: string   // "HH:mm"
  title?: string
}

export async function updateBooking(data: UpdateBookingInput) {
  try {
    const { id, roomId, date, startTime, endTime, title } = data

    const startDateTime = new Date(`${date}T${startTime}:00`)
    const endDateTime = new Date(`${date}T${endTime}:00`)

    if (endDateTime <= startDateTime) {
      return { success: false, error: "O horário de término deve ser posterior ao início." }
    }

    const existingBookings = await prisma.booking.findMany({
      where: {
        roomId,
        id: { not: id },
      },
    })

    const hasConflict = existingBookings.some((b) =>
      hasTimeConflict(new Date(b.startTime), new Date(b.endTime), startDateTime, endDateTime, 10)
    )

    if (hasConflict) {
      return { 
        success: false, 
        error: "A sala precisa de um intervalo de pelo menos 10 minutos entre as reservas!" 
      }
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        roomId,
        startTime: startDateTime,
        endTime: endDateTime,
        ...(title && { title }),
      },
      include: {
        room: true,
        user: true,
      },
    })

    revalidatePath("/")
    return { success: true, booking: updatedBooking }
  } catch (error) {
    console.error("Erro ao atualizar reserva:", error)
    return { success: false, error: "Erro ao atualizar a reserva no servidor." }
  }
}