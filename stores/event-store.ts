"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Person {
  id: string
  name: string
}

interface Item {
  id: string
  name: string
  price: number
  assignedTo: Person[] | null
  image?: string | null
}

// Atualizar a interface Guest para incluir o campo phone
interface Guest {
  id: string
  name: string
  email: string
  phone: string
  status: "confirmed" | "pending" | "declined"
}

interface Event {
  id: string
  title: string
  type: string
  date: string
  time: string
  fullDate?: string
  location: string
  description: string
  confirmedGuests: number
  totalGuests: number
  items: Item[]
  guests: Guest[]
}

interface EventStore {
  events: Event[]
  addEvent: (event: Event) => void
  updateEvent: (id: string, event: Partial<Event>) => void
  removeEvent: (id: string) => void
  getEventById: (id: string) => Event | undefined

  // Itens
  addItem: (eventId: string, item: Item) => void
  updateItem: (eventId: string, itemId: string, item: Item) => void
  removeItem: (eventId: string, itemId: string) => void

  // Convidados
  addGuests: (eventId: string, guests: Guest[]) => void
  updateGuest: (eventId: string, guestId: string, guest: Guest) => void
  removeGuest: (eventId: string, guestId: string) => void
}

export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      events: [
        {
          id: "1",
          title: "Churrasco na Casa do João",
          type: "Colaborativo",
          date: "Sábado, 15 de Junho",
          time: "16:00",
          fullDate: "15/06/2024",
          location: "Rua das Flores, 123 - São Paulo, SP",
          description: "Traga sua bebida favorita! Vamos comemorar o aniversário do João com um churrasco incrível.",
          confirmedGuests: 12,
          totalGuests: 15,
          items: [
            {
              id: "1",
              name: "Carne (5kg)",
              price: 150,
              assignedTo: [{ id: "p1", name: "João" }],
              image: null,
            },
            {
              id: "2",
              name: "Carvão",
              price: 25,
              assignedTo: [{ id: "p2", name: "Maria" }],
              image: null,
            },
            {
              id: "3",
              name: "Bebidas",
              price: 120,
              assignedTo: null,
              image: null,
            },
            {
              id: "4",
              name: "Pão de alho",
              price: 30,
              assignedTo: [{ id: "p3", name: "Pedro" }],
              image: null,
            },
            {
              id: "5",
              name: "Descartáveis",
              price: 45,
              assignedTo: null,
              image: null,
            },
          ],
          guests: [
            { id: "1", name: "João Silva", status: "confirmed", email: "joao@example.com", phone: "(11) 98765-4321" },
            {
              id: "2",
              name: "Maria Oliveira",
              status: "confirmed",
              email: "maria@example.com",
              phone: "(11) 91234-5678",
            },
            {
              id: "3",
              name: "Pedro Santos",
              status: "confirmed",
              email: "pedro@example.com",
              phone: "(11) 99876-5432",
            },
            { id: "4", name: "Ana Costa", status: "pending", email: "ana@example.com", phone: "(11) 95555-4444" },
            {
              id: "5",
              name: "Lucas Ferreira",
              status: "declined",
              email: "lucas@example.com",
              phone: "(11) 93333-2222",
            },
          ],
        },
        {
          id: "2",
          title: "Aniversário da Maria",
          type: "Festa",
          date: "Domingo, 23 de Junho",
          time: "14:00",
          fullDate: "23/06/2024",
          location: "Salão de Festas Primavera - Av. Principal, 500",
          description: "Venha celebrar o aniversário da Maria com muita diversão e alegria!",
          confirmedGuests: 8,
          totalGuests: 20,
          items: [],
          guests: [
            { id: "1", name: "João Silva", status: "confirmed", email: "joao@example.com", phone: "(11) 98765-4321" },
            {
              id: "2",
              name: "Pedro Santos",
              status: "confirmed",
              email: "pedro@example.com",
              phone: "(11) 99876-5432",
            },
            { id: "3", name: "Ana Costa", status: "pending", email: "ana@example.com", phone: "(11) 95555-4444" },
          ],
        },
      ],

      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, event],
        })),

      updateEvent: (id, updatedEvent) =>
        set((state) => ({
          events: state.events.map((event) => (event.id === id ? { ...event, ...updatedEvent } : event)),
        })),

      removeEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),

      getEventById: (id) => {
        return get().events.find((event) => event.id === id)
      },

      // Itens
      addItem: (eventId, item) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  items: [...(event.items || []), item],
                }
              : event,
          ),
        })),

      updateItem: (eventId, itemId, updatedItem) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  items: event.items.map((item) => (item.id === itemId ? updatedItem : item)),
                }
              : event,
          ),
        })),

      removeItem: (eventId, itemId) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  items: event.items.filter((item) => item.id !== itemId),
                }
              : event,
          ),
        })),

      // Convidados
      addGuests: (eventId, newGuests) =>
        set((state) => {
          const event = state.events.find((e) => e.id === eventId)
          if (!event) return state

          return {
            events: state.events.map((event) =>
              event.id === eventId
                ? {
                    ...event,
                    guests: [...(event.guests || []), ...newGuests],
                    totalGuests: (event.totalGuests || 0) + newGuests.length,
                  }
                : event,
            ),
          }
        }),

      updateGuest: (eventId, guestId, updatedGuest) =>
        set((state) => {
          const event = state.events.find((e) => e.id === eventId)
          if (!event) return state

          // Verificar se o status mudou para atualizar o contador de confirmados
          const oldGuest = event.guests.find((g) => g.id === guestId)
          let confirmedDelta = 0

          if (oldGuest && oldGuest.status !== updatedGuest.status) {
            if (oldGuest.status === "confirmed" && updatedGuest.status !== "confirmed") {
              confirmedDelta = -1
            } else if (oldGuest.status !== "confirmed" && updatedGuest.status === "confirmed") {
              confirmedDelta = 1
            }
          }

          return {
            events: state.events.map((event) =>
              event.id === eventId
                ? {
                    ...event,
                    guests: event.guests.map((guest) => (guest.id === guestId ? updatedGuest : guest)),
                    confirmedGuests: event.confirmedGuests + confirmedDelta,
                  }
                : event,
            ),
          }
        }),

      removeGuest: (eventId, guestId) =>
        set((state) => {
          const event = state.events.find((e) => e.id === eventId)
          if (!event) return state

          // Verificar se o convidado estava confirmado
          const guest = event.guests.find((g) => g.id === guestId)
          const confirmedDelta = guest && guest.status === "confirmed" ? -1 : 0

          return {
            events: state.events.map((event) =>
              event.id === eventId
                ? {
                    ...event,
                    guests: event.guests.filter((guest) => guest.id !== guestId),
                    totalGuests: event.totalGuests - 1,
                    confirmedGuests: event.confirmedGuests + confirmedDelta,
                  }
                : event,
            ),
          }
        }),
    }),
    {
      name: "event-storage",
    },
  ),
)
