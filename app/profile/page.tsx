"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { Loader2, User, Bell, Shield, LogOut } from "lucide-react"

export default function ProfilePage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Notificações
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [eventReminders, setEventReminders] = useState(true)
  const [guestUpdates, setGuestUpdates] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
    }
  }, [user, authLoading, router])

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulando atualização de perfil
    setTimeout(() => {
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      })
      setIsLoading(false)
    }, 1000)
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro ao atualizar senha",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulando atualização de senha
    setTimeout(() => {
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setIsLoading(false)
    }, 1000)
  }

  const handleUpdateNotifications = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulando atualização de notificações
    setTimeout(() => {
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências de notificação foram atualizadas.",
      })
      setIsLoading(false)
    }, 1000)
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex flex-col items-center">
          <Avatar className="h-32 w-32 mb-4">
            <AvatarImage src="/placeholder.svg?height=128&width=128" alt={name} />
            <AvatarFallback className="text-3xl bg-emerald-100 text-emerald-800">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm">
            Alterar foto
          </Button>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{name || "Seu perfil"}</h1>
          <p className="text-gray-600 mb-4">{email || "seu@email.com"}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" /> Sair da conta
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações pessoais</CardTitle>
              <CardDescription>Atualize suas informações de perfil.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" type="tel" placeholder="(00) 00000-0000" />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancelar</Button>
              <Button
                onClick={handleUpdateProfile}
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Salvar alterações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de notificação</CardTitle>
              <CardDescription>Escolha como deseja receber notificações.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleUpdateNotifications}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                      <span>Notificações por email</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Receba atualizações sobre seus eventos por email
                      </span>
                    </Label>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                      <span>Notificações push</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Receba notificações no seu dispositivo
                      </span>
                    </Label>
                    <Switch
                      id="push-notifications"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="event-reminders" className="flex flex-col space-y-1">
                      <span>Lembretes de eventos</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Receba lembretes antes dos seus eventos
                      </span>
                    </Label>
                    <Switch id="event-reminders" checked={eventReminders} onCheckedChange={setEventReminders} />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="guest-updates" className="flex flex-col space-y-1">
                      <span>Atualizações de convidados</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Seja notificado quando convidados confirmarem presença
                      </span>
                    </Label>
                    <Switch id="guest-updates" checked={guestUpdates} onCheckedChange={setGuestUpdates} />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Restaurar padrões</Button>
              <Button
                onClick={handleUpdateNotifications}
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Salvar preferências
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da conta</CardTitle>
              <CardDescription>Altere sua senha e gerencie a segurança da sua conta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha atual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancelar</Button>
              <Button
                onClick={handleUpdatePassword}
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Atualizar senha
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
