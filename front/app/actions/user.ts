"use server"

import { prisma } from "@/lib/prisma"

export async function authenticateUser(data: { name: string; email: string; role: string }) {
  try {
    const user = await prisma.user.upsert({
      where: { 
        email: data.email 
      },
      update: { 
        name: data.name,
        role: data.role
      },
      create: {
        name: data.name,
        email: data.email,
        role: data.role
      }
    })

    return { success: true, user }
  } catch (error) {
    console.error("Erro ao autenticar usuário no banco:", error)
    return { success: false, error: "Falha ao registrar usuário." }
  }
}