"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, MapPin, CalendarDays, Clock, Users, ArrowRight, ArrowLeft } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { useEventStore } from "@/stores/event-store"

export default function CreateEvent() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [step, setStep] = useState(1)
  const [eventType, setEventType] = useState<string | undefined>(undefined)
  const [eventName, setEventName] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [guests, setGuests] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const { addEvent } = useEventStore()

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleCreateEvent = async () => {
    setIsSubmitting(true)

    try {
      // Simulando criação de evento
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Criar novo evento
      const newEvent = {
        id: Date.now().toString(),
        title: eventName,
        type: eventType === "festa" ? "Festa" : "Colaborativo",
        date: date ? format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "",
        time: eventTime,
        fullDate: date ? format(date, "dd/MM/yyyy") : "",
        location: eventLocation,
        description: eventDescription,
        confirmedGuests: 0,
        totalGuests: guests.split(/[\n,]/).filter((g) => g.trim()).length,
        items: [],
        guests: guests
          .split(/[\n,]/)
          .filter((g) => g.trim())
          .map((name, index) => ({
            id: `g-${Date.now()}-${index}`,
            name: name.trim(),
            email: "",
            status: "pending",
          })),
      }

      // Adicionar evento ao store
      addEvent(newEvent)

      toast({
        title: "Evento criado com sucesso!",
        description: "Seu evento foi criado e está pronto para ser compartilhado.",
      })

      // Redirecionar para o dashboard
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Erro ao criar evento",
        description: "Ocorreu um erro ao criar seu evento. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceedStep1 = !!eventType
  const canProceedStep2 = !!eventName && !!date && !!eventTime && !!eventLocation
  const canProceedStep3 = true // Pode prosseguir mesmo sem convidados inicialmente

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Criar novo evento</h1>
        <p className="text-gray-600">Preencha os detalhes do seu evento</p>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Tipo de evento</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={eventType}
              onValueChange={setEventType}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <RadioItem value="festa" id="festa" className="peer sr-only" />
                <Label
                  htmlFor="festa"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-500 [&:has([data-state=checked])]:border-emerald-500"
                >
                  <CalendarDays className="mb-3 h-8 w-8 text-emerald-500" />
                  <div className="text-center">
                    <h3 className="font-semibold">Festa</h3>
                    <p className="text-sm text-gray-500">Você é o anfitrião e os convidados não precisam pagar</p>
                  </div>
                </Label>
              </div>

              <div>
                <RadioItem value="colaborativo" id="colaborativo" className="peer sr-only" />
                <Label
                  htmlFor="colaborativo"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-500 [&:has([data-state=checked])]:border-emerald-500"
                >
                  <Users className="mb-3 h-8 w-8 text-emerald-500" />
                  <div className="text-center">
                    <h3 className="font-semibold">Colaborativo</h3>
                    <p className="text-sm text-gray-500">Cada convidado contribui com uma parte dos custos</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleNext} disabled={!canProceedStep1} className="bg-emerald-600 hover:bg-emerald-700">
              Continuar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do evento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="event-name">Nome do evento</Label>
              <Input
                id="event-name"
                placeholder="Ex: Churrasco de aniversário"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-description">Descrição (opcional)</Label>
              <Textarea
                id="event-description"
                placeholder="Detalhes sobre o evento..."
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-time">Horário</Label>
                <div className="relative">
                  <Input id="event-time" type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
                  <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-location">Local</Label>
              <div className="relative">
                <Input
                  id="event-location"
                  placeholder="Endereço do evento"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                />
                <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <Button onClick={handleNext} disabled={!canProceedStep2} className="bg-emerald-600 hover:bg-emerald-700">
              Continuar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Convidados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="guests">Adicionar convidados</Label>
              <Textarea
                id="guests"
                placeholder="Digite os nomes ou e-mails separados por vírgula ou em linhas separadas"
                className="min-h-[120px]"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Você também pode importar contatos do seu telefone depois de criar o evento.
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
              <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2" /> Listas de contatos frequentes
              </h3>
              <p className="text-sm text-amber-700 mb-3">
                Você ainda não tem listas de contatos salvas. Crie listas para facilitar convites em eventos futuros.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="text-amber-800 border-amber-300 bg-amber-100 hover:bg-amber-200"
                onClick={() => router.push("/contacts")}
              >
                Gerenciar contatos
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <Button
              onClick={handleCreateEvent}
              disabled={isSubmitting || !canProceedStep3}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? "Criando evento..." : "Finalizar"}{" "}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
