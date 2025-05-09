import { supabase } from "@/lib/supabase"
import type { Contact } from "@/lib/supabase"

// Função para buscar todos os contatos de um usuário
export async function getUserContacts(userId: string): Promise<Contact[]> {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true })

  if (error) {
    console.error("Erro ao buscar contatos:", error)
    throw error
  }

  return data || []
}

// Função para buscar contatos favoritos
export async function getFavoriteContacts(userId: string): Promise<Contact[]> {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("user_id", userId)
    .eq("is_favorite", true)
    .order("name", { ascending: true })

  if (error) {
    console.error("Erro ao buscar contatos favoritos:", error)
    throw error
  }

  return data || []
}

// Função para buscar um contato específico
export async function getContactById(contactId: string): Promise<Contact | null> {
  const { data, error } = await supabase.from("contacts").select("*").eq("id", contactId).single()

  if (error) {
    console.error("Erro ao buscar contato:", error)
    return null
  }

  return data
}

// Função para criar um novo contato
export async function createContact(contactData: Omit<Contact, "id" | "created_at" | "updated_at">): Promise<Contact> {
  const { data, error } = await supabase.from("contacts").insert([contactData]).select().single()

  if (error) {
    console.error("Erro ao criar contato:", error)
    throw error
  }

  return data
}

// Função para atualizar um contato
export async function updateContact(contactId: string, contactData: Partial<Contact>): Promise<Contact> {
  const { data, error } = await supabase.from("contacts").update(contactData).eq("id", contactId).select().single()

  if (error) {
    console.error("Erro ao atualizar contato:", error)
    throw error
  }

  return data
}

// Função para excluir um contato
export async function deleteContact(contactId: string): Promise<void> {
  const { error } = await supabase.from("contacts").delete().eq("id", contactId)

  if (error) {
    console.error("Erro ao excluir contato:", error)
    throw error
  }
}

// Função para marcar/desmarcar um contato como favorito
export async function toggleFavoriteContact(contactId: string, isFavorite: boolean): Promise<Contact> {
  const { data, error } = await supabase
    .from("contacts")
    .update({ is_favorite: isFavorite })
    .eq("id", contactId)
    .select()
    .single()

  if (error) {
    console.error("Erro ao atualizar favorito:", error)
    throw error
  }

  return data
}

// Função para buscar contatos por termo de pesquisa
export async function searchContacts(userId: string, searchTerm: string): Promise<Contact[]> {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("user_id", userId)
    .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
    .order("name", { ascending: true })

  if (error) {
    console.error("Erro ao pesquisar contatos:", error)
    throw error
  }

  return data || []
}
