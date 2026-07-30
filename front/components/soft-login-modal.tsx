"use client"

import { useState } from "react"
import { User, ArrowRight, Loader2, Briefcase, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authenticateUser } from "@/app/actions/user"

interface SoftLoginModalProps {
  isOpen: boolean
  onSuccess: (user: { id: string; name: string; email: string; role: string }) => void
}

export function SoftLoginModal({ isOpen, onSuccess }: SoftLoginModalProps) {
  const [tempName, setTempName] = useState("")
  const [tempEmail, setTempEmail] = useState("")
  const [tempRole, setTempRole] = useState("") // NOVO: Campo de Cargo
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoginError(null)
    setIsLoading(true)

    const name = tempName.trim() || "Visitante"
    const email = tempEmail.trim()
    const role = tempRole.trim() || "Colaborador"

    if (!email) {
      setLoginError("Informe um e-mail para continuar.")
      setIsLoading(false)
      return
    }

    try {
      const result = await authenticateUser({ name, email, role })

      if (!result.success || !result.user) {
        setLoginError(result.error ?? "Erro ao identificar. Tente novamente.")
        return
      }

      onSuccess({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      })
    } catch (error) {
      setLoginError("Erro de conexão com o servidor.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-primary/25 bg-card p-6 shadow-2xl ring-glow">
        <span className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
        
        <div className="relative">
          <div className="mb-6 flex flex-col gap-2">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              <User className="size-3" />
              Identificação
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-card-foreground mt-2">
              Quem está reservando?
            </h2>
            <p className="text-sm text-muted-foreground">
              Insira seus dados para assinar suas reservas na Dizevolv.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary/80" />
              <input
                type="text"
                required
                disabled={isLoading}
                placeholder="Seu nome"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background/70 pl-10 pr-3 text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30 disabled:opacity-50"
              />
            </div>
            
            {/* ÍCONE DE EMAIL E PADDING CORRIGIDOS AQUI */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary/80" />
              <input
                type="email"
                required
                disabled={isLoading}
                placeholder="Seu e-mail"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background/70 pl-10 pr-3 text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30 disabled:opacity-50"
              />
            </div>

            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary/80" />
              <input
                type="text"
                disabled={isLoading}
                placeholder="Cargo (ex: Desenvolvedor, Designer)"
                value={tempRole}
                onChange={(e) => setTempRole(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background/70 pl-10 pr-3 text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30 disabled:opacity-50"
              />
            </div>
            
            {loginError && <p className="text-sm text-destructive font-medium">{loginError}</p>}
            
            <Button type="submit" size="lg" disabled={isLoading} className="w-full ring-glow flex items-center gap-2 group transition-all">
              {isLoading ? (
                <><Loader2 className="size-4 animate-spin" /> Entrando...</>
              ) : (
                <>Entrar <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}