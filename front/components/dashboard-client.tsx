"use client"

import { useMemo, useState, useEffect } from "react"
import { DoorOpen, Sparkles, TrendingUp, AlertCircle, CheckCircle2, X, Calendar as CalendarIcon, Grid } from "lucide-react"
import { cn } from "@/lib/utils"

import { BookingDialog, type BookingValues } from "@/components/booking-dialog"
import { DashboardHeader } from "@/components/dashboard-header"
import { ReservationsSidebar } from "@/components/reservations-sidebar"
import { RoomCard } from "@/components/room-card"
import { SoftLoginModal } from "@/components/soft-login-modal"
import { CalendarView } from "@/components/calendar-view"

import { createBooking, deleteBooking, updateBooking } from "@/app/actions/booking"
import { RoomManagerModal } from "./room-manager-modal"

interface DashboardClientProps {
  initialRooms: any[] 
  initialBookings: any[]
}

interface CurrentUser {
  id: string
  name: string
  email: string
  role?: string
}

export default function DashboardClient({ initialRooms, initialBookings }: DashboardClientProps) {
  const [reservations, setReservations] = useState<any[]>(initialBookings)
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  // Estado para controlar qual reserva está sendo editada (se houver)
  const [editingReservation, setEditingReservation] = useState<any | null>(null)
 
  // Estado para o Filtro de Salas
  const [roomFilter, setRoomFilter] = useState<string>("all")
  
  // Estados para o Soft Login
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [showLogin, setShowLogin] = useState<boolean>(false)

  // Estado para os Avisos do Sistema (Toasts)
  const [systemAlert, setSystemAlert] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const [roomManagerOpen, setRoomManagerOpen] = useState(false)

  // Estado para o Modo de Visualização (Grid vs Calendar)
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid")

  function notify(message: string, type: "success" | "error" = "success") {
    setSystemAlert({ message, type })
    setTimeout(() => {
      setSystemAlert(null)
    }, 4000)
  }

  useEffect(() => {
    const stored = localStorage.getItem("dizevolv_user")
    if (stored) {
      setCurrentUser(JSON.parse(stored))
    } else {
      setShowLogin(true)
    }
  }, [])

  function handleLoginSuccess(user: CurrentUser) {
    localStorage.setItem("dizevolv_user", JSON.stringify(user))
    setCurrentUser(user)
    setShowLogin(false)
    notify(`Bem-vindo(a) de volta, ${user.name}!`, "success")
  }

  // Filtragem e Ordenação das Reservas
  const filteredReservations = useMemo(() => {
    let list = [...reservations]
    
    if (roomFilter !== "all") {
      list = list.filter((r) => r.roomId === roomFilter || r.room?.id === roomFilter)
    }

    return list.sort((a, b) =>
      `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)
    )
  }, [reservations, roomFilter])

  const freeRooms = initialRooms.length 

  // Abrir modal para NOVA reserva
  function handleReserve(room: any) {
    setEditingReservation(null) // Garante que não estamos editando
    setSelectedRoom(room)
    setDialogOpen(true)
  }

  // Abrir modal para EDITAR reserva existente (clicando no lápis)
  function handleEdit(reservation: any) {
    const room = initialRooms.find((r) => r.id === reservation.roomId) || {
      id: reservation.roomId,
      name: reservation.roomName || reservation.room?.name || "Sala",
      capacity: 10,
      location: "Dizevolv"
    }
    
    setEditingReservation(reservation)
    setSelectedRoom(room)
    setDialogOpen(true)
  }

  // Função central de confirmação (Diferencia Criar vs Editar)
  async function handleConfirm(values: BookingValues) {
    if (!selectedRoom || !currentUser) return

    if (editingReservation) {
      // MODO EDIÇÃO
      const result = await updateBooking({
        id: editingReservation.id,
        roomId: selectedRoom.id,
        date: values.date,
        startTime: values.startTime,
        endTime: values.endTime,
        title: editingReservation.title,
      })

      if (!result.success) {
        notify(result.error || "Erro ao atualizar reserva.", "error")
        return
      }

      notify("Reserva atualizada com sucesso!", "success")
      
      setReservations((prev) =>
        prev.map((r) => (r.id === editingReservation.id ? result.booking : r))
      )
    } else {
      // MODO CRIAÇÃO
      const result = await createBooking({
        roomId: selectedRoom.id,
        userId: currentUser.id,
        title: `Reserva de ${currentUser.name}`,
        date: values.date,
        startTime: values.startTime,
        endTime: values.endTime,
      })

      if (!result.success) {
        notify(result.error || "Erro ao criar reserva.", "error")
        return 
      }

      notify("Reserva realizada com sucesso!", "success")

      const newReservation = result.booking || {
        id: `res-${Date.now()}`,
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        date: values.date,
        startTime: values.startTime,
        endTime: values.endTime,
        attendees: values.attendees,
        userName: currentUser.name, 
        status: "confirmado",
      }
      
      setReservations((prev) => [...prev, newReservation])
    }

    setDialogOpen(false)
    setSelectedRoom(null)
    setEditingReservation(null)
  }

  // Função Deletar
  async function handleDeleteBooking(id: string) {
    if (id.startsWith('res-')) {
       notify("Atualize a página para remover esta reserva temporária.", "error")
       return
    }

    const result = await deleteBooking(id)
    if (result && !result.success) {
      notify(result.error || "Erro ao cancelar reserva.", "error")
      return
    }

    setReservations((prev) => prev.filter((r) => r.id !== id))
    notify("Reserva cancelada com sucesso.", "success")
  }

  return (
    <div className="relative min-h-screen bg-background">
      <DashboardHeader userName={currentUser?.name ?? ""} onManageRooms={() => setRoomManagerOpen(true)} />

      {/* Toast / Alerta Flutuante */}
      {systemAlert && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-primary/30 bg-card/95 px-4 py-3 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          {systemAlert.type === "success" ? (
            <CheckCircle2 className="size-5 text-primary shrink-0" />
          ) : (
            <AlertCircle className="size-5 text-destructive shrink-0" />
          )}
          <p className="text-sm font-medium text-foreground">
            {systemAlert.message}
          </p>
          <button 
            onClick={() => setSystemAlert(null)}
            className="ml-2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <main className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ambient-glow"
          />
          <div className="relative py-14 text-center sm:py-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Reserva inteligente de salas
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
              Reserve a sala certa{" "}
              <span className="text-primary text-glow">em segundos.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              Uma central de comando para as salas da Dizevolv. Veja a
              disponibilidade em tempo real e agende sem burocracia.
            </p>

            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
              <StatWidget value={String(initialRooms.length)} label="Salas ativas" />
              <StatWidget value={String(freeRooms)} label="Livres agora" accent />
              <StatWidget value={String(reservations.length)} label="Reservas hoje" />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2" aria-labelledby="rooms-heading">
            {/* CABEÇALHO DA SEÇÃO COM ABAS DE ALTERNÂNCIA (GRID vs CALENDAR) */}
            <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <DoorOpen className="size-4 text-primary" aria-hidden="true" />
                <h2
                  id="rooms-heading"
                  className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground"
                >
                  {viewMode === "grid" ? "Salas Disponíveis" : "Visão de Calendário Geral"}
                </h2>
              </div>

              <div className="flex items-center gap-1 rounded-xl border border-border bg-card/60 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                    viewMode === "grid" 
                      ? "bg-primary text-primary-foreground font-semibold" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Grid className="size-3.5" />
                  Salas
                </button>
                <button
                  onClick={() => setViewMode("calendar")}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                    viewMode === "calendar" 
                      ? "bg-primary text-primary-foreground font-semibold" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <CalendarIcon className="size-3.5" />
                  Calendário
                </button>
              </div>
            </div>

            {/* RENDERIZAÇÃO CONDICIONAL DA VISUALIZAÇÃO */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {initialRooms.map((room) => (
                  <RoomCard key={room.id} room={room} onReserve={handleReserve} />
                ))}
              </div>
            ) : (
              <CalendarView reservations={filteredReservations} rooms={initialRooms} />
            )}
          </section>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
                <ReservationsSidebar 
                  reservations={filteredReservations} 
                  currentUserName={currentUser?.name ?? ""} 
                  onDeleteBooking={handleDeleteBooking}
                  onEditBooking={handleEdit}
                  rooms={initialRooms}
                  roomFilter={roomFilter}
                  onRoomFilterChange={setRoomFilter}
                />
            </div>
         </div>
        </div>
      </main>

      <BookingDialog
        room={selectedRoom}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          setSelectedRoom(null)
          setEditingReservation(null)
        }}
        onConfirm={handleConfirm}
        initialData={editingReservation}
      />

      <SoftLoginModal 
        isOpen={showLogin} 
        onSuccess={handleLoginSuccess} 
      />

      <RoomManagerModal
        isOpen={roomManagerOpen}
        onClose={() => setRoomManagerOpen(false)}
        rooms={initialRooms}
        onRoomChange={() => window.location.reload()}
        notify={notify}
      />
    </div>
  )
}

function StatWidget({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div
      className={
        accent
          ? "rounded-2xl border border-primary/30 bg-primary/10 p-4 ring-glow"
          : "rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-sm"
      }
    >
      <p
        className={
          accent
            ? "text-2xl font-bold tracking-tight text-primary sm:text-3xl"
            : "text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        }
      >
        {value}
      </p>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  )
}