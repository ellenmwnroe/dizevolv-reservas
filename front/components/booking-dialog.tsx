"use client"

import { useEffect, useState, useMemo } from "react"
import { CalendarDays, Clock, Sparkles, Users, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Room } from "@/lib/reservation-data"

export type BookingValues = {
  date: string
  startTime: string
  endTime: string
  attendees: number
}

type BookingDialogProps = {
  room: Room | null
  open: boolean
  onClose: () => void
  onConfirm: (values: BookingValues) => void
  initialData?: any | null 
}

const fieldClass =
  "h-11 w-full rounded-xl border border-input bg-background/70 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30 [color-scheme:dark]"

export function BookingDialog({ room, open, onClose, onConfirm, initialData }: BookingDialogProps) {
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [attendees, setAttendees] = useState("2")
  const [error, setError] = useState<string | null>(null)

  const todayString = useMemo(() => new Date().toISOString().slice(0, 10), [])

  useEffect(() => {
    if (open) {
      if (initialData) {
        const startObj = new Date(initialData.startTime)
        const endObj = new Date(initialData.endTime)
        
        setDate(startObj.toISOString().slice(0, 10))
        setStartTime(startObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Fortaleza" }))
        setEndTime(endObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Fortaleza" }))
        setAttendees(String(initialData.attendees || 2))
      } else {
        setDate(todayString)
        setStartTime("09:00")
        setEndTime("10:00")
        setAttendees("2")
      }
      setError(null)
    }
  }, [open, initialData, todayString])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    if (open) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open || !room) return null

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!room) return
    
    if (!date) {
      setError("Selecione a data da reserva.")
      return
    }

    const selectedDateObj = new Date(`${date}T12:00:00`)
    const dayOfWeek = selectedDateObj.getDay()
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      setError("As salas estão disponíveis apenas de segunda a sexta-feira.")
      return
    }

    if (startTime < "09:00" || startTime >= "18:00") {
      setError("O horário de início deve estar entre 09:00 e 17:59.")
      return
    }

    if (endTime <= "09:00" || endTime > "18:00") {
      setError("O horário de término não pode ultrapassar as 18:00.")
      return
    }

    if (endTime <= startTime) {
      setError("O horário de término deve ser posterior ao de início.")
      return
    }

    const count = Number(attendees)
    if (!Number.isInteger(count) || count < 1) {
      setError("Informe uma quantidade válida de participantes.")
      return
    }
    
    if (count > room.capacity) {
      setError(`A capacidade máxima da Sala ${room.name} é ${room.capacity} pessoas.`)
      return
    }

    onConfirm({ date, startTime, endTime, attendees: count })
  }

  const isEditing = !!initialData

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Fechar"
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-primary/25 bg-card p-6 shadow-2xl ring-glow"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-primary/20 blur-3xl"
        />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              <Sparkles className="size-3" aria-hidden="true" />
              {isEditing ? "Editar Reserva" : "Nova Reserva"}
            </span>
            <h2
              id="booking-title"
              className="mt-3 text-xl font-semibold tracking-tight text-card-foreground"
            >
              {room.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Até {room.capacity} pessoas · {room.location}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Fechar formulário"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        <form className="relative mt-6 flex flex-col gap-4" onSubmit={handleSubmit} lang="pt-BR">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="date"
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Data
            </label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary/80" />
              <input
                id="date"
                type="date"
                lang="pt-BR"
                min={todayString}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className={`${fieldClass} pl-9`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="start"
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Início
              </label>
              <div className="relative">
                <Clock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary/80" />
                <input
                  id="start"
                  type="time"
                  lang="pt-BR"
                  min="09:00"
                  max="17:59"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  className={`${fieldClass} pl-9`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="end"
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Término
              </label>
              <div className="relative">
                <Clock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary/80" />
                <input
                  id="end"
                  type="time"
                  lang="pt-BR"
                  min="09:01"
                  max="18:00"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  className={`${fieldClass} pl-9`}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="attendees"
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Participantes
            </label>
            <div className="relative">
              <Users className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary/80" />
              <input
                id="attendees"
                type="number"
                min={1}
                max={room.capacity}
                value={attendees}
                onChange={(event) => setAttendees(event.target.value)}
                className={`${fieldClass} pl-9`}
              />
            </div>
          </div>

          {error && (
            <p
              className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="mt-2 flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" size="lg" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="lg" className="ring-glow">
              {isEditing ? "Salvar Alterações" : "Confirmar Reserva"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}