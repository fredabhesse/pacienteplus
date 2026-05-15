import type { LucideIcon } from 'lucide-react'

export type PageKey =
  | 'dashboard'
  | 'conversas'
  | 'agendamentos'
  | 'pacientes'
  | 'campanhas'
  | 'programa'
  | 'configuracoes'

export type LeadTemperature = 'Quente' | 'Morno' | 'Frio'
export type PatientStatus = 'Ativo' | 'Inativo' | 'Pendente'
export type LoyaltyLevel = 'Ouro' | 'Prata' | 'Bronze'
export type ContactChannel = 'WhatsApp' | 'Site' | 'Telefone'
export type CampaignStage = 'Ativas' | 'Agendadas' | 'Finalizadas'
export type AppointmentStatus = 'Conf.' | 'Esp.' | 'Online'
export type AuditEntity = 'patient' | 'conversation' | 'message' | 'appointment' | 'campaign' | 'benefit' | 'programMetrics' | 'promotion'
export type AuditAction = 'create' | 'update' | 'delete' | 'send' | 'toggle' | 'reset' | 'migrate'

export type NavItem = {
  key: PageKey
  label: string
  icon: LucideIcon
}

export type Patient = {
  id: string
  initials: string
  name: string
  cpf: string
  phone: string
  status: PatientStatus
  lastVisit: string
  plan: string
  level: LoyaltyLevel
  score: number
  temperature: LeadTemperature
  channel: ContactChannel
  interest: string
  consent: {
    marketing: boolean
    communication: boolean
    updatedAt: string
  }
}

export type Conversation = {
  id: string
  patientId: string
  patientName: string
  initials: string
  channel: ContactChannel
  time: string
  preview: string
  unread: number
  temperature: LeadTemperature
  score: number
}

export type ChatMessage = {
  id: string
  conversationId: string
  author: 'bot' | 'patient' | 'agent'
  text: string
  time: string
  createdAt: string
}

export type Appointment = {
  id: string
  patientId: string
  day: number
  time: string
  specialty: string
  patient: string
  doctor: string
  tone: 'blue' | 'green' | 'amber'
  status: AppointmentStatus
  mode: string
}

export type Campaign = {
  id: string
  name: string
  channel: string
  audience: string
  reach: string
  conversion: string
  status: string
  stage: CampaignStage
}

export type Benefit = {
  id: string
  name: string
  demand: string
  score: string
}

export type ProgramMetrics = {
  nps: number
  retention: number
  redemptions: number
}

export type PromotionHistoryItem = {
  id: string
  patientId: string
  benefitId?: string
  date: string
  promotion: string
  channel: 'E-mail' | 'Mensagem'
}

export type AuditEvent = {
  id: string
  entity: AuditEntity
  entityId: string
  action: AuditAction
  createdAt: string
  actor: string
  metadata?: Record<string, string | number | boolean | null>
}

export type DemoState = {
  patients: Patient[]
  conversations: Conversation[]
  conversationMessages: Record<string, ChatMessage[]>
  humanMode: Record<string, boolean>
  promotionHistory: Record<string, PromotionHistoryItem[]>
  appointments: Appointment[]
  campaigns: Campaign[]
  benefits: Benefit[]
  programMetrics: ProgramMetrics
  auditEvents: AuditEvent[]
}

export const patients: Patient[] = [
  {
    id: 'p-ana',
    initials: 'AS',
    name: 'Ana Silva',
    cpf: '123.***.***-**',
    phone: '+55 31 9 8765-4321',
    status: 'Ativo',
    lastVisit: '10/10/2023',
    plan: 'Unimed',
    level: 'Ouro',
    score: 98,
    temperature: 'Quente',
    channel: 'WhatsApp',
    interest: 'Ressonância Magnética',
    consent: { marketing: true, communication: true, updatedAt: '2026-05-14T09:00:00.000Z' },
  },
  {
    id: 'p-carlos',
    initials: 'CO',
    name: 'Carlos Oliveira',
    cpf: '123.***.***-**',
    phone: '+55 31 9 9123-4455',
    status: 'Inativo',
    lastVisit: '15/08/2023',
    plan: 'Bradesco',
    level: 'Prata',
    score: 92,
    temperature: 'Quente',
    channel: 'Site',
    interest: 'Consulta Cardiologia',
    consent: { marketing: true, communication: true, updatedAt: '2026-05-14T09:00:00.000Z' },
  },
  {
    id: 'p-mariana',
    initials: 'MS',
    name: 'Mariana Santos',
    cpf: '123.***.***-**',
    phone: '+55 31 9 9988-7766',
    status: 'Ativo',
    lastVisit: '05/10/2023',
    plan: 'Particular',
    level: 'Bronze',
    score: 75,
    temperature: 'Morno',
    channel: 'WhatsApp',
    interest: 'Exame de Sangue',
    consent: { marketing: false, communication: true, updatedAt: '2026-05-14T09:00:00.000Z' },
  },
  {
    id: 'p-roberto',
    initials: 'RC',
    name: 'Roberto Costa',
    cpf: '123.***.***-**',
    phone: '+55 31 9 8877-6655',
    status: 'Ativo',
    lastVisit: '12/09/2023',
    plan: 'SulAmérica',
    level: 'Prata',
    score: 64,
    temperature: 'Morno',
    channel: 'Telefone',
    interest: 'Retorno Clínico',
    consent: { marketing: false, communication: true, updatedAt: '2026-05-14T09:00:00.000Z' },
  },
  {
    id: 'p-fernanda',
    initials: 'FL',
    name: 'Fernanda Lima',
    cpf: '123.***.***-**',
    phone: '+55 31 9 7766-5544',
    status: 'Pendente',
    lastVisit: '-',
    plan: 'Unimed',
    level: 'Bronze',
    score: 38,
    temperature: 'Frio',
    channel: 'WhatsApp',
    interest: 'Informações sobre planos',
    consent: { marketing: true, communication: true, updatedAt: '2026-05-14T09:00:00.000Z' },
  },
  {
    id: 'p-paulo',
    initials: 'PV',
    name: 'Paulo Vieira',
    cpf: '123.***.***-**',
    phone: '+55 31 9 6655-4433',
    status: 'Ativo',
    lastVisit: '27/09/2023',
    plan: 'Particular',
    level: 'Bronze',
    score: 22,
    temperature: 'Frio',
    channel: 'Site',
    interest: 'Valores de consulta',
    consent: { marketing: false, communication: true, updatedAt: '2026-05-14T09:00:00.000Z' },
  },
]

export const conversations: Conversation[] = [
  {
    id: 'ana',
    patientId: 'p-ana',
    patientName: 'Ana Silva',
    initials: 'AS',
    channel: 'WhatsApp',
    time: '14:32',
    preview: 'Perfeito! Pode confirmar para quinta às...',
    unread: 2,
    temperature: 'Quente',
    score: 98,
  },
  {
    id: 'carlos',
    patientId: 'p-carlos',
    patientName: 'Carlos Oliveira',
    initials: 'CO',
    channel: 'Site',
    time: '14:18',
    preview: 'Quanto custa a consulta com o Dr. Men...',
    unread: 1,
    temperature: 'Quente',
    score: 92,
  },
  {
    id: 'mariana',
    patientId: 'p-mariana',
    patientName: 'Mariana Santos',
    initials: 'MS',
    channel: 'WhatsApp',
    time: '13:45',
    preview: 'Vou pensar e te retorno mais tarde, ok?',
    unread: 0,
    temperature: 'Morno',
    score: 75,
  },
  {
    id: 'roberto',
    patientId: 'p-roberto',
    patientName: 'Roberto Costa',
    initials: 'RC',
    channel: 'Telefone',
    time: '12:10',
    preview: 'Recebeu o link do retorno? Posso ajud...',
    unread: 0,
    temperature: 'Morno',
    score: 64,
  },
  {
    id: 'fernanda',
    patientId: 'p-fernanda',
    patientName: 'Fernanda Lima',
    initials: 'FL',
    channel: 'WhatsApp',
    time: 'Ontem',
    preview: 'Obrigada pelas informações.',
    unread: 0,
    temperature: 'Frio',
    score: 38,
  },
  {
    id: 'paulo',
    patientId: 'p-paulo',
    patientName: 'Paulo Vieira',
    initials: 'PV',
    channel: 'Site',
    time: 'Ontem',
    preview: 'Só estava olhando os preços, valeu.',
    unread: 0,
    temperature: 'Frio',
    score: 22,
  },
]

export const appointments: Appointment[] = [
  {
    id: 'a-1',
    patientId: 'p-roberto',
    day: 2,
    time: '16:00',
    specialty: 'Clínico Geral',
    patient: 'Roberto Santos',
    doctor: 'Dr. Pereira',
    tone: 'blue',
    status: 'Online',
    mode: 'Telemedicina',
  },
  {
    id: 'a-2',
    patientId: 'p-ana',
    day: 3,
    time: '09:00',
    specialty: 'Cardiologia',
    patient: 'Maria Souza',
    doctor: 'Dr. Silva',
    tone: 'green',
    status: 'Conf.',
    mode: 'Consulta',
  },
  {
    id: 'a-3',
    patientId: 'p-mariana',
    day: 3,
    time: '14:30',
    specialty: 'Dermatologia',
    patient: 'João Pereira',
    doctor: 'Dra. Costa',
    tone: 'amber',
    status: 'Esp.',
    mode: 'Exame',
  },
  {
    id: 'a-4',
    patientId: 'p-carlos',
    day: 4,
    time: '10:00',
    specialty: 'Ortopedia',
    patient: 'Ana Clara',
    doctor: 'Dr. Santos',
    tone: 'green',
    status: 'Conf.',
    mode: 'Retorno',
  },
  {
    id: 'a-5',
    patientId: 'p-fernanda',
    day: 5,
    time: '11:00',
    specialty: 'Pediatria',
    patient: 'Carlos Lima',
    doctor: 'Dra. Oliveira',
    tone: 'green',
    status: 'Conf.',
    mode: 'Consulta',
  },
]

export const campaigns: Campaign[] = [
  {
    id: 'c-1',
    name: 'Outubro Rosa - Checkup Mulher',
    channel: 'WhatsApp + Email',
    audience: 'Mulheres 40+',
    reach: '2.5k',
    conversion: '8.5%',
    status: 'Em andamento',
    stage: 'Ativas',
  },
  {
    id: 'c-2',
    name: 'Vacinação Gripe - Lembrete',
    channel: 'SMS',
    audience: 'Todos Pacientes',
    reach: '15k',
    conversion: '3.2%',
    status: 'Em andamento',
    stage: 'Ativas',
  },
  {
    id: 'c-3',
    name: 'Retorno Cardiologista',
    channel: 'WhatsApp',
    audience: 'Pacientes Cardíacos',
    reach: '850',
    conversion: '12%',
    status: 'Em andamento',
    stage: 'Ativas',
  },
  {
    id: 'c-4',
    name: 'Boas-vindas Novos Pacientes',
    channel: 'Email + WhatsApp',
    audience: 'Primeira consulta',
    reach: '1.2k',
    conversion: '6.1%',
    status: 'Agendada',
    stage: 'Agendadas',
  },
  {
    id: 'c-5',
    name: 'Check-up Corporativo',
    channel: 'Email',
    audience: 'Empresas parceiras',
    reach: '3.4k',
    conversion: '4.4%',
    status: 'Finalizada',
    stage: 'Finalizadas',
  },
]

export const benefits: Benefit[] = [
  { id: 'b-1', name: 'Prioridade no Agendamento', demand: 'ALTA PROCURA', score: '9.8' },
  { id: 'b-2', name: 'Desconto em Check-up', demand: 'ALTA PROCURA', score: '9.5' },
  { id: 'b-3', name: 'Concierge de Saúde 24h', demand: 'MÉDIA PROCURA', score: '8.9' },
  { id: 'b-4', name: 'Estacionamento Gratuito', demand: 'BAIXA PROCURA', score: '7.5' },
]

export const conversionData = [
  { month: 'Jan', real: 33, target: 47 },
  { month: 'Fev', real: 35, target: 47 },
  { month: 'Mar', real: 34, target: 47 },
  { month: 'Abr', real: 37, target: 47 },
  { month: 'Mai', real: 40, target: 47 },
  { month: 'Jun', real: 42, target: 47 },
]

export const channelData = [
  { name: 'WhatsApp', value: 42, color: '#10b981' },
  { name: 'Site/App', value: 18, color: '#3b82f6' },
  { name: 'Telefone', value: 30, color: '#64748b' },
  { name: 'Presencial', value: 10, color: '#94a3b8' },
]

export const defaultDemoState: DemoState = {
  patients,
  conversations,
  conversationMessages: {},
  humanMode: {},
  promotionHistory: {},
  appointments,
  campaigns,
  benefits,
  programMetrics: {
    nps: 88,
    retention: 38,
    redemptions: 1245,
  },
  auditEvents: [],
}
