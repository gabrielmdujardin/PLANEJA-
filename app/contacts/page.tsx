"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Star, Users, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Tipos
interface Contact {
  id: string
  name: string
  email: string
  phone: string
  isFavorite: boolean
  lists: string[]
}

interface ContactList {
  id: string
  name: string
  contacts: string[]
}

export default function ContactsPage() {
  // Estado
  const [contacts, setContacts] = useState<Contact[]>([])
  const [contactLists, setContactLists] = useState<ContactList[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingContact, setIsAddingContact] = useState(false)
  const [isEditingContact, setIsEditingContact] = useState(false)
  const [isAddingList, setIsAddingList] = useState(false)
  const [currentContact, setCurrentContact] = useState<Contact | null>(null)
  const [newContactName, setNewContactName] = useState("")
  const [newContactEmail, setNewContactEmail] = useState("")
  const [newContactPhone, setNewContactPhone] = useState("")
  const [newListName, setNewListName] = useState("")
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])

  const { toast } = useToast()

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      // Simulando carregamento de dados
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Dados de exemplo
      const mockContacts: Contact[] = [
        {
          id: "1",
          name: "João Silva",
          email: "joao@example.com",
          phone: "(11) 98765-4321",
          isFavorite: true,
          lists: ["1"],
        },
        {
          id: "2",
          name: "Maria Oliveira",
          email: "maria@example.com",
          phone: "(11) 91234-5678",
          isFavorite: true,
          lists: ["1"],
        },
        {
          id: "3",
          name: "Pedro Santos",
          email: "pedro@example.com",
          phone: "(11) 99876-5432",
          isFavorite: false,
          lists: ["2"],
        },
        {
          id: "4",
          name: "Ana Costa",
          email: "ana@example.com",
          phone: "(11) 95555-4444",
          isFavorite: false,
          lists: [],
        },
        {
          id: "5",
          name: "Lucas Ferreira",
          email: "lucas@example.com",
          phone: "(11) 93333-2222",
          isFavorite: false,
          lists: ["2"],
        },
      ]

      const mockLists: ContactList[] = [
        { id: "1", name: "Amigos próximos", contacts: ["1", "2"] },
        { id: "2", name: "Colegas de trabalho", contacts: ["3", "5"] },
      ]

      setContacts(mockContacts)
      setContactLists(mockLists)
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Filtrar contatos
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery),
  )

  // Contatos favoritos
  const favoriteContacts = filteredContacts.filter((contact) => contact.isFavorite)

  // Contatos por lista
  const getContactsByList = (listId: string) => {
    const list = contactLists.find((l) => l.id === listId)
    if (!list) return []
    return contacts.filter((contact) => list.contacts.includes(contact.id))
  }

  // Adicionar contato
  const handleAddContact = () => {
    if (!newContactName || !newContactEmail) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e e-mail são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    const newContact: Contact = {
      id: Date.now().toString(),
      name: newContactName,
      email: newContactEmail,
      phone: newContactPhone,
      isFavorite: false,
      lists: [],
    }

    setContacts([...contacts, newContact])
    setNewContactName("")
    setNewContactEmail("")
    setNewContactPhone("")
    setIsAddingContact(false)

    toast({
      title: "Contato adicionado",
      description: `${newContactName} foi adicionado aos seus contatos.`,
    })
  }

  // Editar contato
  const handleEditContact = () => {
    if (!currentContact || !newContactName || !newContactEmail) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e e-mail são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    const updatedContacts = contacts.map((contact) =>
      contact.id === currentContact.id
        ? {
            ...contact,
            name: newContactName,
            email: newContactEmail,
            phone: newContactPhone,
          }
        : contact,
    )

    setContacts(updatedContacts)
    setIsEditingContact(false)
    setCurrentContact(null)

    toast({
      title: "Contato atualizado",
      description: `As informações de ${newContactName} foram atualizadas.`,
    })
  }

  // Remover contato
  const handleRemoveContact = (contactId: string) => {
    const contactToRemove = contacts.find((c) => c.id === contactId)
    if (!contactToRemove) return

    // Remover contato
    setContacts(contacts.filter((contact) => contact.id !== contactId))

    // Remover contato das listas
    const updatedLists = contactLists.map((list) => ({
      ...list,
      contacts: list.contacts.filter((id) => id !== contactId),
    }))
    setContactLists(updatedLists)

    toast({
      title: "Contato removido",
      description: `${contactToRemove.name} foi removido dos seus contatos.`,
    })
  }

  // Alternar favorito
  const handleToggleFavorite = (contactId: string) => {
    const updatedContacts = contacts.map((contact) =>
      contact.id === contactId ? { ...contact, isFavorite: !contact.isFavorite } : contact,
    )
    setContacts(updatedContacts)

    const contact = contacts.find((c) => c.id === contactId)
    if (contact) {
      toast({
        title: contact.isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
        description: `${contact.name} foi ${contact.isFavorite ? "removido dos" : "adicionado aos"} favoritos.`,
      })
    }
  }

  // Adicionar lista
  const handleAddList = () => {
    if (!newListName) {
      toast({
        title: "Nome obrigatório",
        description: "O nome da lista é obrigatório.",
        variant: "destructive",
      })
      return
    }

    const newList: ContactList = {
      id: Date.now().toString(),
      name: newListName,
      contacts: selectedContacts,
    }

    setContactLists([...contactLists, newList])

    // Atualizar contatos com a nova lista
    const updatedContacts = contacts.map((contact) =>
      selectedContacts.includes(contact.id) ? { ...contact, lists: [...contact.lists, newList.id] } : contact,
    )
    setContacts(updatedContacts)

    setNewListName("")
    setSelectedContacts([])
    setIsAddingList(false)

    toast({
      title: "Lista criada",
      description: `A lista "${newListName}" foi criada com ${selectedContacts.length} contatos.`,
    })
  }

  // Adicionar contato à lista
  const handleAddContactToList = (contactId: string, listId: string) => {
    // Verificar se o contato já está na lista
    const list = contactLists.find((l) => l.id === listId)
    if (list && list.contacts.includes(contactId)) {
      toast({
        title: "Contato já na lista",
        description: "Este contato já faz parte desta lista.",
        variant: "destructive",
      })
      return
    }

    // Atualizar a lista
    const updatedLists = contactLists.map((list) =>
      list.id === listId ? { ...list, contacts: [...list.contacts, contactId] } : list,
    )
    setContactLists(updatedLists)

    // Atualizar o contato
    const updatedContacts = contacts.map((contact) =>
      contact.id === contactId ? { ...list, lists: [...contact.lists, listId] } : contact,
    )
    setContacts(updatedContacts)

    const contact = contacts.find((c) => c.id === contactId)
    const listName = list?.name || ""

    toast({
      title: "Contato adicionado à lista",
      description: `${contact?.name} foi adicionado à lista "${listName}".`,
    })
  }

  // Remover contato da lista
  const handleRemoveContactFromList = (contactId: string, listId: string) => {
    // Atualizar a lista
    const updatedLists = contactLists.map((list) =>
      list.id === listId ? { ...list, contacts: list.contacts.filter((id) => id !== contactId) } : list,
    )
    setContactLists(updatedLists)

    // Atualizar o contato
    const updatedContacts = contacts.map((contact) =>
      contact.id === contactId ? { ...contact, lists: contact.lists.filter((id) => id !== listId) } : contact,
    )
    setContacts(updatedContacts)

    const contact = contacts.find((c) => c.id === contactId)
    const list = contactLists.find((l) => l.id === listId)

    toast({
      title: "Contato removido da lista",
      description: `${contact?.name} foi removido da lista "${list?.name}".`,
    })
  }

  // Remover lista
  const handleRemoveList = (listId: string) => {
    const listToRemove = contactLists.find((l) => l.id === listId)
    if (!listToRemove) return

    // Remover lista
    setContactLists(contactLists.filter((list) => list.id !== listId))

    // Atualizar contatos
    const updatedContacts = contacts.map((contact) => ({
      ...contact,
      lists: contact.lists.filter((id) => id !== listId),
    }))
    setContacts(updatedContacts)

    toast({
      title: "Lista removida",
      description: `A lista "${listToRemove.name}" foi removida.`,
    })
  }

  // Iniciar edição de contato
  const startEditContact = (contact: Contact) => {
    setCurrentContact(contact)
    setNewContactName(contact.name)
    setNewContactEmail(contact.email)
    setNewContactPhone(contact.phone)
    setIsEditingContact(true)
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

  // Renderizar contato
  const renderContact = (contact: Contact) => (
    <div key={contact.id} className="flex items-center justify-between p-3 border-b last:border-0">
      <div className="flex items-center gap-3">
        {renderAvatar(contact.name)}
        <div>
          <h3 className="font-medium">{contact.name}</h3>
          <p className="text-sm text-gray-500">{contact.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleToggleFavorite(contact.id)}
          className={contact.isFavorite ? "text-yellow-500" : "text-gray-400"}
        >
          <Star className="h-4 w-4" />
          <span className="sr-only">{contact.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => startEditContact(contact)}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={() => handleRemoveContact(contact.id)}>
              <Trash2 className="mr-2 h-4 w-4" /> Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Contatos</h1>
          <p className="text-gray-600">Gerencie seus contatos e listas para eventos</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar contatos..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <UserPlus className="h-4 w-4 mr-2" /> Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar contato</DialogTitle>
                <DialogDescription>Preencha as informações do novo contato.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome*</Label>
                  <Input
                    id="name"
                    placeholder="Nome completo"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail*</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(00) 00000-0000"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingContact(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddContact} className="bg-emerald-600 hover:bg-emerald-700">
                  Adicionar contato
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Editar contato dialog */}
      <Dialog open={isEditingContact} onOpenChange={setIsEditingContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar contato</DialogTitle>
            <DialogDescription>Atualize as informações do contato.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome*</Label>
              <Input
                id="edit-name"
                placeholder="Nome completo"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">E-mail*</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="email@exemplo.com"
                value={newContactEmail}
                onChange={(e) => setNewContactEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                placeholder="(00) 00000-0000"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingContact(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditContact} className="bg-emerald-600 hover:bg-emerald-700">
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adicionar lista dialog */}
      <Dialog open={isAddingList} onOpenChange={setIsAddingList}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Criar nova lista</DialogTitle>
            <DialogDescription>Crie uma lista para organizar seus contatos.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="list-name">Nome da lista*</Label>
              <Input
                id="list-name"
                placeholder="Ex: Amigos próximos"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Selecione os contatos</Label>
              <div className="border rounded-md max-h-60 overflow-y-auto">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center space-x-2 p-3 border-b last:border-0">
                    <Checkbox
                      id={`contact-${contact.id}`}
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedContacts([...selectedContacts, contact.id])
                        } else {
                          setSelectedContacts(selectedContacts.filter((id) => id !== contact.id))
                        }
                      }}
                    />
                    <Label htmlFor={`contact-${contact.id}`} className="flex-1 cursor-pointer">
                      {contact.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingList(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddList} className="bg-emerald-600 hover:bg-emerald-700">
              Criar lista
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="lists">Listas</TabsTrigger>
          </TabsList>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => setIsAddingList(true)}>
                <Plus className="h-4 w-4 mr-1" /> Nova lista
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Todos os contatos</CardTitle>
              <CardDescription>{filteredContacts.length} contatos encontrados</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredContacts.length > 0 ? (
                <div className="divide-y">{filteredContacts.map((contact) => renderContact(contact))}</div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Nenhum contato encontrado</p>
                  <Button variant="outline" onClick={() => setIsAddingContact(true)}>
                    Adicionar contato
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Contatos favoritos</CardTitle>
              <CardDescription>{favoriteContacts.length} contatos favoritos</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : favoriteContacts.length > 0 ? (
                <div className="divide-y">{favoriteContacts.map((contact) => renderContact(contact))}</div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Nenhum contato favorito</p>
                  <p className="text-sm text-gray-400">Marque contatos como favoritos clicando no ícone de estrela.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lists">
          <div className="space-y-6">
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[1, 2].map((j) => (
                          <div key={j} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                            <div className="space-y-2 flex-1">
                              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : contactLists.length > 0 ? (
              contactLists.map((list) => {
                const listContacts = getContactsByList(list.id)
                return (
                  <Card key={list.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{list.name}</CardTitle>
                          <CardDescription>{listContacts.length} contatos</CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Opções</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedListId(list.id)
                                // Aqui você poderia abrir um modal para editar a lista
                                toast({
                                  title: "Editar lista",
                                  description: "Funcionalidade em desenvolvimento.",
                                })
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Editar lista
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedListId(list.id)
                                // Aqui você poderia abrir um modal para adicionar contatos à lista
                                toast({
                                  title: "Adicionar contatos",
                                  description: "Funcionalidade em desenvolvimento.",
                                })
                              }}
                            >
                              <UserPlus className="mr-2 h-4 w-4" /> Adicionar contatos
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleRemoveList(list.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Remover lista
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {listContacts.length > 0 ? (
                        <div className="divide-y">{listContacts.map((contact) => renderContact(contact))}</div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500 mb-2">Nenhum contato nesta lista</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedListId(list.id)
                              // Aqui você poderia abrir um modal para adicionar contatos à lista
                              toast({
                                title: "Adicionar contatos",
                                description: "Funcionalidade em desenvolvimento.",
                              })
                            }}
                          >
                            <UserPlus className="h-4 w-4 mr-1" /> Adicionar contatos
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Nenhuma lista criada</h3>
                <p className="text-gray-500 mb-4">Crie listas para organizar seus contatos por grupos.</p>
                <Button onClick={() => setIsAddingList(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" /> Criar nova lista
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
