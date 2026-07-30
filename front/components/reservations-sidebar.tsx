"use client"

import { Activity, Clock, Trash2, Filter, ChevronDown, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

const statusConfig = {
  confirmado: {
    label: "Agendado",
    className: "border-primary/40 bg-primary/10 text-primary",
    node: "border-primary bg-primary dot-glow",
  },
  "em-andamento": {
    label: "Ao vivo",
    className: "border-amber-400/40 bg-amber-400/10 text-amber-400",
    node: "border-amber-400 bg-amber-400",
  },
  concluido: {
    label: "Concluído",
    className: "border-border bg-secondary/50 text-muted-foreground",
    node: "border-muted-foreground bg-muted-foreground/60",
  },
} as const

function getDynamicStatus(startTime: Date, endTime: Date): keyof typeof statusConfig {
  const now = new Date()
  if (now > endTime) return "concluido"
  if (now >= startTime && now <= endTime) return "em-andamento"
  return "confirmado"
}

function formatReservationTime(date: Date) {
  if (isNaN(date.getTime())) return "00:00"
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Fortaleza" 
  }).format(date)
}

function formatReservationDate(date: Date) {
  if (isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short"
  }).format(date)
}

function parseSafeDate(timeData: any, fallbackDate: any) {
  const parsed = new Date(timeData)
  if (!isNaN(parsed.getTime())) return parsed

  if (typeof timeData === "string" && timeData.includes(":")) {
    const [hours, minutes] = timeData.split(":").map(Number)
    const base = fallbackDate ? new Date(fallbackDate) : new Date()
    base.setHours(hours, minutes, 0, 0)
    return base
  }

  return new Date()
}

type ReservationsSidebarProps = {
  reservations: any[] 
  currentUserName: string 
  onDeleteBooking: (id: string) => void
  onEditBooking?: (reservation: any) => void // NOVO: Função para disparar a edição
  rooms: any[]
  roomFilter: string
  onRoomFilterChange: (id: string) => void
}

export function ReservationsSidebar({ 
  reservations, 
  currentUserName, 
  onDeleteBooking,
  onEditBooking,
  rooms,
  roomFilter,
  onRoomFilterChange
}: ReservationsSidebarProps) {
  return (
    <aside className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Activity className="size-4 text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-card-foreground">
          Linha do Tempo
        </h2>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {reservations.length}
        </span>
      </div>

      {/* SELETOR / FILTRO POR SALA CUSTOMIZADO */}
      <div className="relative">
        <div className="flex items-center gap-1.5 mb-1.5 text-xs font-medium text-muted-foreground">
          <Filter className="size-3 text-primary" />
          Filtrar por Sala
        </div>
        <div className="relative">
          <select
            value={roomFilter}
            onChange={(e) => onRoomFilterChange(e.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-input bg-background/70 px-3 pr-10 text-xs text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30 [color-scheme:dark] cursor-pointer"
          >
            <option value="all">Todas as salas</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
          {/* Seta customizada flutuante */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary/80">
            <ChevronDown className="size-4" />
          </div>
        </div>
      </div>

      {reservations.length === 0 ? (
        <p className="mt-2 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nenhuma reserva encontrada para este filtro.
        </p>
      ) : (
        <ol className="relative mt-2 flex flex-col gap-4 pl-6">
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-primary/50 via-border to-transparent"
          />

          {reservations.map((reservation) => {
            const startDate = parseSafeDate(reservation.startTime, reservation.date)
            const endDate = parseSafeDate(reservation.endTime, reservation.date)
            
            const currentStatus = getDynamicStatus(startDate, endDate)
            const status = statusConfig[currentStatus]

            const ownerName = reservation.userName || reservation?.user?.name

            return (
              <li key={reservation.id} className="relative group">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -left-6 top-1.5 size-3.5 rounded-full border-2 transition-colors",
                    status.node,
                  )}
                />
                <div className="rounded-xl border border-border bg-background/60 p-3.5 transition-colors hover:border-primary/30 relative overflow-hidden">
                  
                  {ownerName === currentUserName && currentStatus === "confirmado" && (
                    <div className="absolute right-2 top-2 flex items-center gap-1">
                      {/* Botão de Editar */}
                      {onEditBooking && (
                        <button 
                          onClick={() => onEditBooking(reservation)}
                          title="Editar Reserva"
                          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                        >
                          <Pencil className="size-4" />
                        </button>
                      )}
                      {/* Botão de Excluir */}
                      <button 
                        onClick={() => onDeleteBooking(reservation.id)}
                        title="Cancelar Reserva"
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-2 pr-14">
                    <p className="text-sm font-semibold text-foreground">
                      Sala {reservation.roomName || reservation.room?.name || "Desconhecida"} 
                    </p>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        status.className,
                      )}
                    >
                      {status.label}
                    </span>
                  </div>

                  <p className="text-xs text-foreground/80 mb-2 truncate">
                    {reservation.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 font-medium text-foreground/90">
                      <Clock className="size-3.5 text-primary/80" aria-hidden="true" />
                      {formatReservationTime(startDate)}–{formatReservationTime(endDate)}
                    </span>
                    <span className="capitalize">{formatReservationDate(startDate)}</span>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </aside>
  )
}