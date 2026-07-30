"use client"

import { ArrowUpRight, MapPin, Users } from "lucide-react"
import { cn } from "@/lib/utils"

// Nova tipagem: Espelha o que vem do Prisma, mas deixa o status opcional
// para não quebrar a interface até implementarmos a lógica de disponibilidade real.
export type DbRoom = {
  id: string
  name: string
  capacity: number
  description: string
  location: string
  tag: string
  status?: "livre" | "ocupada" | "em-breve"
  freeIn?: string
}

type RoomCardProps = {
  room: DbRoom
  onReserve: (room: DbRoom) => void
}

const statusMap: Record<
  "livre" | "ocupada" | "em-breve",
  { label: string; dot: string; text: string }
> = {
  livre: { label: "Livre agora", dot: "bg-primary dot-glow", text: "text-primary" },
  ocupada: { label: "Ocupada", dot: "bg-muted-foreground", text: "text-muted-foreground" },
  "em-breve": { label: "Livre em breve", dot: "bg-amber-400", text: "text-amber-400" },
}

export function RoomCard({ room, onReserve }: RoomCardProps) {
  // O pulo do gato: Se o room.status vier vazio do banco, ele assume "livre"
  const currentStatus = room.status || "livre"
  const status = statusMap[currentStatus]

  return (
    <button
      type="button"
      onClick={() => onReserve(room)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 text-left",
        "transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:ring-glow",
      )}
    >
      {/* ambient corner glow on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/15 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="inline-flex w-fit items-center rounded-md border border-border/70 bg-secondary/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {room.tag}
          </span>
          <h3 className="text-lg font-semibold tracking-tight text-card-foreground">
            Sala {room.name}
          </h3>
        </div>
        <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", status.text)}>
          <span className={cn("size-1.5 rounded-full", status.dot)} aria-hidden="true" />
          {status.label}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {room.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Users className="size-3.5 text-primary/80" aria-hidden="true" />
          Até {room.capacity} pessoas
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5" aria-hidden="true" />
          {room.location}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
        <span className="text-xs text-muted-foreground">
          {currentStatus === "em-breve" && room.freeIn
            ? `Disponível em ${room.freeIn}`
            : "Toque para reservar"}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-transform duration-300 group-hover:translate-x-0.5">
          Reservar
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </button>
  )
}