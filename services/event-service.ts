import { supabase } from "@/lib/supabase"
import type { Event, Guest, Item, ItemAssignment } from "@/lib/supabase"

// Função para buscar todos os eventos de um usuário
export async function getUserEvents(userId: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true })

  if (error) {
    console.error("Erro ao buscar eventos:", error)
    throw error
  }

  return data || []
}

// Função para buscar um evento específico
export async function getEventById(eventId: string): Promise<Event | null> {
  const { data, error } = await supabase.from("events").select("*").eq("id", eventId).single()

  if (error) {
    console.error("Erro ao buscar evento:", error)
    return null
  }

  return data
}

// Função para criar um novo evento
export async function createEvent(eventData: Omit<Event, "id" | "created_at" | "updated_at">): Promise<Event> {
  const { data, error } = await supabase.from("events").insert([eventData]).select().single()

  if (error) {
    console.error("Erro ao criar evento:", error)
    throw error
  }

  return data
}

// Função para atualizar um evento
export async function updateEvent(eventId: string, eventData: Partial<Event>): Promise<Event> {
  const { data, error } = await supabase.from("events").update(eventData).eq("id", eventId).select().single()

  if (error) {
    console.error("Erro ao atualizar evento:", error)
    throw error
  }

  return data
}

// Função para excluir um evento
export async function deleteEvent(eventId: string): Promise<void> {
  const { error } = await supabase.from("events").delete().eq("id", eventId)

  if (error) {
    console.error("Erro ao excluir evento:", error)
    throw error
  }
}

// Função para buscar convidados de um evento
export async function getEventGuests(eventId: string): Promise<Guest[]> {
  const { data, error } = await supabase.from("guests").select("*").eq("event_id", eventId)

  if (error) {
    console.error("Erro ao buscar convidados:", error)
    throw error
  }

  return data || []
}

// Função para adicionar um convidado
export async function addGuest(guestData: Omit<Guest, "id" | "created_at" | "updated_at">): Promise<Guest> {
  const { data, error } = await supabase.from("guests").insert([guestData]).select().single()

  if (error) {
    console.error("Erro ao adicionar convidado:", error)
    throw error
  }

  return data
}

// Função para atualizar o status de um convidado
export async function updateGuestStatus(guestId: string, status: "pending" | "confirmed" | "declined"): Promise<Guest> {
  const { data, error } = await supabase.from("guests").update({ status }).eq("id", guestId).select().single()

  if (error) {
    console.error("Erro ao atualizar status do convidado:", error)
    throw error
  }

  return data
}

// Função para remover um convidado
export async function removeGuest(guestId: string): Promise<void> {
  const { error } = await supabase.from("guests").delete().eq("id", guestId)

  if (error) {
    console.error("Erro ao remover convidado:", error)
    throw error
  }
}

// Função para buscar itens de um evento
export async function getEventItems(eventId: string): Promise<Item[]> {
  const { data, error } = await supabase.from("items").select("*").eq("event_id", eventId)

  if (error) {
    console.error("Erro ao buscar itens:", error)
    throw error
  }

  return data || []
}

// Função para adicionar um item
export async function addItem(itemData: Omit<Item, "id" | "created_at" | "updated_at">): Promise<Item> {
  const { data, error } = await supabase.from("items").insert([itemData]).select().single()

  if (error) {
    console.error("Erro ao adicionar item:", error)
    throw error
  }

  return data
}

// Função para atualizar um item
export async function updateItem(itemId: string, itemData: Partial<Item>): Promise<Item> {
  const { data, error } = await supabase.from("items").update(itemData).eq("id", itemId).select().single()

  if (error) {
    console.error("Erro ao atualizar item:", error)
    throw error
  }

  return data
}

// Função para remover um item
export async function removeItem(itemId: string): Promise<void> {
  const { error } = await supabase.from("items").delete().eq("id", itemId)

  if (error) {
    console.error("Erro ao remover item:", error)
    throw error
  }
}

// Função para atribuir responsáveis a um item
export async function assignItemToGuest(
  itemId: string,
  assignmentData: Omit<ItemAssignment, "id" | "item_id" | "created_at" | "updated_at">,
): Promise<ItemAssignment> {
  const { data, error } = await supabase
    .from("item_assignments")
    .insert([{ ...assignmentData, item_id: itemId }])
    .select()
    .single()

  if (error) {
    console.error("Erro ao atribuir item:", error)
    throw error
  }

  return data
}

// Função para buscar atribuições de um item
export async function getItemAssignments(itemId: string): Promise<ItemAssignment[]> {
  const { data, error } = await supabase.from("item_assignments").select("*").eq("item_id", itemId)

  if (error) {
    console.error("Erro ao buscar atribuições do item:", error)
    throw error
  }

  return data || []
}
