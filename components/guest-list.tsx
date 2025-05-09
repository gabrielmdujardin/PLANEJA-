"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, MoreHorizontal, Send, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useEventStore } from "@/stores/event-store"

interface Guest {
  id: string
  name: string
  email: string
  status: "confirmed" | "pending" | "declined"
}

interface GuestListProps {
  guests: Guest[]
  eventId: string
}

export default function GuestList({ guests, eventId }: GuestListProps) {
  const { toast } = useToast()
  const { updateGuest, removeGuest } = useEventStore()

  const handleResendInvite = (guest: Guest) => {
    toast({
      title: "Convite reenviado",
      description: `O convite foi reenviado para ${guest.name}.`,
    })
  }

  const handleSendMessage = (guest: Guest) => {
    toast({
      title: "Mensagem enviada",
      description: `A mensagem foi enviada para ${guest.name}.`,
    })
  }

  const handleRemoveGuest = (guest: Guest) => {
    removeGuest(eventId, guest.id)
    toast({
      title: "Convidado removido",
      description: `${guest.name} foi removido da lista de convidados.`,
    })
  }

  const handleUpdateStatus = (guest: Guest, status: "confirmed" | "pending" | "declined") => {
    updateGuest(eventId, guest.id, { ...guest, status })
    toast({
      title: "Status atualizado",
      description: `O status de ${guest.name} foi atualizado.`,
    })
  }

  if (guests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Nenhum convidado adicionado</p>
        <p className="text-sm text-gray-400 mb-4">Adicione convidados para seu evento usando o botão acima.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {guests.map((guest) => (
          <TableRow key={guest.id}>
            <TableCell className="font-medium">{guest.name}</TableCell>
            <TableCell>{guest.email}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    {guest.status === "confirmed" && (
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200">
                        Confirmado
                      </Badge>
                    )}
                    {guest.status === "pending" && (
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
                        Pendente
                      </Badge>
                    )}
                    {guest.status === "declined" && (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">Recusado</Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleUpdateStatus(guest, "confirmed")}>Confirmado</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleUpdateStatus(guest, "pending")}>Pendente</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleUpdateStatus(guest, "declined")}>Recusado</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center" onClick={() => handleResendInvite(guest)}>
                    <Send className="mr-2 h-4 w-4" /> Reenviar convite
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center" onClick={() => handleSendMessage(guest)}>
                    <Mail className="mr-2 h-4 w-4" /> Enviar mensagem
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 flex items-center" onClick={() => handleRemoveGuest(guest)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Remover
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
