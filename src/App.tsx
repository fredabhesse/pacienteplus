import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  Award,
  BarChart3,
  Bell,
  Bot,
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Filter,
  Gift,
  Grid2X2,
  LogOut,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Plus,
  Ribbon,
  Search,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserRound,
  Users,
  Zap,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import './App.css'
import {
  channelData,
  conversionData,
  defaultDemoState,
  type Appointment,
  type AppointmentStatus,
  type Benefit,
  type Campaign,
  type CampaignStage,
  type ChatMessage,
  type ContactChannel,
  type Conversation,
  type DemoState,
  type LeadTemperature,
  type LoyaltyLevel,
  type NavItem,
  type PageKey,
  type Patient,
  type PatientStatus,
  type PromotionHistoryItem,
} from './data'

const STORAGE_KEY = 'paciente-plus-demo-state'

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Visão Operacional', icon: Grid2X2 },
  { key: 'conversas', label: 'Conversas IA', icon: Bot },
  { key: 'agendamentos', label: 'Agendamentos', icon: CalendarDays },
  { key: 'pacientes', label: 'Pacientes', icon: Users },
  { key: 'campanhas', label: 'Campanhas', icon: BarChart3 },
  { key: 'programa', label: 'Programa Paciente+', icon: Ribbon },
  { key: 'configuracoes', label: 'Configurações', icon: Settings },
]

const pageTitles: Record<PageKey, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Visão Operacional',
    subtitle: 'MaterDei Agendamento Inteligente • Última atualização: agora',
  },
  conversas: {
    title: 'Conversas IA',
    subtitle: 'Interações em tempo real do chatbot com pacientes • Classificação por score de conversão',
  },
  agendamentos: {
    title: 'Agendamentos',
    subtitle: 'Gerencie sua agenda e solicitações de consulta',
  },
  pacientes: {
    title: 'Pacientes',
    subtitle: 'Base completa de pacientes e prontuários',
  },
  campanhas: {
    title: 'Campanhas Inteligentes',
    subtitle: 'Gestão de campanhas segmentadas e automação de marketing',
  },
  programa: {
    title: 'Fidelização e Benefícios',
    subtitle: 'Acompanhe a performance do programa de fidelidade, níveis de engajamento dos pacientes e métricas de retenção.',
  },
  configuracoes: {
    title: 'Configurações',
    subtitle: 'Preferências gerais do protótipo',
  },
}

function App() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard')
  const [conversationFocusPatientId, setConversationFocusPatientId] = useState<string | null>(null)
  const [demoState, setDemoState] = usePersistentDemoState()

  function resetDemo() {
    window.localStorage.removeItem(STORAGE_KEY)
    setDemoState(structuredClone(defaultDemoState))
  }

  function openConversationForPatient(patientId: string) {
    setConversationFocusPatientId(patientId)
    setActivePage('conversas')
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="main-panel">
        <Topbar />
        <div className="page-frame">
          <PageContent
            activePage={activePage}
            demoState={demoState}
            setDemoState={setDemoState}
            resetDemo={resetDemo}
            conversationFocusPatientId={conversationFocusPatientId}
            onOpenConversation={openConversationForPatient}
          />
        </div>
      </main>
    </div>
  )
}

function usePersistentDemoState(): [DemoState, React.Dispatch<React.SetStateAction<DemoState>>] {
  const [state, setState] = useState<DemoState>(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (!stored) return structuredClone(defaultDemoState)
      return normalizeDemoState(JSON.parse(stored))
    } catch {
      return structuredClone(defaultDemoState)
    }
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  return [state, setState]
}

function normalizeDemoState(value: Partial<DemoState>): DemoState {
  return {
    patients: value.patients?.length ? value.patients : defaultDemoState.patients,
    conversations: value.conversations?.length ? value.conversations : defaultDemoState.conversations,
    conversationMessages: value.conversationMessages ?? {},
    humanMode: value.humanMode ?? {},
    promotionHistory: value.promotionHistory ?? {},
    appointments: value.appointments?.length ? value.appointments : defaultDemoState.appointments,
    campaigns: value.campaigns?.length ? value.campaigns : defaultDemoState.campaigns,
    benefits: value.benefits?.length ? value.benefits : defaultDemoState.benefits,
    programMetrics: value.programMetrics ?? defaultDemoState.programMetrics,
  }
}

function Sidebar({
  activePage,
  onNavigate,
}: {
  activePage: PageKey
  onNavigate: (page: PageKey) => void
}) {
  return (
    <aside className="sidebar">
      <button className="brand" type="button" onClick={() => onNavigate('dashboard')}>
        <span className="brand-mark">
          <Calendar size={23} />
        </span>
        <span>
          MaterDei <strong>AI</strong>
        </span>
      </button>

      <nav className="nav-list" aria-label="Navegação principal">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              className={`nav-item ${activePage === item.key ? 'active' : ''}`}
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <button className="logout" type="button">
        <LogOut size={20} />
        <span>Sair do Sistema</span>
      </button>
    </aside>
  )
}

function Topbar() {
  return (
    <header className="topbar">
      <label className="global-search">
        <Search size={18} />
        <input placeholder="Buscar paciente, médico ou especialidade..." />
      </label>

      <div className="topbar-actions">
        <button className="icon-button notification" type="button" aria-label="Notificações">
          <Bell size={19} />
        </button>
        <div className="profile">
          <div className="profile-copy">
            <strong>Dr. Gestor</strong>
            <span>Diretor Operacional</span>
          </div>
          <div className="avatar-photo">DG</div>
        </div>
      </div>
    </header>
  )
}

function PageContent({
  activePage,
  demoState,
  setDemoState,
  resetDemo,
  conversationFocusPatientId,
  onOpenConversation,
}: {
  activePage: PageKey
  demoState: DemoState
  setDemoState: React.Dispatch<React.SetStateAction<DemoState>>
  resetDemo: () => void
  conversationFocusPatientId: string | null
  onOpenConversation: (patientId: string) => void
}) {
  if (activePage === 'dashboard') return <DashboardPage demoState={demoState} onOpenConversation={onOpenConversation} />
  if (activePage === 'conversas') {
    return (
      <ConversationsPage
        demoState={demoState}
        setDemoState={setDemoState}
        focusPatientId={conversationFocusPatientId}
      />
    )
  }
  if (activePage === 'agendamentos') return <AppointmentsPage demoState={demoState} setDemoState={setDemoState} />
  if (activePage === 'pacientes') {
    return <PatientsPage demoState={demoState} setDemoState={setDemoState} onOpenConversation={onOpenConversation} />
  }
  if (activePage === 'campanhas') return <CampaignsPage demoState={demoState} setDemoState={setDemoState} />
  if (activePage === 'programa') return <ProgramPage demoState={demoState} setDemoState={setDemoState} />
  return <SettingsPage demoState={demoState} resetDemo={resetDemo} />
}

function PageHeader({
  page,
  actions,
}: {
  page: PageKey
  actions?: React.ReactNode
}) {
  const content = pageTitles[page]
  return (
    <div className="page-header">
      <div>
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </div>
  )
}

function Button({
  children,
  variant = 'primary',
  icon,
  onClick,
  danger = false,
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  icon?: React.ReactNode
  onClick?: () => void
  danger?: boolean
}) {
  return (
    <button className={`button ${variant} ${danger ? 'danger' : ''}`} type="button" onClick={onClick}>
      {icon}
      <span>{children}</span>
    </button>
  )
}

function DashboardPage({
  demoState,
  onOpenConversation,
}: {
  demoState: DemoState
  onOpenConversation: (patientId: string) => void
}) {
  const loyalty = getLoyaltyDistribution(demoState.patients)
  const hotLeads = demoState.patients.filter((patient) => patient.temperature === 'Quente').length

  return (
    <>
      <PageHeader
        page="dashboard"
        actions={
          <>
            <Button variant="secondary" icon={<Calendar size={17} />}>
              Dados locais
            </Button>
            <Button icon={<Target size={17} />}>Metas do Mês</Button>
          </>
        }
      />

      <section className="kpi-grid">
        <KpiCard
          icon={<Clock3 size={25} />}
          tone="mint"
          label="Agendamentos Ativos"
          value={String(demoState.appointments.length)}
          detail={`${demoState.appointments.filter((item) => item.status === 'Conf.').length} confirmados na agenda`}
          trend="dados locais"
        />
        <KpiCard
          icon={<TrendingUp size={25} />}
          tone="blue"
          label="Taxa de Conversão Global"
          value="33%"
          detail={`${demoState.campaigns.length} campanhas acompanhadas`}
          trend="+5.2% vs mês ant."
        />
        <KpiCard
          icon={<Award size={25} />}
          tone="violet"
          label="NPS (Paciente+)"
          value={String(demoState.programMetrics.nps)}
          detail="Editável no Programa Paciente+"
          trend="+16 pontos"
        />
        <KpiCard
          icon={<Users size={25} />}
          tone="orange"
          label="Pacientes Cadastrados"
          value={String(demoState.patients.length)}
          detail={`${hotLeads} leads quentes em atendimento`}
          trend="+18% absoluto"
        />
      </section>

      <section className="dashboard-grid">
        <div className="card chart-card wide">
          <div className="section-title-row">
            <div>
              <h2>Evolução da Taxa de Conversão</h2>
              <p>Comparativo Real vs Meta Global</p>
            </div>
            <span className="soft-badge green">IA Ativa</span>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={conversionData} margin={{ top: 20, right: 18, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="conversionArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.26} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 5" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 60]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="6 6" fill="transparent" />
                <Area type="monotone" dataKey="real" stroke="#10b981" strokeWidth={3} fill="url(#conversionArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card channel-card">
          <h2>Performance por Canal</h2>
          <p>Distribuição de Agendamentos</p>
          <div className="donut-wrap">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie data={channelData} dataKey="value" innerRadius={58} outerRadius={82} startAngle={180} endAngle={0}>
                  {channelData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center">
              <strong>42%</strong>
              <span>WhatsApp</span>
            </div>
          </div>
          <div className="legend-list">
            {channelData.map((item) => (
              <div className="legend-row" key={item.name}>
                <span style={{ background: item.color }} />
                <p>{item.name}</p>
                <strong>{item.value}%</strong>
              </div>
            ))}
          </div>
        </div>

        <PriorityTable patients={demoState.patients} onOpenConversation={onOpenConversation} />
        <LoyaltyMiniCard levels={loyalty} />
      </section>
    </>
  )
}

function KpiCard({
  icon,
  tone,
  label,
  value,
  detail,
  trend,
}: {
  icon: React.ReactNode
  tone: string
  label: string
  value: string
  detail: string
  trend: string
}) {
  return (
    <article className="card kpi-card">
      <div className={`metric-icon ${tone}`}>{icon}</div>
      <span className="trend">↗ {trend}</span>
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  )
}

function PriorityTable({
  patients,
  onOpenConversation,
}: {
  patients: Patient[]
  onOpenConversation: (patientId: string) => void
}) {
  const warmCount = patients.filter((patient) => patient.temperature === 'Morno').length
  const hotCount = patients.filter((patient) => patient.temperature === 'Quente').length

  return (
    <div className="card priority-card wide">
      <div className="section-title-row">
        <div className="title-with-icon">
          <span className="alert-icon">!</span>
          <div>
            <h2>Priorização Inteligente</h2>
            <p>Score de Conversão em Tempo Real</p>
          </div>
        </div>
        <div className="status-pills">
          <span className="soft-badge hot">Quente ({hotCount})</span>
          <span className="soft-badge warm">Morno ({warmCount})</span>
        </div>
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Procedimento</th>
              <th>Canal / Espera</th>
              <th>Score IA</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {patients.slice(0, 5).map((patient, index) => (
              <tr key={patient.id}>
                <td>
                  <AvatarLine initials={patient.initials} name={patient.name} sub="" />
                </td>
                <td>{patient.interest}</td>
                <td>
                  <span className="channel-line">{patient.channel}</span>
                  <small>Aguarda há {index * 7 + 5} min</small>
                </td>
                <td>
                  <TemperatureBadge temperature={patient.temperature} score={patient.score} />
                </td>
                <td>
                  <div className="row-actions">
                    <button type="button" onClick={() => onOpenConversation(patient.id)} aria-label={`Conversar com ${patient.name}`}>
                      <MessageSquare size={18} />
                    </button>
                    <button type="button" onClick={() => onOpenConversation(patient.id)} aria-label={`Mais ações ${patient.name}`}>
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function LoyaltyMiniCard({ levels }: { levels: ReturnType<typeof getLoyaltyDistribution> }) {
  return (
    <div className="program-panel">
      <div className="panel-kicker">
        <Ribbon size={18} />
        Programa Paciente+
      </div>
      <h2>Níveis de Fidelidade</h2>
      <div className="loyalty-bars compact">
        {levels.map((level) => (
          <div className="loyalty-row dark" key={level.name}>
            <div>
              <span className="dot" style={{ background: level.color }} />
              <strong>{level.name}</strong>
            </div>
            <b>{level.percent}%</b>
            <div className="progress">
              <span style={{ width: `${level.percent}%`, background: level.color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mini-metrics">
        <div>
          <span>Retenção Esperada</span>
          <strong>60%</strong>
        </div>
        <div>
          <span>Ticket Médio</span>
          <strong>+22%</strong>
        </div>
      </div>
    </div>
  )
}

function ConversationsPage({
  demoState,
  setDemoState,
  focusPatientId,
}: {
  demoState: DemoState
  setDemoState: React.Dispatch<React.SetStateAction<DemoState>>
  focusPatientId: string | null
}) {
  const [filter, setFilter] = useState<'Todos' | LeadTemperature>('Todos')
  const [selectedId, setSelectedId] = useState(
    () => demoState.conversations.find((conversation) => conversation.patientId === focusPatientId)?.id ?? demoState.conversations[0]?.id ?? '',
  )
  const [draft, setDraft] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)

  const filteredConversations = useMemo(() => {
    return filter === 'Todos'
      ? demoState.conversations
      : demoState.conversations.filter((item) => item.temperature === filter)
  }, [demoState.conversations, filter])

  const selectedConversation =
    demoState.conversations.find((item) => item.id === selectedId) ?? filteredConversations[0] ?? demoState.conversations[0]
  const selectedPatient =
    demoState.patients.find((patient) => patient.id === selectedConversation?.patientId) ?? demoState.patients[0]
  const messages = selectedConversation
    ? [
        ...buildConversationMessages(selectedPatient.name, selectedPatient.interest),
        ...(demoState.conversationMessages[selectedConversation.id] ?? []),
      ]
    : []
  const isHuman = selectedConversation ? Boolean(demoState.humanMode[selectedConversation.id]) : false
  const patientInsights = selectedPatient ? getPatientInsights(selectedPatient) : []
  const patientPlusScore = selectedPatient ? getPatientPlusScore(selectedPatient) : 0

  function handleSend() {
    if (!draft.trim() || !selectedConversation) return
    const text = draft.trim()
    const message: ChatMessage = {
      id: createId('msg'),
      author: isHuman ? 'agent' : 'patient',
      text,
      time: 'Agora',
    }
    const botReply: ChatMessage | null = isHuman
      ? null
      : {
          id: createId('bot'),
          author: 'bot',
          text: buildBotReply(text, selectedPatient),
          time: 'Agora',
        }
    const nextMessages = botReply ? [message, botReply] : [message]
    setDemoState((current) => ({
      ...current,
      conversationMessages: {
        ...current.conversationMessages,
        [selectedConversation.id]: [...(current.conversationMessages[selectedConversation.id] ?? []), ...nextMessages],
      },
      conversations: current.conversations.map((conversation) =>
        conversation.id === selectedConversation.id
          ? {
              ...conversation,
              preview: (botReply?.text ?? message.text).slice(0, 48),
              unread: isHuman ? 0 : conversation.unread + 1,
              time: 'Agora',
            }
          : conversation,
      ),
    }))
    setDraft('')
  }

  function toggleHumanMode() {
    if (!selectedConversation) return
    setDemoState((current) => ({
      ...current,
      humanMode: {
        ...current.humanMode,
        [selectedConversation.id]: !current.humanMode[selectedConversation.id],
      },
    }))
  }

  return (
    <>
      <PageHeader
        page="conversas"
        actions={
          <span className={`live-badge ${isHuman ? 'human' : ''}`}>
            <Sparkles size={16} />
            {isHuman ? 'Atendimento humano ativo' : 'IA classificando em tempo real'}
          </span>
        }
      />

      <section className="conversation-layout">
        <aside className="conversation-list card">
          <label className="panel-search">
            <Search size={17} />
            <input placeholder="Buscar paciente..." />
          </label>
          <div className="filter-pills">
            {(['Todos', 'Quente', 'Morno', 'Frio'] as const).map((item) => (
              <button
                className={filter === item ? 'active' : ''}
                key={item}
                type="button"
                onClick={() => {
                  setFilter(item)
                  const next =
                    item === 'Todos'
                      ? demoState.conversations[0]
                      : demoState.conversations.find((row) => row.temperature === item)
                  if (next) setSelectedId(next.id)
                }}
              >
                {item} (
                {item === 'Todos'
                  ? demoState.conversations.length
                  : demoState.conversations.filter((row) => row.temperature === item).length}
                )
              </button>
            ))}
          </div>

          <div className="conversation-stack">
            {filteredConversations.map((conversation) => (
              <button
                className={`conversation-item ${selectedConversation?.id === conversation.id ? 'selected' : ''} ${
                  demoState.humanMode[conversation.id] ? 'human-assigned' : 'ai-assigned'
                }`}
                key={conversation.id}
                type="button"
                onClick={() => setSelectedId(conversation.id)}
              >
                <span className="avatar">{conversation.initials}</span>
                <span className="conversation-copy">
                  <strong>{conversation.patientName}</strong>
                  <small>{conversation.channel}</small>
                  <em>{conversation.preview}</em>
                  <TemperatureBadge temperature={conversation.temperature} score={conversation.score} />
                </span>
                <span className="conversation-meta">
                  <span className={`assignment-badge ${demoState.humanMode[conversation.id] ? 'human' : 'ai'}`}>
                    {demoState.humanMode[conversation.id] ? 'Humano' : 'IA'}
                  </span>
                  <small>{conversation.time}</small>
                  {conversation.unread ? <b>{conversation.unread}</b> : null}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className={`chat-card card ${isHuman ? 'human-mode' : 'ai-mode'}`}>
          <div className="chat-header">
            <AvatarLine
              initials={selectedConversation?.initials ?? '--'}
              name={selectedConversation?.patientName ?? 'Sem conversa'}
              sub={`${selectedConversation?.channel ?? 'Canal'} • ${isHuman ? 'Humano assumiu' : 'Online agora'}`}
            />
            <div className="chat-tools">
              <button className="tool-button" type="button" onClick={toggleHumanMode}>
                {isHuman ? 'Devolver para IA' : 'Assumir conversa'}
              </button>
              <Phone size={18} />
              <Filter size={18} />
            </div>
          </div>
          <div className="chat-body">
            <span className="day-chip">Hoje</span>
            {messages.map((message) => (
              <div className={`message-row ${message.author}`} key={message.id}>
                {message.author === 'bot' ? (
                  <span className="message-bot-icon">
                    <Bot size={15} />
                  </span>
                ) : null}
                <div className="message-bubble">
                  {message.text.split('\n').map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </div>
                <small>{message.time}</small>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              value={draft}
              placeholder={isHuman ? 'Digite a resposta do atendente...' : 'Digite como paciente para simular o bot...'}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleSend()
              }}
            />
            <Button icon={<Send size={16} />} onClick={handleSend}>
              Enviar
            </Button>
          </div>
        </section>

        <aside className="patient-inspector card">
          <div className="inspector-profile">
            <span className="avatar large">{selectedConversation?.initials ?? '--'}</span>
            <h2>{selectedConversation?.patientName ?? 'Sem paciente'}</h2>
            <p>{selectedPatient?.phone}</p>
          </div>

          <div className="inspector-section">
            <span className="inspector-label">Classificação do Lead</span>
            <div className={`score-box ${selectedPatient?.temperature.toLowerCase() ?? ''}`}>
              <div>
                <Zap size={22} />
                <strong>{selectedPatient?.temperature}</strong>
              </div>
              <b>{selectedPatient?.score}</b>
              <span />
              <small>Score de conversão calculado pela IA</small>
            </div>
            <div className="score-scale">
              <span>
                Quente
                <br />
                80-100
              </span>
              <span>
                Morno
                <br />
                50-79
              </span>
              <span>
                Frio
                <br />
                0-49
              </span>
            </div>
          </div>

          <div className="inspector-section">
            <span className="inspector-label">Programa Paciente+</span>
            <div className="level-card">
              <Award size={24} />
              <div>
                <span>Nível</span>
                <strong>{selectedPatient?.level}</strong>
              </div>
              <b>{patientPlusScore.toLocaleString('pt-BR')}</b>
            </div>
          </div>

          <div className="inspector-section">
            <span className="inspector-label">Interesse Atual</span>
            <div className="interest-box">
              <strong>{selectedPatient?.interest}</strong>
              <span>via {selectedPatient?.channel}</span>
            </div>
          </div>

          <div className="inspector-section">
            <span className="inspector-label">Insights da IA</span>
            <ul className="insights highlighted">
              {patientInsights.map((insight) => (
                <li key={insight}>{insight}</li>
              ))}
            </ul>
          </div>

          <Button onClick={() => setProfileOpen(true)}>Ver perfil completo</Button>
        </aside>
      </section>

      {profileOpen && selectedPatient ? (
        <PatientDetailsModal
          patient={selectedPatient}
          appointments={demoState.appointments.filter((appointment) => appointment.patient === selectedPatient.name)}
          conversation={selectedConversation}
          messages={selectedConversation ? demoState.conversationMessages[selectedConversation.id] ?? [] : []}
          promotionHistory={demoState.promotionHistory[selectedPatient.id] ?? []}
          onClose={() => setProfileOpen(false)}
        />
      ) : null}
    </>
  )
}

function AppointmentsPage({
  demoState,
  setDemoState,
}: {
  demoState: DemoState
  setDemoState: React.Dispatch<React.SetStateAction<DemoState>>
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Appointment | null>(null)
  const [filter, setFilter] = useState<'Todos' | AppointmentStatus>('Todos')
  const [form, setForm] = useState(() => appointmentToForm())
  const days = Array.from({ length: 35 }, (_, index) => index + 1)
  const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const visibleAppointments =
    filter === 'Todos' ? demoState.appointments : demoState.appointments.filter((item) => item.status === filter)
  const upcomingAppointments = [...visibleAppointments].sort((a, b) => `${a.day}-${a.time}`.localeCompare(`${b.day}-${b.time}`))

  function openNewAppointment() {
    setEditing(null)
    setForm(appointmentToForm())
    setModalOpen(true)
  }

  function openAppointment(appointment: Appointment) {
    setEditing(appointment)
    setForm(appointmentToForm(appointment))
    setModalOpen(true)
  }

  function saveAppointment() {
    if (!form.patient.trim() || !form.specialty.trim() || !form.time.trim()) return
    const next: Appointment = {
      id: editing?.id ?? createId('appt'),
      day: clampNumber(Number(form.day), 1, 35),
      time: form.time,
      specialty: form.specialty.trim(),
      patient: form.patient.trim(),
      doctor: form.doctor.trim() || 'Equipe MaterDei',
      tone: statusToTone(form.status),
      status: form.status,
      mode: form.mode.trim() || 'Consulta',
    }
    setDemoState((current) => ({
      ...current,
      appointments: editing
        ? current.appointments.map((item) => (item.id === editing.id ? next : item))
        : [...current.appointments, next],
    }))
    setModalOpen(false)
  }

  function deleteAppointment() {
    if (!editing) return
    setDemoState((current) => ({
      ...current,
      appointments: current.appointments.filter((item) => item.id !== editing.id),
    }))
    setModalOpen(false)
  }

  return (
    <>
      <PageHeader
        page="agendamentos"
        actions={
          <>
            <label className="select-control">
              <Filter size={16} />
              <select value={filter} onChange={(event) => setFilter(event.target.value as 'Todos' | AppointmentStatus)}>
                <option>Todos</option>
                <option>Conf.</option>
                <option>Esp.</option>
                <option>Online</option>
              </select>
            </label>
            <Button icon={<Plus size={17} />} onClick={openNewAppointment}>
              Novo Agendamento
            </Button>
          </>
        }
      />

      <section className="schedule-layout">
        <div className="card calendar-card">
          <div className="calendar-head">
            <h2>Dezembro 2025</h2>
            <div className="calendar-nav">
              <button type="button" aria-label="Mês anterior">
                <ChevronLeft size={18} />
              </button>
              <button type="button" aria-label="Próximo mês">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="calendar-weekdays">
            {dayLabels.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar-grid">
            <div className="calendar-cell muted">
              <span>30</span>
            </div>
            {days.map((day) => {
              const dayAppointments = visibleAppointments.filter((item) => item.day === day)
              return (
                <div className={`calendar-cell ${day === 3 ? 'today' : ''}`} key={day}>
                  <span>{day}</span>
                  {dayAppointments.length > 0 ? <em>{dayAppointments.length} agend.</em> : null}
                  {dayAppointments.map((appointment) => (
                    <button
                      className={`appointment-chip ${appointment.tone}`}
                      key={appointment.id}
                      type="button"
                      onClick={() => openAppointment(appointment)}
                    >
                      <strong>{appointment.time}</strong>
                      <span>{appointment.specialty}</span>
                      <b>{appointment.patient}</b>
                      <small>{appointment.doctor}</small>
                    </button>
                  ))}
                </div>
              )
            })}
            <div className="calendar-cell muted">
              <span>1</span>
            </div>
            <div className="calendar-cell muted">
              <span>2</span>
            </div>
            <div className="calendar-cell muted">
              <span>3</span>
            </div>
          </div>
        </div>

        <aside className="card appointments-panel">
          <h2>Próximos Atendimentos</h2>
          <div className="appointment-list">
            {upcomingAppointments.slice(0, 6).map((appointment) => (
              <button className="next-appointment" key={appointment.id} type="button" onClick={() => openAppointment(appointment)}>
                <strong>{appointment.time}</strong>
                <div>
                  <b>{appointment.patient}</b>
                  <span>{appointment.specialty}</span>
                  <small>{appointment.mode}</small>
                </div>
                <em>{appointment.doctor}</em>
                <span className={`status-tag ${appointment.status.toLowerCase().replace('.', '')}`}>{appointment.status}</span>
              </button>
            ))}
          </div>
        </aside>
      </section>

      {modalOpen ? (
        <Modal title={editing ? 'Editar Agendamento' : 'Novo Agendamento'} onClose={() => setModalOpen(false)}>
          <div className="form-grid">
            <label>
              Paciente*
              <select value={form.patient} onChange={(event) => setForm({ ...form, patient: event.target.value })}>
                <option value="">Selecione um paciente</option>
                {demoState.patients.map((patient) => (
                  <option value={patient.name} key={patient.id}>
                    {patient.name}
                  </option>
                ))}
                {form.patient && !demoState.patients.some((patient) => patient.name === form.patient) ? (
                  <option value={form.patient}>{form.patient}</option>
                ) : null}
              </select>
            </label>
            <label>
              Especialidade*
              <input value={form.specialty} placeholder="Especialidade ou exame" onChange={(event) => setForm({ ...form, specialty: event.target.value })} />
            </label>
            <label>
              Dia
              <input type="number" min={1} max={35} value={form.day} onChange={(event) => setForm({ ...form, day: event.target.value })} />
            </label>
            <label>
              Horário*
              <input value={form.time} placeholder="09:00" onChange={(event) => setForm({ ...form, time: event.target.value })} />
            </label>
            <label>
              Médico
              <input value={form.doctor} placeholder="Dr. Silva" onChange={(event) => setForm({ ...form, doctor: event.target.value })} />
            </label>
            <label>
              Modalidade
              <input value={form.mode} placeholder="Consulta" onChange={(event) => setForm({ ...form, mode: event.target.value })} />
            </label>
            <label>
              Status
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as AppointmentStatus })}>
                <option>Conf.</option>
                <option>Esp.</option>
                <option>Online</option>
              </select>
            </label>
          </div>
          <div className="modal-actions split">
            {editing ? (
              <Button variant="secondary" danger onClick={deleteAppointment}>
                Excluir
              </Button>
            ) : <span />}
            <div>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveAppointment}>Salvar</Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  )
}

function PatientsPage({
  demoState,
  setDemoState,
  onOpenConversation,
}: {
  demoState: DemoState
  setDemoState: React.Dispatch<React.SetStateAction<DemoState>>
  onOpenConversation: (patientId: string) => void
}) {
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Patient | null>(null)
  const [detailsPatient, setDetailsPatient] = useState<Patient | null>(null)
  const [actionsPatient, setActionsPatient] = useState<Patient | null>(null)
  const [levelInfoPatient, setLevelInfoPatient] = useState<Patient | null>(null)
  const [promotionChannel, setPromotionChannel] = useState<'email' | 'mensagem' | null>(null)
  const [actionNotice, setActionNotice] = useState('')
  const [form, setForm] = useState(() => patientToForm())
  const filteredPatients = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return demoState.patients
    return demoState.patients.filter((patient) =>
      [patient.name, patient.cpf, patient.phone, patient.plan].some((value) => value.toLowerCase().includes(normalized)),
    )
  }, [demoState.patients, query])

  function openNewPatient() {
    setEditing(null)
    setForm(patientToForm())
    setModalOpen(true)
  }

  function openPatient(patient: Patient) {
    setEditing(patient)
    setForm(patientToForm(patient))
    setModalOpen(true)
  }

  function savePatient() {
    if (!form.name.trim() || !form.phone.trim() || !form.plan.trim()) return
    const patient: Patient = {
      id: editing?.id ?? createId('pat'),
      initials: getInitials(form.name),
      name: form.name.trim(),
      cpf: form.cpf.trim() || '123.***.***-**',
      phone: form.phone.trim(),
      status: form.status,
      lastVisit: form.lastVisit.trim() || '-',
      plan: form.plan.trim(),
      level: form.level,
      score: clampNumber(Number(form.score), 0, 100),
      temperature: scoreToTemperature(Number(form.score)),
      channel: form.channel,
      interest: form.interest.trim() || 'Consulta Geral',
    }
    setDemoState((current) => ({
      ...current,
      patients: editing ? current.patients.map((item) => (item.id === editing.id ? patient : item)) : [...current.patients, patient],
    }))
    setModalOpen(false)
  }

  function deletePatient() {
    if (!editing) return
    setDemoState((current) => ({
      ...current,
      patients: current.patients.filter((item) => item.id !== editing.id),
      conversations: current.conversations.filter((conversation) => conversation.patientId !== editing.id),
    }))
    setModalOpen(false)
  }

  function togglePatientStatus(patient: Patient) {
    const nextStatus: PatientStatus = patient.status === 'Ativo' ? 'Inativo' : 'Ativo'
    setDemoState((current) => ({
      ...current,
      patients: current.patients.map((item) => (item.id === patient.id ? { ...item, status: nextStatus } : item)),
    }))
    setActionsPatient((current) => (current ? { ...current, status: nextStatus } : current))
    setActionNotice(`${patient.name} agora está ${nextStatus.toLowerCase()}.`)
  }

  function sendPromotion(patient: Patient, channel: 'email' | 'mensagem', benefit: Benefit) {
    const historyItem: PromotionHistoryItem = {
      id: createId('promo-history'),
      date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
      promotion: benefit.name,
      channel: channel === 'email' ? 'E-mail' : 'Mensagem',
    }

    if (channel === 'mensagem') {
      const conversation = demoState.conversations.find((item) => item.patientId === patient.id)
      if (conversation) {
        const message: ChatMessage = {
          id: createId('promo'),
          author: 'agent',
          text: `Olá ${patient.name.split(' ')[0]}! Separei a promoção "${benefit.name}" do Paciente+ para apoiar seu interesse em ${patient.interest.toLowerCase()}. Quer que eu te envie os detalhes?`,
          time: 'Agora',
        }
        setDemoState((current) => ({
          ...current,
          promotionHistory: {
            ...current.promotionHistory,
            [patient.id]: [historyItem, ...(current.promotionHistory[patient.id] ?? [])],
          },
          conversationMessages: {
            ...current.conversationMessages,
            [conversation.id]: [...(current.conversationMessages[conversation.id] ?? []), message],
          },
          conversations: current.conversations.map((item) =>
            item.id === conversation.id ? { ...item, preview: message.text.slice(0, 48), time: 'Agora' } : item,
          ),
        }))
      }
    } else {
      setDemoState((current) => ({
        ...current,
        promotionHistory: {
          ...current.promotionHistory,
          [patient.id]: [historyItem, ...(current.promotionHistory[patient.id] ?? [])],
        },
      }))
    }
    setActionNotice(
      channel === 'email'
        ? `Promoção "${benefit.name}" por e-mail registrada para ${patient.name}.`
        : `Promoção "${benefit.name}" adicionada à conversa de ${patient.name}.`,
    )
    setPromotionChannel(null)
  }

  return (
    <>
      <PageHeader
        page="pacientes"
        actions={
          <Button icon={<UserRound size={17} />} onClick={openNewPatient}>
            Novo Paciente
          </Button>
        }
      />

      <section className="card patients-card">
        <div className="table-toolbar">
          <label className="panel-search">
            <Search size={17} />
            <input
              value={query}
              placeholder="Buscar por nome, CPF ou telefone..."
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <Button variant="secondary" icon={<Filter size={17} />}>
            Filtros Avançados
          </Button>
        </div>

        <div className="table-scroll">
          <table className="data-table patient-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Status</th>
                <th>Última Consulta</th>
                <th>Plano de Saúde</th>
                <th>Paciente+</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <AvatarLine initials={patient.initials} name={patient.name} sub={`CPF: ${patient.cpf}`} />
                  </td>
                  <td>
                    <span className={`status-pill ${patient.status.toLowerCase()}`}>{patient.status}</span>
                  </td>
                  <td>{patient.lastVisit}</td>
                  <td>{patient.plan}</td>
                  <td>
                    <button
                      className={`level-pill ${patient.level.toLowerCase()}`}
                      type="button"
                      onClick={() => setLevelInfoPatient(patient)}
                    >
                      {patient.level}
                    </button>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button type="button" onClick={() => setDetailsPatient(patient)} aria-label={`Abrir ${patient.name}`}>
                        <Activity size={18} />
                      </button>
                      <button type="button" onClick={() => openPatient(patient)} aria-label={`Editar ${patient.name}`}>
                        <FileText size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActionsPatient(patient)
                          setPromotionChannel(null)
                          setActionNotice('')
                        }}
                        aria-label={`Mais ações ${patient.name}`}
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen ? (
        <Modal title={editing ? 'Ficha do Paciente' : 'Novo Paciente'} onClose={() => setModalOpen(false)}>
          <div className="form-grid">
            <label>
              Nome*
              <input value={form.name} placeholder="Nome completo" onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label>
              Telefone*
              <input value={form.phone} placeholder="+55 31..." onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            </label>
            <label>
              CPF
              <input value={form.cpf} placeholder="123.***.***-**" onChange={(event) => setForm({ ...form, cpf: event.target.value })} />
            </label>
            <label>
              Plano*
              <input value={form.plan} placeholder="Unimed" onChange={(event) => setForm({ ...form, plan: event.target.value })} />
            </label>
            <label>
              Última consulta
              <input value={form.lastVisit} placeholder="10/10/2023" onChange={(event) => setForm({ ...form, lastVisit: event.target.value })} />
            </label>
            <label>
              Interesse
              <input value={form.interest} placeholder="Ressonância Magnética" onChange={(event) => setForm({ ...form, interest: event.target.value })} />
            </label>
            <label>
              Status
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as PatientStatus })}>
                <option>Ativo</option>
                <option>Inativo</option>
                <option>Pendente</option>
              </select>
            </label>
            <label>
              Nível
              <select value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value as LoyaltyLevel })}>
                <option>Ouro</option>
                <option>Prata</option>
                <option>Bronze</option>
              </select>
            </label>
            <label>
              Canal
              <select value={form.channel} onChange={(event) => setForm({ ...form, channel: event.target.value as ContactChannel })}>
                <option>WhatsApp</option>
                <option>Site</option>
                <option>Telefone</option>
              </select>
            </label>
            <label>
              Score IA
              <input type="number" min={0} max={100} value={form.score} onChange={(event) => setForm({ ...form, score: event.target.value })} />
            </label>
          </div>
          <div className="modal-actions split">
            {editing ? (
              <Button variant="secondary" danger onClick={deletePatient}>
                Excluir
              </Button>
            ) : <span />}
            <div>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={savePatient}>Salvar</Button>
            </div>
          </div>
        </Modal>
      ) : null}

      {detailsPatient ? (
        <PatientDetailsModal
          patient={detailsPatient}
          appointments={demoState.appointments.filter((appointment) => appointment.patient === detailsPatient.name)}
          conversation={demoState.conversations.find((conversation) => conversation.patientId === detailsPatient.id)}
          messages={(() => {
            const conversation = demoState.conversations.find((item) => item.patientId === detailsPatient.id)
            return conversation ? demoState.conversationMessages[conversation.id] ?? [] : []
          })()}
          onClose={() => setDetailsPatient(null)}
        />
      ) : null}

      {levelInfoPatient ? (
        <Modal title={`Categoria ${levelInfoPatient.level}`} onClose={() => setLevelInfoPatient(null)}>
          <div className="level-explain">
            <div className="patient-detail-hero">
              <span className="avatar large">{levelInfoPatient.initials}</span>
              <div>
                <h3>{levelInfoPatient.name}</h3>
                <p>{levelInfoPatient.plan} • score IA {levelInfoPatient.score}</p>
              </div>
              <span className={`level-pill ${levelInfoPatient.level.toLowerCase()}`}>{levelInfoPatient.level}</span>
            </div>
            <ul>
              {getLevelReasons(levelInfoPatient).map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
          <div className="modal-actions">
            <Button onClick={() => setLevelInfoPatient(null)}>Fechar</Button>
          </div>
        </Modal>
      ) : null}

      {actionsPatient ? (
        <Modal title={`Ações para ${actionsPatient.name}`} onClose={() => setActionsPatient(null)}>
          <div className="action-panel">
            <p>
              Status atual: <strong>{actionsPatient.status}</strong> • Categoria Paciente+: <strong>{actionsPatient.level}</strong>
            </p>
            <button type="button" onClick={() => togglePatientStatus(actionsPatient)}>
              <UserRound size={18} />
              {actionsPatient.status === 'Ativo' ? 'Desativar paciente' : 'Ativar paciente'}
            </button>
            <button type="button" onClick={() => onOpenConversation(actionsPatient.id)}>
              <MessageSquare size={18} />
              Abrir troca de mensagens
            </button>
            <button type="button" onClick={() => setPromotionChannel('email')}>
              <Mail size={18} />
              Enviar promoção por e-mail
            </button>
            <button type="button" onClick={() => setPromotionChannel('mensagem')}>
              <MessageSquare size={18} />
              Enviar promoção por mensagem
            </button>
            {promotionChannel ? (
              <div className="promotion-picker">
                <strong>Selecione a promoção</strong>
                {demoState.benefits.map((benefit) => (
                  <button type="button" key={benefit.id} onClick={() => sendPromotion(actionsPatient, promotionChannel, benefit)}>
                    <Gift size={17} />
                    <span>
                      {benefit.name}
                      <small>{benefit.demand} • nota {benefit.score}</small>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
            {actionNotice ? <span className="action-notice">{actionNotice}</span> : null}
            <div className="promotion-history">
              <strong>Histórico de promoções</strong>
              {(demoState.promotionHistory[actionsPatient.id] ?? []).length ? (
                (demoState.promotionHistory[actionsPatient.id] ?? []).map((item) => (
                  <div className="promotion-history-row" key={item.id}>
                    <span>{item.date}</span>
                    <b>{item.promotion}</b>
                    <em>{item.channel}</em>
                  </div>
                ))
              ) : (
                <small>Nenhuma promoção enviada até agora.</small>
              )}
            </div>
          </div>
          <div className="modal-actions">
            <Button onClick={() => setActionsPatient(null)}>Concluir</Button>
          </div>
        </Modal>
      ) : null}
    </>
  )
}

function PatientDetailsModal({
  patient,
  appointments,
  conversation,
  messages,
  promotionHistory = [],
  onClose,
}: {
  patient: Patient
  appointments: Appointment[]
  conversation?: Conversation
  messages: ChatMessage[]
  promotionHistory?: PromotionHistoryItem[]
  onClose: () => void
}) {
  const interactionMessages = [...buildConversationMessages(patient.name, patient.interest), ...messages].slice(-5)

  return (
    <Modal title={`Interações de ${patient.name}`} onClose={onClose} wide>
      <div className="patient-detail-panel">
        <div className="patient-detail-hero">
          <span className="avatar large">{patient.initials}</span>
          <div>
            <h3>{patient.name}</h3>
            <p>{patient.phone}</p>
          </div>
          <span className={`level-pill ${patient.level.toLowerCase()}`}>{patient.level}</span>
        </div>

        <div className="detail-grid">
          <div>
            <small>Última consulta</small>
            <strong>{patient.lastVisit}</strong>
          </div>
          <div>
            <small>Plano</small>
            <strong>{patient.plan}</strong>
          </div>
          <div>
            <small>Status</small>
            <strong>{patient.status}</strong>
          </div>
          <div>
            <small>Score IA</small>
            <strong>{patient.score}</strong>
          </div>
        </div>

        <section>
          <h3>Interesse atual</h3>
          <p>{patient.interest} via {patient.channel}</p>
        </section>

        <section>
          <h3>Perfil Paciente+</h3>
          <div className="profile-summary-grid">
            <span>Categoria <strong>{patient.level}</strong></span>
            <span>Temperatura <strong>{patient.temperature}</strong></span>
            <span>Canal preferencial <strong>{patient.channel}</strong></span>
          </div>
        </section>

        <section>
          <h3>Próximos agendamentos</h3>
          {appointments.length ? (
            appointments.map((appointment) => (
              <div className="detail-row" key={appointment.id}>
                <strong>{appointment.time}</strong>
                <span>{appointment.specialty} • dia {appointment.day} • {appointment.doctor}</span>
                <em>{appointment.status}</em>
              </div>
            ))
          ) : (
            <p>Nenhum agendamento futuro cadastrado.</p>
          )}
        </section>

        <section>
          <h3>Histórico da conversa</h3>
          <p>{conversation ? `${conversation.channel} • última interação ${conversation.time}` : 'Sem conversa ativa.'}</p>
          <div className="interaction-list">
            {interactionMessages.map((message) => (
              <div className={`interaction-row ${message.author}`} key={message.id}>
                <strong>{message.author === 'bot' ? 'Bot' : message.author === 'agent' ? 'Atendente' : patient.name}</strong>
                <span>{message.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3>Promoções enviadas</h3>
          {promotionHistory.length ? (
            <div className="promotion-history compact">
              {promotionHistory.map((item) => (
                <div className="promotion-history-row" key={item.id}>
                  <strong>{item.promotion}</strong>
                  <span>{item.date}</span>
                  <em>{item.channel}</em>
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhuma promoção registrada para este paciente.</p>
          )}
        </section>
      </div>
      <div className="modal-actions">
        <Button onClick={onClose}>Fechar</Button>
      </div>
    </Modal>
  )
}

function CampaignsPage({
  demoState,
  setDemoState,
}: {
  demoState: DemoState
  setDemoState: React.Dispatch<React.SetStateAction<DemoState>>
}) {
  const [activeTab, setActiveTab] = useState<CampaignStage>('Ativas')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Campaign | null>(null)
  const [form, setForm] = useState(() => campaignToForm())
  const filteredCampaigns = demoState.campaigns.filter((campaign) => campaign.stage === activeTab)
  const activeCampaigns = demoState.campaigns.filter((campaign) => campaign.stage === 'Ativas')
  const totalReach = demoState.campaigns.length
  const bestCampaign = activeCampaigns[0]

  function openNewCampaign() {
    setEditing(null)
    setForm(campaignToForm({ stage: activeTab }))
    setModalOpen(true)
  }

  function openCampaign(campaign: Campaign) {
    setEditing(campaign)
    setForm(campaignToForm(campaign))
    setModalOpen(true)
  }

  function saveCampaign() {
    if (!form.name.trim() || !form.channel.trim() || !form.audience.trim()) return
    const campaign: Campaign = {
      id: editing?.id ?? createId('camp'),
      name: form.name.trim(),
      channel: form.channel.trim(),
      audience: form.audience.trim(),
      reach: form.reach.trim() || '0',
      conversion: form.conversion.trim() || '0%',
      status: form.status.trim() || 'Em andamento',
      stage: form.stage,
    }
    setDemoState((current) => ({
      ...current,
      campaigns: editing
        ? current.campaigns.map((item) => (item.id === editing.id ? campaign : item))
        : [...current.campaigns, campaign],
    }))
    setActiveTab(campaign.stage)
    setModalOpen(false)
  }

  return (
    <>
      <PageHeader
        page="campanhas"
        actions={
          <Button icon={<Send size={17} />} onClick={openNewCampaign}>
            Nova Campanha
          </Button>
        }
      />

      <section className="campaign-stat-grid">
        <article className="campaign-stat blue">
          <div className="campaign-stat-head">
            <span className="metric-icon">
              <MessageSquare size={23} />
            </span>
            <span className="soft-badge">Campanhas</span>
          </div>
          <strong>{demoState.campaigns.length}</strong>
          <p>Campanhas cadastradas</p>
          <small>{activeCampaigns.length} ativas agora</small>
        </article>
        <article className="campaign-stat green">
          <div className="campaign-stat-head">
            <span className="metric-icon">
              <Sparkles size={23} />
            </span>
            <span className="soft-badge">CTR Global</span>
          </div>
          <strong>{bestCampaign?.conversion ?? '0%'}</strong>
          <p>Melhor conversão</p>
          <small>Dados editáveis na campanha</small>
        </article>
        <article className="campaign-stat purple">
          <div className="campaign-stat-head">
            <span className="metric-icon">
              <TrendingUp size={23} />
            </span>
            <span className="soft-badge">ROI</span>
          </div>
          <strong>{totalReach}x</strong>
          <p>Retorno sobre Investimento</p>
          <small>R$ 1 investido = R$ {totalReach} retorno</small>
        </article>
      </section>

      <div className="tabs">
        {(['Ativas', 'Agendadas', 'Finalizadas'] as const).map((tab) => (
          <button className={activeTab === tab ? 'active' : ''} key={tab} type="button" onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      <section className="campaign-list">
        {filteredCampaigns.map((campaign) => (
          <article className="campaign-row card" key={campaign.id}>
            <div>
              <h2>{campaign.name}</h2>
              <p>
                {campaign.channel} • Público: {campaign.audience}
              </p>
            </div>
            <span className="soft-badge green">{campaign.status}</span>
            <div className="campaign-numbers">
              <div>
                <span>Alcance</span>
                <strong>{campaign.reach}</strong>
              </div>
              <div>
                <span>Conversão</span>
                <strong>{campaign.conversion}</strong>
              </div>
              <button type="button" onClick={() => openCampaign(campaign)}>
                Detalhes
              </button>
            </div>
          </article>
        ))}
      </section>

      {modalOpen ? (
        <Modal title={editing ? 'Detalhes da Campanha' : 'Nova Campanha'} onClose={() => setModalOpen(false)}>
          <div className="form-grid">
            <label>
              Nome*
              <input value={form.name} placeholder="Campanha de check-up" onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label>
              Canal*
              <input value={form.channel} placeholder="WhatsApp + Email" onChange={(event) => setForm({ ...form, channel: event.target.value })} />
            </label>
            <label>
              Público*
              <input value={form.audience} placeholder="Pacientes recorrentes" onChange={(event) => setForm({ ...form, audience: event.target.value })} />
            </label>
            <label>
              Status
              <input value={form.status} placeholder="Em andamento" onChange={(event) => setForm({ ...form, status: event.target.value })} />
            </label>
            <label>
              Alcance
              <input value={form.reach} placeholder="1.2k" onChange={(event) => setForm({ ...form, reach: event.target.value })} />
            </label>
            <label>
              Conversão
              <input value={form.conversion} placeholder="8.5%" onChange={(event) => setForm({ ...form, conversion: event.target.value })} />
            </label>
            <label>
              Etapa
              <select value={form.stage} onChange={(event) => setForm({ ...form, stage: event.target.value as CampaignStage })}>
                <option>Ativas</option>
                <option>Agendadas</option>
                <option>Finalizadas</option>
              </select>
            </label>
          </div>
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveCampaign}>Salvar</Button>
          </div>
        </Modal>
      ) : null}
    </>
  )
}

function ProgramPage({
  demoState,
  setDemoState,
}: {
  demoState: DemoState
  setDemoState: React.Dispatch<React.SetStateAction<DemoState>>
}) {
  const [benefitModal, setBenefitModal] = useState<Benefit | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<LoyaltyLevel | null>(null)
  const [metricsOpen, setMetricsOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [benefitForm, setBenefitForm] = useState(() => benefitToForm())
  const [metricsForm, setMetricsForm] = useState(() => ({
    nps: String(demoState.programMetrics.nps),
    retention: String(demoState.programMetrics.retention),
    redemptions: String(demoState.programMetrics.redemptions),
  }))
  const loyaltyLevels = getLoyaltyDistribution(demoState.patients)

  function openBenefit(benefit: Benefit) {
    setBenefitModal(benefit)
    setBenefitForm(benefitToForm(benefit))
  }

  function saveBenefit() {
    if (!benefitModal || !benefitForm.name.trim()) return
    setDemoState((current) => ({
      ...current,
      benefits: current.benefits.map((benefit) =>
        benefit.id === benefitModal.id
          ? {
              ...benefit,
              name: benefitForm.name.trim(),
              demand: benefitForm.demand.trim() || 'MÉDIA PROCURA',
              score: benefitForm.score.trim() || '8.0',
            }
          : benefit,
      ),
    }))
    setBenefitModal(null)
  }

  function saveMetrics() {
    setDemoState((current) => ({
      ...current,
      programMetrics: {
        nps: clampNumber(Number(metricsForm.nps), 0, 100),
        retention: clampNumber(Number(metricsForm.retention), 0, 100),
        redemptions: Math.max(0, Number(metricsForm.redemptions) || 0),
      },
    }))
    setMetricsOpen(false)
  }

  return (
    <>
      <section className="program-hero">
        <div className="panel-kicker">
          <Ribbon size={18} />
          Programa Paciente+
        </div>
        <h1>Fidelização e Benefícios</h1>
        <p>{pageTitles.programa.subtitle}</p>
        <div className="hero-actions">
          <Button onClick={() => setMetricsOpen(true)}>Editar Métricas</Button>
          <Button variant="ghost" onClick={() => setReportOpen(true)}>
            Ver Relatórios
          </Button>
        </div>
      </section>

      <section className="program-kpis">
        <KpiCard icon={<Star size={25} />} tone="gold" label="NPS Global" value={String(demoState.programMetrics.nps)} detail="Zona de Excelência" trend="+16 pts" />
        <KpiCard icon={<Users size={25} />} tone="mint" label="Taxa de Retenção" value={`${demoState.programMetrics.retention}%`} detail="Meta anual superada" trend="+90%" />
        <KpiCard icon={<Gift size={25} />} tone="blue" label="Benefícios Resgatados" value={demoState.programMetrics.redemptions.toLocaleString('pt-BR')} detail="Descontos e check-ups" trend="este mês" />
      </section>

      <section className="program-content">
        <div className="card loyalty-card">
          <h2>Distribuição por Categoria</h2>
          <p>Base ativa de pacientes no programa</p>
          <div className="loyalty-bars">
            {loyaltyLevels.map((level) => (
              <button className="loyalty-row interactive" key={level.name} type="button" onClick={() => setSelectedLevel(level.name)}>
                <div>
                  <span className="dot" style={{ background: level.color }} />
                  <strong>{level.name}</strong>
                </div>
                <b>
                  {level.count} pacientes ({level.percent}%)
                </b>
                <div className="progress">
                  <span style={{ width: `${level.percent}%`, background: level.color }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card benefits-card">
          <h2>Benefícios Mais Valorizados</h2>
          <p>O que mais engaja seus pacientes</p>
          <div className="benefit-list">
            {demoState.benefits.map((benefit) => (
              <button className="benefit-row" key={benefit.id} type="button" onClick={() => openBenefit(benefit)}>
                <ShieldCheck size={22} />
                <strong>{benefit.name}</strong>
                <span>{benefit.demand}</span>
                <b>
                  <Star size={15} /> {benefit.score}
                </b>
              </button>
            ))}
          </div>
        </div>
      </section>

      {metricsOpen ? (
        <Modal title="Editar Métricas Paciente+" onClose={() => setMetricsOpen(false)}>
          <div className="form-grid">
            <label>
              NPS Global
              <input type="number" min={0} max={100} value={metricsForm.nps} onChange={(event) => setMetricsForm({ ...metricsForm, nps: event.target.value })} />
            </label>
            <label>
              Retenção (%)
              <input type="number" min={0} max={100} value={metricsForm.retention} onChange={(event) => setMetricsForm({ ...metricsForm, retention: event.target.value })} />
            </label>
            <label>
              Benefícios resgatados
              <input type="number" min={0} value={metricsForm.redemptions} onChange={(event) => setMetricsForm({ ...metricsForm, redemptions: event.target.value })} />
            </label>
          </div>
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setMetricsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveMetrics}>Salvar</Button>
          </div>
        </Modal>
      ) : null}

      {benefitModal ? (
        <Modal title="Editar Benefício" onClose={() => setBenefitModal(null)}>
          <div className="form-grid">
            <label>
              Benefício*
              <input value={benefitForm.name} onChange={(event) => setBenefitForm({ ...benefitForm, name: event.target.value })} />
            </label>
            <label>
              Procura
              <input value={benefitForm.demand} onChange={(event) => setBenefitForm({ ...benefitForm, demand: event.target.value })} />
            </label>
            <label>
              Nota
              <input value={benefitForm.score} onChange={(event) => setBenefitForm({ ...benefitForm, score: event.target.value })} />
            </label>
          </div>
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setBenefitModal(null)}>
              Cancelar
            </Button>
            <Button onClick={saveBenefit}>Salvar</Button>
          </div>
        </Modal>
      ) : null}

      {reportOpen ? (
        <Modal title="Relatórios Paciente+" onClose={() => setReportOpen(false)} wide>
          <div className="report-panel">
            <p>Últimos atendimentos realizados com avaliação de satisfação por dimensão.</p>
            <div className="report-list">
              {buildSatisfactionReports(demoState.appointments, demoState.patients).map((row) => (
                <article className="report-row" key={row.id}>
                  <div>
                    <strong>{row.patient}</strong>
                    <span>{row.specialty} • {row.doctor} • {row.date}</span>
                  </div>
                  <div className="report-scores">
                    <span>Médico <b>{row.doctorScore}</b></span>
                    <span>Estrutura <b>{row.structureScore}</b></span>
                    <span>Atendimento <b>{row.serviceScore}</b></span>
                    <span>NPS <b>{row.nps}</b></span>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <Button onClick={() => setReportOpen(false)}>Fechar</Button>
          </div>
        </Modal>
      ) : null}

      {selectedLevel ? (
        <Modal title={`Pacientes ${selectedLevel}`} onClose={() => setSelectedLevel(null)}>
          <div className="level-patient-list">
            {demoState.patients.filter((patient) => patient.level === selectedLevel).length ? (
              demoState.patients
                .filter((patient) => patient.level === selectedLevel)
                .map((patient) => (
                  <div className="level-patient-row" key={patient.id}>
                    <AvatarLine initials={patient.initials} name={patient.name} sub={`${patient.plan} • ${patient.phone}`} />
                    <div>
                      <strong>{patient.score}</strong>
                      <span>{patient.temperature}</span>
                    </div>
                  </div>
                ))
            ) : (
              <p>Nenhum paciente nesta categoria.</p>
            )}
          </div>
          <div className="modal-actions">
            <Button onClick={() => setSelectedLevel(null)}>Fechar</Button>
          </div>
        </Modal>
      ) : null}
    </>
  )
}

function SettingsPage({ demoState, resetDemo }: { demoState: DemoState; resetDemo: () => void }) {
  return (
    <>
      <PageHeader page="configuracoes" />
      <section className="card settings-card">
        <SlidersHorizontal size={32} />
        <h2>Preferências da plataforma</h2>
        <p>
          Protótipo funcional local com persistência em localStorage. Alterações feitas nos pacientes, agendamentos,
          conversas, campanhas e programa Paciente+ continuam após recarregar a página.
        </p>
        <div className="settings-summary">
          <span>{demoState.patients.length} pacientes</span>
          <span>{demoState.appointments.length} agendamentos</span>
          <span>{demoState.campaigns.length} campanhas</span>
          <span>{demoState.benefits.length} benefícios</span>
        </div>
        <Button variant="secondary" danger onClick={resetDemo}>
          Resetar demo
        </Button>
      </section>
    </>
  )
}

function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
  wide?: boolean
}) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className={`modal card ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="modal-title-row">
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function AvatarLine({ initials, name, sub }: { initials: string; name: string; sub: string }) {
  return (
    <div className="avatar-line">
      <span className="avatar">{initials}</span>
      <div>
        <strong>{name}</strong>
        {sub ? <small>{sub}</small> : null}
      </div>
    </div>
  )
}

function TemperatureBadge({ temperature, score }: { temperature: LeadTemperature; score: number }) {
  return (
    <span className={`temperature ${temperature.toLowerCase()}`}>
      {temperature} • {score}
    </span>
  )
}

function buildConversationMessages(patientName: string, interest: string): ChatMessage[] {
  const firstName = patientName.split(' ')[0]
  return [
    {
      id: 'm1',
      author: 'bot',
      text: `Olá ${firstName}! Sou a assistente virtual do MaterDei. Como posso te ajudar hoje?`,
      time: '14:20',
    },
    {
      id: 'm2',
      author: 'patient',
      text: `Oi! Preciso agendar ${interest.toLowerCase()}.`,
      time: '14:22',
    },
    {
      id: 'm3',
      author: 'bot',
      text: `Claro! Encontrei estes horários disponíveis para ${interest} nos próximos dias:\n\n- Quinta, 24/04 - 14h00\n- Sexta, 25/04 - 09h30\n- Segunda, 28/04 - 16h00\n\nQual prefere?`,
      time: '14:23',
    },
    {
      id: 'm4',
      author: 'patient',
      text: 'Quinta às 14h fica ótimo!',
      time: '14:30',
    },
    {
      id: 'm5',
      author: 'bot',
      text: 'Perfeito! Pode confirmar para quinta às 14h? Vou precisar do número da sua carteirinha para finalizar.',
      time: '14:32',
    },
  ]
}

function buildBotReply(message: string, patient: Patient): string {
  const normalized = message.toLowerCase()
  const firstName = patient.name.split(' ')[0]

  if (/(pre[cç]o|valor|custa|plano|conv[eê]nio)/i.test(normalized)) {
    return `${firstName}, posso verificar a cobertura do plano ${patient.plan} e te passar as opções com benefício Paciente+ antes de finalizar.`
  }

  if (/(hor[aá]rio|agenda|marcar|agendar|consulta|exame)/i.test(normalized)) {
    return `Encontrei disponibilidade para ${patient.interest}: terça às 09h, quarta às 14h30 ou sexta às 11h. Qual horário prefere?`
  }

  if (/(sim|confirmo|pode|ok|fechado)/i.test(normalized)) {
    return `Perfeito, ${firstName}. Vou deixar a solicitação pré-confirmada e enviar os dados do atendimento pelo WhatsApp.`
  }

  return `${firstName}, entendi. Vou continuar seu atendimento por aqui e priorizar ${patient.interest.toLowerCase()} com base no seu perfil Paciente+ ${patient.level}.`
}

function getLoyaltyDistribution(patients: Patient[]) {
  const colors: Record<LoyaltyLevel, string> = {
    Ouro: '#fbbf24',
    Prata: '#cbd5e1',
    Bronze: '#c2410c',
  }
  const total = Math.max(patients.length, 1)
  return (['Ouro', 'Prata', 'Bronze'] as const).map((name) => {
    const count = patients.filter((patient) => patient.level === name).length
    return {
      name,
      count,
      percent: Math.round((count / total) * 100),
      color: colors[name],
    }
  })
}

function getPatientInsights(patient: Patient) {
  const firstName = patient.name.split(' ')[0]
  const insights: string[] = []

  if (patient.temperature === 'Quente') {
    insights.push(`${firstName} tem alta intenção: score ${patient.score} e resposta recente em ${patient.channel}.`)
  } else if (patient.temperature === 'Morno') {
    insights.push(`${firstName} exige acompanhamento: interesse existe, mas a decisão ainda está em maturação.`)
  } else {
    insights.push(`${firstName} está em fase de descoberta: priorizar abordagem educativa e sem pressão.`)
  }

  if (patient.level === 'Ouro') {
    insights.push('Categoria Ouro indica vínculo forte; oferecer prioridade e confirmação rápida.')
  } else if (patient.level === 'Prata') {
    insights.push('Categoria Prata sugere boa recorrência; benefício direcionado pode elevar retenção.')
  } else {
    insights.push('Categoria Bronze pede reengajamento com benefício simples e mensagem curta.')
  }

  if (patient.status === 'Inativo') {
    insights.push('Paciente inativo: iniciar contato com retomada de relacionamento antes da oferta.')
  } else if (patient.lastVisit === '-') {
    insights.push('Sem última consulta registrada: coletar contexto antes de sugerir agendamento.')
  } else {
    insights.push(`Última consulta em ${patient.lastVisit}; usar histórico para personalizar a próxima oferta.`)
  }

  if (patient.plan === 'Particular') {
    insights.push('Paciente particular: destacar previsibilidade de valor e desconto Paciente+.')
  } else {
    insights.push(`Plano ${patient.plan}: validar cobertura antes de pedir confirmação final.`)
  }

  return insights.slice(0, 4)
}

function getPatientPlusScore(patient: Patient) {
  const levelBase: Record<LoyaltyLevel, number> = {
    Ouro: 1800,
    Prata: 1150,
    Bronze: 520,
  }
  const temperatureBonus: Record<LeadTemperature, number> = {
    Quente: 450,
    Morno: 260,
    Frio: 90,
  }
  const statusBonus: Record<PatientStatus, number> = {
    Ativo: 180,
    Pendente: 80,
    Inativo: 0,
  }

  return levelBase[patient.level] + temperatureBonus[patient.temperature] + statusBonus[patient.status] + patient.score * 3
}

function getLevelReasons(patient: Patient) {
  const shared = [
    `Score IA ${patient.score} (${patient.temperature}) baseado em intenção de agendamento e histórico recente.`,
    `Plano ${patient.plan} e interesse atual em ${patient.interest}.`,
  ]

  if (patient.level === 'Ouro') {
    return [
      'Paciente recorrente com alto engajamento e resposta rápida aos contatos.',
      'Maior prioridade por alto potencial de conversão e relacionamento ativo com o hospital.',
      ...shared,
    ]
  }

  if (patient.level === 'Prata') {
    return [
      'Paciente com histórico ativo, mas com engajamento intermediário nas últimas interações.',
      'Boa oportunidade de retenção com benefício direcionado e acompanhamento humano.',
      ...shared,
    ]
  }

  return [
    'Paciente em fase de ativação ou com baixo volume de interações recentes.',
    'Categoria indicada para campanhas de reengajamento e benefícios de entrada.',
    ...shared,
  ]
}

function buildSatisfactionReports(appointments: Appointment[], patients: Patient[]) {
  const fallbackPatients = patients.length ? patients : defaultDemoState.patients
  return appointments.slice(0, 5).map((appointment, index) => {
    const patient = fallbackPatients[index % fallbackPatients.length]
    const base = Math.max(7.4, Math.min(9.9, 7.6 + (patient.score / 100) * 2.1 - index * 0.12))
    return {
      id: appointment.id,
      patient: patient.name,
      specialty: appointment.specialty,
      doctor: appointment.doctor,
      date: `Dez/2025 • dia ${appointment.day}`,
      doctorScore: base.toFixed(1),
      structureScore: Math.max(7.2, base - 0.3).toFixed(1),
      serviceScore: Math.min(9.9, base + 0.2).toFixed(1),
      nps: Math.round(base * 10),
    }
  })
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min
  return Math.min(max, Math.max(min, value))
}

function scoreToTemperature(score: number): LeadTemperature {
  if (score >= 80) return 'Quente'
  if (score >= 50) return 'Morno'
  return 'Frio'
}

function statusToTone(status: AppointmentStatus): Appointment['tone'] {
  if (status === 'Online') return 'blue'
  if (status === 'Esp.') return 'amber'
  return 'green'
}

function appointmentToForm(appointment?: Appointment) {
  return {
    day: String(appointment?.day ?? 3),
    time: appointment?.time ?? '09:00',
    specialty: appointment?.specialty ?? '',
    patient: appointment?.patient ?? '',
    doctor: appointment?.doctor ?? '',
    status: appointment?.status ?? 'Conf.' as AppointmentStatus,
    mode: appointment?.mode ?? 'Consulta',
  }
}

function patientToForm(patient?: Patient) {
  return {
    name: patient?.name ?? '',
    cpf: patient?.cpf ?? '123.***.***-**',
    phone: patient?.phone ?? '',
    status: patient?.status ?? 'Ativo' as PatientStatus,
    lastVisit: patient?.lastVisit ?? '-',
    plan: patient?.plan ?? '',
    level: patient?.level ?? 'Bronze' as LoyaltyLevel,
    score: String(patient?.score ?? 60),
    channel: patient?.channel ?? 'WhatsApp' as ContactChannel,
    interest: patient?.interest ?? 'Consulta Geral',
  }
}

function campaignToForm(campaign?: Partial<Campaign>) {
  return {
    name: campaign?.name ?? '',
    channel: campaign?.channel ?? 'WhatsApp',
    audience: campaign?.audience ?? '',
    reach: campaign?.reach ?? '0',
    conversion: campaign?.conversion ?? '0%',
    status: campaign?.status ?? 'Em andamento',
    stage: campaign?.stage ?? 'Ativas' as CampaignStage,
  }
}

function benefitToForm(benefit?: Benefit) {
  return {
    name: benefit?.name ?? '',
    demand: benefit?.demand ?? 'MÉDIA PROCURA',
    score: benefit?.score ?? '8.0',
  }
}

export default App
