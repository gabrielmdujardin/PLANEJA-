"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import type { User } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)

        // Verificar se há uma sessão ativa
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        if (session?.user) {
          // Buscar dados adicionais do usuário
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (userError) {
            throw userError
          }

          setUser(userData)
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Configurar listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Buscar dados adicionais do usuário
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (!userError) {
          setUser(userData)
        }
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        // Buscar dados adicionais do usuário
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (userError) {
          throw userError
        }

        setUser(userData)

        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta.",
        })

        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Erro ao fazer login:", error)
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Ocorreu um erro ao fazer login",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Função de registro
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true)

      // Criar usuário na autenticação do Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        // Criar registro na tabela users
        const { data: userData, error: userError } = await supabase
          .from("users")
          .insert([
            {
              id: data.user.id,
              email,
              name,
            },
          ])
          .select()
          .single()

        if (userError) {
          throw userError
        }

        setUser(userData)

        toast({
          title: "Registro realizado com sucesso!",
          description: "Sua conta foi criada.",
        })

        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Erro ao registrar:", error)
      toast({
        title: "Erro ao registrar",
        description: error.message || "Ocorreu um erro ao registrar",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Função de logout
  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push("/")
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta.",
      })
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error)
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Ocorreu um erro ao fazer logout",
        variant: "destructive",
      })
    }
  }

  // Função para atualizar o perfil do usuário
  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) return

    try {
      setIsLoading(true)

      const { data, error } = await supabase.from("users").update(userData).eq("id", user.id).select().single()

      if (error) {
        throw error
      }

      setUser(data)

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      })
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error)
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Ocorreu um erro ao atualizar o perfil",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
