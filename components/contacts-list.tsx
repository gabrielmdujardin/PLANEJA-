"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Search, Star, StarOff, MoreVertical, Edit, Trash2, Mail, Phone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth-context"
import { getUserContacts, toggleFavoriteContact, deleteContact } from "@/services/contact-service"
import type { Contact } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function ContactsList() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Carregar contatos do usuário
  useEffect(() => {
    const loadContacts = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const userContacts = await getUserContacts(user.id)
        setContacts(userContacts)
        setFilteredContacts(userContacts)
      } catch (error) {
        console.error("Erro ao carregar contatos:", error)
        toast({
          title: "Erro ao carregar contatos",
          description: "Não foi possível carregar seus contatos. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadContacts()
  }, [user, toast])

  // Filtrar contatos com base no termo de pesquisa
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredContacts(contacts)
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(term) ||
        (contact.email && contact.email.toLowerCase().includes(term)) ||
        (contact.phone && contact.phone.includes(term)),
    )

    setFilteredContacts(filtered)
  }, [searchTerm, contacts])

  // Função para alternar favorito
  const handleToggleFavorite = async (contact: Contact) => {
    try {
      await toggleFavoriteContact(contact.id, !contact.is_favorite)

      // Atualizar estado local
      setContacts(contacts.map((c) => (c.id === contact.id ? { ...c, is_favorite: !c.is_favorite } : c)))

      toast({
        title: contact.is_favorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
        description: `${contact.name} foi ${contact.is_favorite ? "removido dos" : "adicionado aos"} favoritos.`,
      })
    } catch (error) {
      console.error("Erro ao alternar favorito:", error)
      toast({
        title: "Erro ao atualizar favorito",
        description: "Não foi possível atualizar o status de favorito. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função para excluir contato
  const handleDeleteContact = async (contact: Contact) => {
    try {
      await deleteContact(contact.id)

      // Atualizar estado local
      setContacts(contacts.filter((c) => c.id !== contact.id))

      toast({
        title: "Contato excluído",
        description: `${contact.name} foi removido da sua lista de contatos.`,
      })
    } catch (error) {
      console.error("Erro ao excluir contato:", error)
      toast({
        title: "Erro ao excluir contato",
        description: "Não foi possível excluir o contato. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Renderizar avatar
  const renderAvatar = (name: string) => {
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)

    return (
      <Avatar>
        <AvatarFallback className="bg-emerald-100 text-emerald-800">{initials}</AvatarFallback>
      </Avatar>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Meus Contatos</h1>
          <p className="text-gray-600 dark:text-gray-300">Gerencie seus contatos para eventos</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
          <Plus className="h-4 w-4 mr-2" /> Adicionar contato
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar contatos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Lista de Contatos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredContacts.length > 0 ? (
            <div className="divide-y">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {renderAvatar(contact.name)}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{contact.name}</h3>
                        {contact.is_favorite && <Star className="h-4 w-4 text-amber-500" />}
                      </div>
                      {contact.email && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-3 w-3 mr-1" /> {contact.email}
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-3 w-3 mr-1" /> {contact.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFavorite(contact)}>
                          {contact.is_favorite ? (
                            <>
                              <StarOff className="h-4 w-4 mr-2" /> Remover dos favoritos
                            </>
                          ) : (
                            <>
                              <Star className="h-4 w-4 mr-2" /> Adicionar aos favoritos
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteContact(contact)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Nenhum contato encontrado</p>
              <Button variant="outline" className="mr-2">
                Importar contatos
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" /> Adicionar contato
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
