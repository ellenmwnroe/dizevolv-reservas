"use client"

import { useState } from "react"
import { Plus, Trash2, X, DoorOpen, Users, MapPin, Edit2, Save, AlignLeft, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createRoom, deleteRoom, updateRoom } from "@/app/actions/rooms"

type RoomManagerProps = {
  isOpen: boolean
  onClose: () => void
  rooms: any[]
  onRoomChange: () => void
  notify: (msg: string, type?: "success" | "error") => void
}

export function RoomManagerModal({ isOpen, onClose, rooms, onRoomChange, notify }: RoomManagerProps) {
  // Estados para Criação
  const [name, setName] = useState("")
  const [capacity, setCapacity] = useState("10")
  const [location, setLocation] = useState("Sede Dizevolv")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Reunião")
  const [isLoading, setIsLoading] = useState(false)

  // Estados para Edição
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editCapacity, setEditCapacity] = useState("")
  const [editLocation, setEditLocation] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editCategory, setEditCategory] = useState("")

  if (!isOpen) return null

  // --- Ações de Criação ---
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const result = await createRoom({
      name,
      capacity: Number(capacity),
      location,
      description,
      tag: category, 
    })

    setIsLoading(false)

    if (!result.success) {
      notify(result.error || "Erro ao criar sala.", "error")
      return
    }

    notify("Sala criada com sucesso!", "success")
    setName("")
    setCapacity("10")
    setLocation("Sede Dizevolv")
    setDescription("")
    setCategory("Reunião")
    onRoomChange()
  }

  // --- Ações de Exclusão ---
  async function handleDelete(id: string) {
    const result = await deleteRoom(id)
    if (!result.success) {
      notify(result.error || "Erro ao excluir sala.", "error")
      return
    }
    notify("Sala removida com sucesso.", "success")
    onRoomChange()
  }

  // --- Ações de Edição ---
  function startEditing(room: any) {
    setEditingId(room.id)
    setEditName(room.name)
    setEditCapacity(String(room.capacity))
    setEditLocation(room.location || "")
    setEditDescription(room.description || "")
    setEditCategory(room.tag || "") // CORRIGIDO: lendo de room.tag
  }

  function cancelEditing() {
    setEditingId(null)
  }

  async function handleUpdate(id: string) {
    setIsLoading(true)
    const result = await updateRoom({
      id,
      name: editName,
      capacity: Number(editCapacity),
      location: editLocation,
      description: editDescription,
      tag: editCategory, // CORRIGIDO: enviando 'tag' para o banco em vez de 'category'
    })
    setIsLoading(false)

    if (!result.success) {
      notify(result.error || "Erro ao atualizar sala.", "error")
      return
    }

    notify("Sala atualizada com sucesso!", "success")
    setEditingId(null)
    onRoomChange()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-primary/25 bg-card p-6 shadow-2xl ring-glow">
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
            <input type="text" required placeholder="Ex: Sala Atlas" value={name} onChange={(e) => setName(e.target.value)} className="h-10 rounded-xl border border-input bg-background/70 px-3 text-xs outline-none focus:border-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium uppercase text-muted-foreground">Categoria</label>
            <input type="text" required placeholder="Ex: Foco Absoluto" value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 rounded-xl border border-input bg-background/70 px-3 text-xs outline-none focus:border-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium uppercase text-muted-foreground">Capacidade</label>
            <input type="number" required min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} className="h-10 rounded-xl border border-input bg-background/70 px-3 text-xs outline-none focus:border-primary" />
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-[11px] font-medium uppercase text-muted-foreground">Descrição</label>
            <input type="text" required placeholder="Ex: Cabine de foco e produtividade..." value={description} onChange={(e) => setDescription(e.target.value)} className="h-10 rounded-xl border border-input bg-background/70 px-3 text-xs outline-none focus:border-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium uppercase text-muted-foreground">Local</label>
            <div className="flex gap-2">
              <input type="text" required placeholder="Ex: Mezanino" value={location} onChange={(e) => setLocation(e.target.value)} className="h-10 w-full rounded-xl border border-input bg-background/70 px-3 text-xs outline-none focus:border-primary" />
            </div>
          </div>
          <div className="sm:col-span-3">
             <Button type="submit" disabled={isLoading} className="w-full h-10 gap-1">
              <Plus className="size-4" /> Adicionar Sala
            </Button>
          </div>
        </form>

        {/* Lista de Salas Existentes */}
        <div className="max-h-60 overflow-y-auto flex flex-col gap-2 pr-1">
          {rooms.map((room) => (
            <div key={room.id} className="p-3 rounded-xl border border-border bg-background/60">
              {editingId === room.id ? (
                // Modo de Edição
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 w-1/3 rounded-lg border border-input bg-background px-2 text-sm outline-none focus:border-primary" placeholder="Nome da sala" />
                    <input type="text" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="h-8 w-1/3 rounded-lg border border-input bg-background px-2 text-xs outline-none focus:border-primary" placeholder="Categoria" />
                    <input type="number" value={editCapacity} onChange={(e) => setEditCapacity(e.target.value)} className="h-8 w-1/3 rounded-lg border border-input bg-background px-2 text-xs outline-none focus:border-primary" placeholder="Capacidade" min={1} />
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="h-8 w-2/3 rounded-lg border border-input bg-background px-2 text-xs outline-none focus:border-primary" placeholder="Descrição da sala" />
                    <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="h-8 w-1/3 rounded-lg border border-input bg-background px-2 text-xs outline-none focus:border-primary" placeholder="Local" />
                  </div>
                  <div className="flex justify-end gap-2 mt-1">
                    <Button variant="ghost" size="sm" onClick={cancelEditing} className="h-8 px-2 text-muted-foreground">
                      <X className="size-4 mr-1" /> Cancelar
                    </Button>
                    <Button size="sm" onClick={() => handleUpdate(room.id)} disabled={isLoading} className="h-8 px-2">
                      <Save className="size-4 mr-1" /> Salvar
                    </Button>
                  </div>
                </div>
              ) : (
                // Modo de Visualização
                <div className="flex items-center justify-between">
                  <div className="w-full">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{room.name}</p>
                      
                      {/* LÓGICA DO FALLBACK DE CATEGORIA CORRIGIDA (lendo room.tag) */}
                      {room.tag ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {room.tag}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 border border-dashed border-border px-2 py-0.5 rounded-full">
                          SEM CATEGORIA
                        </span>
                      )}
                    </div>
                    
                    {/* LÓGICA DO FALLBACK DE DESCRIÇÃO */}
                    {room.description ? (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{room.description}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground/50 mt-1 italic">Sem descrição informada.</p>
                    )}

                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="size-3 text-primary" /> {room.capacity} pessoas</span>
                      <span className="flex items-center gap-1"><MapPin className="size-3 text-primary" /> {room.location || "Sede"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button variant="ghost" size="icon-sm" onClick={() => startEditing(room)} className="text-muted-foreground hover:text-primary hover:bg-primary/10" title="Editar Sala">
                      <Edit2 className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(room.id)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" title="Excluir Sala">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}