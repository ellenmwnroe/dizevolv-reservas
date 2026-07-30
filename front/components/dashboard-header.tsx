"use client"

import { DoorOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

type DashboardHeaderProps = {
  userName?: string
  onManageRooms?: () => void
}

export function DashboardHeader({ userName = "Visitante", onManageRooms }: DashboardHeaderProps) {
  // Função para pegar as iniciais do nome (ex: "Ellen Monroe" -> "EM")
  const getInitials = (name: string) => {
    const nameParts = name.trim().split(" ").filter(Boolean)
    if (nameParts.length === 0) return "US"
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase()
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
  }

  const initials = getInitials(userName)

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="relative flex size-9 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 ring-glow">
            <span className="text-sm font-black tracking-tighter text-primary">D</span>
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-tight text-foreground">
              Dizevolv <span className="text-primary">Reservas</span>
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Central de Salas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground sm:inline-flex">
            <span className="size-1.5 rounded-full bg-primary dot-glow" aria-hidden="true" />
            Sistema online
          </span>

          {/* Botão de Gerenciar Salas */}
          {onManageRooms && (
            <Button
              variant="outline"
              size="sm"
              onClick={onManageRooms}
              className="gap-2 border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-all"
            >
              <DoorOpen className="size-4" />
              <span className="hidden sm:inline">Gerenciar Salas</span>
            </Button>
          )}

          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-foreground">{userName}</p>
            {/* Cargo / Setor */}
            <p className="text-xs text-muted-foreground">Sistemas · Dizevolv</p>
          </div>
          <div
            className="flex size-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground ring-1 ring-border"
            aria-label={`Avatar de ${userName}`}
          >
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}