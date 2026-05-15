import {
  defaultDemoState,
  type Appointment,
  type AuditAction,
  type AuditEntity,
  type AuditEvent,
  type Benefit,
  type Campaign,
  type ChatMessage,
  type Conversation,
  type DemoState,
  type Patient,
  type PromotionHistoryItem,
} from './data'

export const DATA_STORE_SCHEMA_VERSION = 1
export const DATA_STORE_KEY = 'paciente-plus-data-v1'
export const LEGACY_DEMO_STATE_KEY = 'paciente-plus-demo-state'
const SYSTEM_ACTOR = 'system'
const DEFAULT_TIMESTAMP = '2026-05-14T09:00:00.000Z'

type EntityMap<T extends { id: string }> = Record<string, T>

export type DataStoreSnapshot = {
  schemaVersion: typeof DATA_STORE_SCHEMA_VERSION
  patients: EntityMap<Patient>
  conversations: EntityMap<Conversation>
  messages: EntityMap<ChatMessage>
  conversationMessageIds: Record<string, string[]>
  humanMode: Record<string, boolean>
  promotionHistory: EntityMap<PromotionHistoryItem>
  patientPromotionHistoryIds: Record<string, string[]>
  appointments: EntityMap<Appointment>
  campaigns: EntityMap<Campaign>
  benefits: EntityMap<Benefit>
  programMetrics: DemoState['programMetrics']
  auditEvents: EntityMap<AuditEvent>
  auditEventIds: string[]
}

export type AuditInput = {
  entity: AuditEntity
  entityId: string
  action: AuditAction
  metadata?: AuditEvent['metadata']
}

export type DataRepository = {
  loadSnapshot: () => DataStoreSnapshot
  saveSnapshot: (snapshot: DataStoreSnapshot) => void
  resetSnapshot: () => DataStoreSnapshot
}

export class LocalStorageDataRepository implements DataRepository {
  loadSnapshot() {
    const current = readJson(window.localStorage.getItem(DATA_STORE_KEY))
    if (isDataStoreSnapshot(current)) return normalizeSnapshot(current)

    const legacy = readJson(window.localStorage.getItem(LEGACY_DEMO_STATE_KEY))
    if (legacy) {
      const migrated = demoStateToSnapshot(normalizeDemoState(legacy), {
        entity: 'programMetrics',
        entityId: 'data-store',
        action: 'migrate',
        metadata: { from: LEGACY_DEMO_STATE_KEY, to: DATA_STORE_KEY },
      })
      this.saveSnapshot(migrated)
      return migrated
    }

    const seed = createSeedSnapshot()
    this.saveSnapshot(seed)
    return seed
  }

  saveSnapshot(snapshot: DataStoreSnapshot) {
    window.localStorage.setItem(DATA_STORE_KEY, JSON.stringify(normalizeSnapshot(snapshot)))
  }

  resetSnapshot() {
    window.localStorage.removeItem(DATA_STORE_KEY)
    window.localStorage.removeItem(LEGACY_DEMO_STATE_KEY)
    const seed = demoStateToSnapshot(defaultDemoState, {
      entity: 'programMetrics',
      entityId: 'data-store',
      action: 'reset',
      metadata: { source: 'settings' },
    })
    this.saveSnapshot(seed)
    return seed
  }
}

export function createSeedSnapshot() {
  return demoStateToSnapshot(defaultDemoState)
}

export function demoStateToSnapshot(state: DemoState, audit?: AuditInput): DataStoreSnapshot {
  const normalized = normalizeDemoState(state)
  const messages: EntityMap<ChatMessage> = {}
  const conversationMessageIds: Record<string, string[]> = {}
  const promotionHistory: EntityMap<PromotionHistoryItem> = {}
  const patientPromotionHistoryIds: Record<string, string[]> = {}
  const auditEvents = toRecord(normalized.auditEvents)
  const auditEventIds = normalized.auditEvents.map((event) => event.id)

  Object.entries(normalized.conversationMessages).forEach(([conversationId, items]) => {
    conversationMessageIds[conversationId] = items.map((message) => {
      const normalizedMessage = normalizeMessage(message, conversationId)
      messages[normalizedMessage.id] = normalizedMessage
      return normalizedMessage.id
    })
  })

  Object.entries(normalized.promotionHistory).forEach(([patientId, items]) => {
    patientPromotionHistoryIds[patientId] = items.map((item) => {
      const normalizedItem = normalizePromotionHistoryItem(item, patientId)
      promotionHistory[normalizedItem.id] = normalizedItem
      return normalizedItem.id
    })
  })

  if (audit) {
    const auditEvent = createAuditEvent(audit)
    auditEvents[auditEvent.id] = auditEvent
    auditEventIds.push(auditEvent.id)
  }

  return normalizeSnapshot({
    schemaVersion: DATA_STORE_SCHEMA_VERSION,
    patients: toRecord(normalized.patients),
    conversations: toRecord(normalized.conversations),
    messages,
    conversationMessageIds,
    humanMode: normalized.humanMode,
    promotionHistory,
    patientPromotionHistoryIds,
    appointments: toRecord(normalized.appointments),
    campaigns: toRecord(normalized.campaigns),
    benefits: toRecord(normalized.benefits),
    programMetrics: normalized.programMetrics,
    auditEvents,
    auditEventIds,
  })
}

export function snapshotToDemoState(snapshot: DataStoreSnapshot): DemoState {
  const normalized = normalizeSnapshot(snapshot)
  const patients = Object.values(normalized.patients)
  const conversations = Object.values(normalized.conversations)
  const patientById = normalized.patients
  const conversationMessages = Object.fromEntries(
    Object.entries(normalized.conversationMessageIds).map(([conversationId, messageIds]) => [
      conversationId,
      messageIds.map((id) => normalized.messages[id]).filter(Boolean),
    ]),
  )
  const promotionHistory = Object.fromEntries(
    Object.entries(normalized.patientPromotionHistoryIds).map(([patientId, itemIds]) => [
      patientId,
      itemIds.map((id) => normalized.promotionHistory[id]).filter(Boolean),
    ]),
  )

  return {
    patients,
    conversations,
    conversationMessages,
    humanMode: normalized.humanMode,
    promotionHistory,
    appointments: Object.values(normalized.appointments).map((appointment) => ({
      ...appointment,
      patient: patientById[appointment.patientId]?.name ?? appointment.patient,
    })),
    campaigns: Object.values(normalized.campaigns),
    benefits: Object.values(normalized.benefits),
    programMetrics: normalized.programMetrics,
    auditEvents: normalized.auditEventIds.map((id) => normalized.auditEvents[id]).filter(Boolean),
  }
}

export function normalizeDemoState(value: Partial<DemoState>): DemoState {
  const fallback = defaultDemoState
  const patients = (value.patients?.length ? value.patients : fallback.patients).map(normalizePatient)
  const patientByName = new Map(patients.map((patient) => [patient.name, patient.id]))
  const firstPatientId = patients[0]?.id ?? 'unknown-patient'

  return {
    patients,
    conversations: (value.conversations?.length ? value.conversations : fallback.conversations).map((conversation) =>
      normalizeConversation(conversation, patients),
    ),
    conversationMessages: normalizeConversationMessages(value.conversationMessages ?? {}),
    humanMode: value.humanMode ?? {},
    promotionHistory: normalizePromotionHistory(value.promotionHistory ?? {}),
    appointments: (value.appointments?.length ? value.appointments : fallback.appointments).map((appointment) =>
      normalizeAppointment(appointment, patientByName, firstPatientId),
    ),
    campaigns: value.campaigns?.length ? value.campaigns : fallback.campaigns,
    benefits: value.benefits?.length ? value.benefits : fallback.benefits,
    programMetrics: value.programMetrics ?? fallback.programMetrics,
    auditEvents: value.auditEvents ?? [],
  }
}

function normalizeSnapshot(snapshot: DataStoreSnapshot): DataStoreSnapshot {
  return {
    schemaVersion: DATA_STORE_SCHEMA_VERSION,
    patients: snapshot.patients ?? {},
    conversations: snapshot.conversations ?? {},
    messages: snapshot.messages ?? {},
    conversationMessageIds: snapshot.conversationMessageIds ?? {},
    humanMode: snapshot.humanMode ?? {},
    promotionHistory: snapshot.promotionHistory ?? {},
    patientPromotionHistoryIds: snapshot.patientPromotionHistoryIds ?? {},
    appointments: snapshot.appointments ?? {},
    campaigns: snapshot.campaigns ?? {},
    benefits: snapshot.benefits ?? {},
    programMetrics: snapshot.programMetrics ?? defaultDemoState.programMetrics,
    auditEvents: snapshot.auditEvents ?? {},
    auditEventIds: snapshot.auditEventIds ?? [],
  }
}

function normalizePatient(patient: Patient): Patient {
  return {
    ...patient,
    consent: patient.consent ?? {
      marketing: false,
      communication: true,
      updatedAt: DEFAULT_TIMESTAMP,
    },
  }
}

function normalizeConversation(conversation: Conversation, patients: Patient[]): Conversation {
  const patient = patients.find((item) => item.id === conversation.patientId)
  return patient
    ? {
        ...conversation,
        patientName: patient.name,
        initials: patient.initials,
        channel: patient.channel,
        temperature: patient.temperature,
        score: patient.score,
      }
    : conversation
}

function normalizeAppointment(
  appointment: Appointment,
  patientByName: Map<string, string>,
  fallbackPatientId: string,
): Appointment {
  const patientId = appointment.patientId ?? patientByName.get(appointment.patient) ?? fallbackPatientId
  return {
    ...appointment,
    patientId,
  }
}

function normalizeMessage(message: ChatMessage, conversationId: string): ChatMessage {
  return {
    ...message,
    conversationId: message.conversationId ?? conversationId,
    createdAt: message.createdAt ?? DEFAULT_TIMESTAMP,
  }
}

function normalizeConversationMessages(messages: DemoState['conversationMessages']) {
  return Object.fromEntries(
    Object.entries(messages).map(([conversationId, items]) => [
      conversationId,
      items.map((message) => normalizeMessage(message, conversationId)),
    ]),
  )
}

function normalizePromotionHistory(history: DemoState['promotionHistory']) {
  return Object.fromEntries(
    Object.entries(history).map(([patientId, items]) => [
      patientId,
      items.map((item) => normalizePromotionHistoryItem(item, patientId)),
    ]),
  )
}

function normalizePromotionHistoryItem(item: PromotionHistoryItem, patientId: string): PromotionHistoryItem {
  return {
    ...item,
    patientId: item.patientId ?? patientId,
  }
}

function createAuditEvent(input: AuditInput): AuditEvent {
  const now = new Date().toISOString()
  return {
    id: `audit-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    entity: input.entity,
    entityId: input.entityId,
    action: input.action,
    createdAt: now,
    actor: SYSTEM_ACTOR,
    metadata: input.metadata,
  }
}

function toRecord<T extends { id: string }>(items: T[]): EntityMap<T> {
  return Object.fromEntries(items.map((item) => [item.id, item]))
}

function readJson(raw: string | null): unknown {
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function isDataStoreSnapshot(value: unknown): value is DataStoreSnapshot {
  return Boolean(value && typeof value === 'object' && (value as DataStoreSnapshot).schemaVersion === DATA_STORE_SCHEMA_VERSION)
}
