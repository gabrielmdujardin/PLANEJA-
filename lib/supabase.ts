import { createClient } from "@supabase/supabase-js"

// Tipos para as tabelas do banco de dados
export type User = {
  id: string
  email: string
  name: string
  profile_photo?: string
  created_at?: string
  updated_at?: string
}

export type Contact = {
  id: string
  user_id: string
  name: string
  email?: string
  phone?: string
  is_favorite: boolean
  created_at?: string
  updated_at?: string
}

export type Event = {
  id: string
  user_id: string
  title: string
  type: string
  date: string
  time: string
  location: string
  description?: string
  created_at?: string
  updated_at?: string
}

export type Guest = {
  id: string
  event_id: string
  name: string
  email: string
  phone: string
  status: "pending" | "confirmed" | "declined"
  invite_sent_at?: string
  created_at?: string
  updated_at?: string
}

export type Item = {
  id: string
  event_id: string
  name: string
  price: number
  image?: string
  created_at?: string
  updated_at?: string
}

export type ItemAssignment = {
  id: string
  item_id: string
  guest_id?: string
  contact_id?: string
  name?: string
  created_at?: string
  updated_at?: string
}

export type NotificationSettings = {
  id: string
  user_id: string
  email_notifications: boolean
  push_notifications: boolean
  event_reminders: boolean
  guest_updates: boolean
  created_at?: string
  updated_at?: string
}

// Criação do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL e Anon Key são necessários")
}

// Cliente para uso no lado do cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Função para criar um cliente com a chave de serviço (para uso no servidor)
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase URL e Service Role Key são necessários para operações no servidor")
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}
