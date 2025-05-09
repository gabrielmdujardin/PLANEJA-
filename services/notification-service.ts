import { supabase } from "@/lib/supabase"
import type { NotificationSettings } from "@/lib/supabase"

// Função para buscar as configurações de notificação de um usuário
export async function getUserNotificationSettings(userId: string): Promise<NotificationSettings | null> {
  const { data, error } = await supabase.from("notification_settings").select("*").eq("user_id", userId).single()

  if (error) {
    // Se não encontrar, pode ser que o usuário ainda não tenha configurações
    if (error.code === "PGRST116") {
      return null
    }

    console.error("Erro ao buscar configurações de notificação:", error)
    throw error
  }

  return data
}

// Função para criar ou atualizar as configurações de notificação
export async function updateNotificationSettings(
  userId: string,
  settings: Partial<Omit<NotificationSettings, "id" | "user_id" | "created_at" | "updated_at">>,
): Promise<NotificationSettings> {
  // Verificar se já existem configurações
  const existingSettings = await getUserNotificationSettings(userId)

  if (existingSettings) {
    // Atualizar configurações existentes
    const { data, error } = await supabase
      .from("notification_settings")
      .update(settings)
      .eq("id", existingSettings.id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar configurações de notificação:", error)
      throw error
    }

    return data
  } else {
    // Criar novas configurações
    const { data, error } = await supabase
      .from("notification_settings")
      .insert([
        {
          user_id: userId,
          email_notifications: settings.email_notifications ?? true,
          push_notifications: settings.push_notifications ?? true,
          event_reminders: settings.event_reminders ?? true,
          guest_updates: settings.guest_updates ?? true,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar configurações de notificação:", error)
      throw error
    }

    return data
  }
}

// Função para simular o envio de um convite por email
export async function sendEmailInvite(guestId: string): Promise<void> {
  // Buscar informações do convidado
  const { data: guest, error: guestError } = await supabase
    .from("guests")
    .select("*, events(*)")
    .eq("id", guestId)
    .single()

  if (guestError) {
    console.error("Erro ao buscar convidado:", guestError)
    throw guestError
  }

  // Atualizar o timestamp de envio do convite
  const { error: updateError } = await supabase
    .from("guests")
    .update({ invite_sent_at: new Date().toISOString() })
    .eq("id", guestId)

  if (updateError) {
    console.error("Erro ao atualizar timestamp de convite:", updateError)
    throw updateError
  }

  // Em um ambiente real, aqui você enviaria o email usando um serviço como SendGrid, Mailgun, etc.
  console.log(`Email enviado para ${guest.name} (${guest.email}) para o evento ${guest.events.title}`)
}

// Função para simular o envio de um convite por SMS
export async function sendSmsInvite(guestId: string): Promise<void> {
  // Buscar informações do convidado
  const { data: guest, error: guestError } = await supabase
    .from("guests")
    .select("*, events(*)")
    .eq("id", guestId)
    .single()

  if (guestError) {
    console.error("Erro ao buscar convidado:", guestError)
    throw guestError
  }

  // Atualizar o timestamp de envio do convite
  const { error: updateError } = await supabase
    .from("guests")
    .update({ invite_sent_at: new Date().toISOString() })
    .eq("id", guestId)

  if (updateError) {
    console.error("Erro ao atualizar timestamp de convite:", updateError)
    throw updateError
  }

  // Em um ambiente real, aqui você enviaria o SMS usando um serviço como Twilio, MessageBird, etc.
  console.log(`SMS enviado para ${guest.name} (${guest.phone}) para o evento ${guest.events.title}`)
}
