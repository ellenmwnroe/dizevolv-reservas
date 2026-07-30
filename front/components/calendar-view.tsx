"use client"

import { useMemo } from "react"
import { Calendar, Clock, Users, DoorOpen } from "lucide-react"
import { cn } from "@/lib/utils"

type CalendarViewProps = {
  reservations: any[]
  rooms: any[]
}

export function CalendarView({ reservations, rooms }: CalendarViewProps) {
  // Agrupa as reservas por data para exibir em formato de calendário/agenda
  const groupedByDate = useMemo(() => {
    const map: Record<string, any[]> = {}
    
    reservations.forEach((res) => {
      const dateKey = res.date || new Date(res.startTime).toISOString().slice(0, 10)
      if (!map[dateKey]) {
        map[dateKey] = []
      }
      map[dateKey].push(res)
    })

    // Ordena as datas
    return Object.keys(map)
      .sort()
      .map((date) => ({
        date,
        items: map[date].sort((a, b) => `${a.startTime}`.localeCompare(`${b.startTime}`)),
      }))
  }, [reservations])

  function formatDateHeader(dateStr: string) {
    try {
      const [year, month, day] = dateStr.split("-")
      const dateObj = new Date(Number(year), Number(month) - 1, Number(day))
      return new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      }).format(dateObj)
    } catch {
      return dateStr
    }
  }

  function formatTime(timeData: any) {
    if (!timeData) return "00:00"
    if (typeof timeData === "string" && timeData.includes("T")) {
      return new Date(timeData).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Fortaleza" })
    }
    return String(timeData).slice(0, 5)
  }

  if (groupedByDate.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground bg-card/40 backdrop-blur-sm">
        <Calendar className="mx-auto size-10 text-primary/50 mb-3" />
        <p className="text-base font-medium">Nenhum agendamento encontrado no calendário.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {groupedByDate.map(({ date, items }) => (
        <div key={date} className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-border/60">
            <Calendar className="size-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground capitalize">
              {formatDateHeader(date)}
            </h3>
            <span className="ml-auto rounded-full border border-border/70 bg-secondary/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {items.length} {items.length === 1 ? "reserva" : "reservas"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((res) => {
              const roomName = res.roomName || res.room?.name || "Sala"
              const userName = res.userName || res.user?.name || "Convidado"
              
              return (
                <div 
                  key={res.id} 
                  className="rounded-xl border border-border/80 bg-background/70 p-4 transition-all hover:border-primary/40 flex flex-col justify-between gap-3 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/70" />
                  
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                        <DoorOpen className="size-3.5" />
                        Sala {roomName}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">
                        <Clock className="size-3 text-primary/80" />
                        {formatTime(res.startTime)} – {formatTime(res.endTime)}
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium text-foreground mt-2 truncate">
                      {res.title || `Reserva de ${userName}`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="size-3 text-primary/70" />
                      {userName}
                    </span>
                    <span className="uppercase text-[10px] font-semibold tracking-wider text-primary/90 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                      Confirmado
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}