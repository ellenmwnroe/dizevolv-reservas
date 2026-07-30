export type Room = {
  id: string
  name: string
  capacity: number
  description: string
  location: string
  tag: string
  status: "livre" | "ocupada" | "em-breve"
  freeIn?: string
}

export type ReservationStatus = "confirmado" | "em-andamento" | "concluido"

export type Reservation = {
  id: string
  roomId: string
  roomName: string
  date: string
  startTime: string
  endTime: string
  attendees: number
  organizer: string
  status: ReservationStatus
}

export const rooms: Room[] = [
  {
    id: "sala-atlas",
    name: "Atlas",
    capacity: 5,
    description: "Ideal para reuniões rápidas de equipe e alinhamentos diários.",
    location: "3º andar · Ala Norte",
    tag: "Squad",
    status: "livre",
  },
  {
    id: "sala-nimbus",
    name: "Nimbus",
    capacity: 10,
    description: "Sala versátil com TV 4K e videoconferência para times médios.",
    location: "4º andar · Ala Sul",
    tag: "Híbrida",
    status: "em-breve",
    freeIn: "12 min",
  },
  {
    id: "sala-vertex",
    name: "Vertex",
    capacity: 16,
    description: "Espaço executivo para apresentações a clientes e workshops.",
    location: "5º andar · Ala Central",
    tag: "Executiva",
    status: "ocupada",
  },
  {
    id: "sala-orbit",
    name: "Orbit",
    capacity: 4,
    description: "Cabine silenciosa para entrevistas e chamadas individuais.",
    location: "2º andar · Ala Leste",
    tag: "Focus",
    status: "livre",
  },
  {
    id: "sala-lumen",
    name: "Lumen",
    capacity: 8,
    description: "Ambiente criativo com lousa digital para brainstorms.",
    location: "3º andar · Ala Sul",
    tag: "Criativa",
    status: "livre",
  },
  {
    id: "sala-horizon",
    name: "Horizon",
    capacity: 24,
    description: "Auditório compacto para treinamentos e reuniões gerais.",
    location: "6º andar · Ala Central",
    tag: "Auditório",
    status: "em-breve",
    freeIn: "40 min",
  },
]

export const initialReservations: Reservation[] = [
  {
    id: "res-1",
    roomId: "sala-vertex",
    roomName: "Vertex",
    date: "2026-07-29",
    startTime: "09:00",
    endTime: "10:30",
    attendees: 12,
    organizer: "Camila Ribeiro",
    status: "confirmado",
  },
  {
    id: "res-2",
    roomId: "sala-nimbus",
    roomName: "Nimbus",
    date: "2026-07-29",
    startTime: "11:00",
    endTime: "12:00",
    attendees: 7,
    organizer: "Rafael Souza",
    status: "em-andamento",
  },
  {
    id: "res-3",
    roomId: "sala-atlas",
    roomName: "Atlas",
    date: "2026-07-29",
    startTime: "14:00",
    endTime: "14:30",
    attendees: 4,
    organizer: "Beatriz Lima",
    status: "confirmado",
  },
  {
    id: "res-4",
    roomId: "sala-lumen",
    roomName: "Lumen",
    date: "2026-07-28",
    startTime: "16:00",
    endTime: "17:00",
    attendees: 6,
    organizer: "Diego Nunes",
    status: "concluido",
  },
]
