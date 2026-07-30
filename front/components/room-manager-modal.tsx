"use client"

import { useState } from "react"
import { Plus, Trash2, X, DoorOpen, Users, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createRoom, deleteRoom } from "@/app/actions/rooms"

type RoomManagerProps = {
  isOpen: boolean
  onClose: () => void
  rooms: any[]
  onRoomChange: () => void
  notify: (msg: string, type?: "success" | "error") => void
}

export function RoomManagerModal({ isOpen, onClose, rooms, onRoomChange, notify }: RoomManagerProps) {
  const [name, setName] = useState("")
  const [capacity, setCapacity] = useState("10")
  const [location, setLocation] = useState("Dizevolv")
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const result = await createRoom({
      name,
      capacity: Number(capacity),
      location,
    })

    setIsLoading(false)

    if (!result.success) {
      notify(result.error || "Erro ao criar sala.", "error")
      return
    }

    notify("Sala criada com sucesso!", "success")
    setName("")
    setCapacity("10")
    onRoomChange()
  }

  async function handleDelete(id: string) {
    const result = await deleteRoom(id)
    if (!result.success) {
      notify(result.error || "Erro ao excluir sala.", "error")
      return
    }
    notify("Sala removida com sucesso.", "success")
    onRoomChange()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-primary/25 bg-card p-6 shadow-2xl ring-glow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DoorOpen className="size-5 text-primary" />
            <h2 className="text-xl font-semibold text-card-foreground">Gerenciar Salas</h2>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        {/* Formulário para Nova Sala */}
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-2xl border border-border bg-background/50">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium uppercase text-muted-foreground">Nome da Sala</label>
            <input
              type="text"
              required
              placeholder="Ex: Sala Atlas"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-xl border border-input bg-background/70 px-3 text-xs outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium uppercase text-muted-foreground">Capacidade</label>
            <input
              type="number"
              required
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="h-10 rounded-xl border border-input bg-background/70 px-3 text-xs outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={isLoading} className="w-full h-10 gap-1">
              <Plus className="size-4" /> Adicionar
            </Button>
          </div>
        </form>

        {/* Lista de Salas Existentes */}
        <div className="max-h-60 overflow-y-auto flex flex-col gap-2 pr-1">
          {rooms.map((room) => (
            <div key={room.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background/60">
              <div>
                <p className="text-sm font-semibold text-foreground">{room.name}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="size-3 text-primary" /> {room.capacity} pessoas</span>
                  <span className="flex items-center gap-1"><MapPin className="size-3 text-primary" /> {room.location || "Sede"}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleDelete(room.id)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}