"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useEventStore } from "@/stores/event-store"

interface AddGuestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
}

export default function AddGuestDialog({ open, onOpenChange, eventId }: AddGuestDialogProps) {
  const [guestNames, setGuestNames] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const { addGuests } = useEventStore()

  const handleAddGuests = () => {
    if (!guestNames.trim()) {
      toast({
        title: "Nenhum convidado informado",
        description: "Por favor, informe pelo menos um convidado.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Processar nomes dos convidados
      const names = guestNames
        .split(/[\n,]/)
        .map((name) => name.trim())
        .filter((name) => name !== "")

      // Criar novos convidados
      const newGuests = names.map((name, index) => ({
        id: `g-${Date.now()}-${index}`,
        name,
        email: "",
        status: "pending",
      }))

      // Adicionar convidados ao evento
      addGuests(eventId, newGuests)

      // Limpar formulário
      setGuestNames("")
      onOpenChange(false)

      toast({
        title: "Convidados adicionados",
        description: `${newGuests.length} convidados foram adicionados ao evento.`,
      })
    } catch (error) {
      toast({
        title: "Erro ao adicionar convidados",
        description: "Ocorreu um erro ao adicionar os convidados. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar convidados</DialogTitle>
          <DialogDescription>Adicione novos convidados ao seu evento.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="guest-names">Nomes dos convidados*</Label>
            <Textarea
              id="guest-names"
              placeholder="Digite os nomes separados por vírgula ou em linhas separadas"
              className="min-h-[120px]"
              value={guestNames}
              onChange={(e) => setGuestNames(e.target.value)}
            />
            <p className="text-xs text-gray-500">Exemplo: João Silva, Maria Oliveira, Pedro Santos</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAddGuests} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
            {isSubmitting ? "Adicionando..." : "Adicionar convidados"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
