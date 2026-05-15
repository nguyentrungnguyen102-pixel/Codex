import { agencies, bookings, dashboard, scenarios, services, tickets, walletHistory } from '/src/prototypeData.js'
import { calculateRefund, calculateTotal, creditRisk, detectFraud, formatVnd, simulateScenario } from '/src/prototypeLogic.js'

const { useEffect, useMemo, useState } = React
const { createRoot } = ReactDOM

function Icon({ name }) { return <i data-lucide={name} aria-hidden="true" /> }

const navItems = [
  ['Auth', 'lock-keyhole'], ['Dashboard', 'panel-left'], ['Booking', 'search'], ['MMB', 'ticket'], ['Wallet', 'wallet'], ['Invoice', 'file-text'], ['Admin', 'settings'], ['Risk', 'shield-alert'], ['Support', 'bell']
]

const serviceIcons = { flight: 'plane', bus: 'train', taxi: 'car-taxi-front', movie: 'film', hotel: 'hotel' }

function Card({ children, className = '' }) { return <section className={`card ${className}`}>{children}</section> }
function Pill({ children, className = '' }) { return <span className={`pill ${className}`}>{children}</span> }
function Field({ label, value, type = 'text' }) { return <label className="field"><span>{label}</span><input type={type} defaultValue={value} /></label> }

function AuthPanel() {
  return <div className="grid lg:grid-cols-3 gap-4">
    <Card><h3>Login</h3><Field label="Agency ID" value="F2-SAIGON" /><Field label="Password" value="••••••••" /><button className="primary">Đăng nhập</button></Card>
    <Card><h3>OTP</h3><Field label="OTP SMS/Email" value="202606" /><p className="muted">Step-up auth khi issue ticket, refund hoặc đổi tài khoản nhận hóa đơn.</p><button className="secondary">Xác thực OTP</button></Card>
    <Card><h3>Forgot Password</h3><Field label="Email quản trị" value="ops@saigontravel.vn" /><p className="muted">Reset link + OTP bắt buộc theo chính sách F1.</p><button className="secondary">Gửi reset link</button></Card>
  </div>
}

function Dashboard() {
  const risk = creditRisk({ walletBalance: dashboard.walletBalance, creditLimit: dashboard.creditLimit, creditUsed: dashboard.creditUsed })
  return <div className="space-y-4">
    <div className="grid md:grid-cols-4 gap-4">
      <Metric icon="wallet" label="Wallet balance" value={formatVnd(dashboard.walletBalance)} />
      <Metric icon="credit-card" label="Credit remaining" value={formatVnd(risk.remaining)} warning={risk.warning} />
      <Metric icon="banknote" label="GMV tháng" value={formatVnd(dashboard.gmv)} />
      <Metric icon="badge-check" label="Booking" value={dashboard.bookings.toLocaleString('vi-VN')} />
    </div>
    <div className="grid lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2"><div className="between"><h3>GMV Dashboard</h3><Pill>Theo ngày / tuần / tháng</Pill></div><div className="bars">{dashboard.chart.map((v, i) => <span key={i} style={{ height: `${v}px` }}><b>{v}</b></span>)}</div></Card>
      <Card><h3>Service Mix</h3><div className="donut" style={{ '--a': `${dashboard.mix[0]}%`, '--b': `${dashboard.mix[0] + dashboard.mix[1]}%`, '--c': `${dashboard.mix[0] + dashboard.mix[1] + dashboard.mix[2]}%` }} /><div className="legend"><span>Flight</span><span>Taxi</span><span>Movie</span><span>Hotel</span></div></Card>
    </div>
    <Card><h3>Agency Ranking</h3><Table headers={['Agency', 'Region', 'GMV', 'Bookings']} rows={dashboard.rankings.map(r => [r.name, r.region, formatVnd(r.gmv), r.bookings])} /></Card>
  </div>
}

function Metric({ icon, label, value, warning }) { return <Card className={warning ? 'warning' : ''}><div className="metric"><Icon name={icon} /><span>{label}</span><strong>{value}</strong></div></Card> }

function BookingFlow() {
  const [service, setService] = useState('flight')
  const [scenario, setScenario] = useState('success')
  const selected = services.find(s => s.id === service)
  const iconName = serviceIcons[service]
  const booking = bookings[0]
  const result = simulateScenario(scenario, booking)
  return <div className="space-y-4">
    <div className="grid lg:grid-cols-5 gap-4">{services.map(s => { const icon = serviceIcons[s.id]; return <button key={s.id} onClick={() => setService(s.id)} className={`service ${service === s.id ? 'active' : ''}`}><Icon name={icon} /><b>{s.name}</b><span>{s.group}</span></button> })}</div>
    <Card><div className="between wrap"><div><h3><Icon name={iconName} /> {selected.name} Business Flow</h3><p className="muted">Markup/commission mô phỏng theo service matrix.</p></div><select value={scenario} onChange={e => setScenario(e.target.value)}>{scenarios.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select></div><div className="steps">{selected.flow.map((step, i) => <div key={step} className={i < selected.flow.length - 1 ? 'done' : ''}><span>{i + 1}</span>{step}</div>)}</div></Card>
    <div className="grid lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2"><h3>Search → Result → Detail</h3><div className="grid md:grid-cols-4 gap-3"><Field label="Chặng/địa điểm" value="SGN → HAN" /><Field label="Ngày" type="date" value="2026-06-18" /><Field label="Hãng/NCC" value="Vietnam Airlines" /><Field label="Hạng vé" value="Economy" /></div><Table headers={['PNR', 'Net', 'Tax', 'Markup', 'Customer total']} rows={[[booking.pnr, formatVnd(booking.net), formatVnd(booking.tax), formatVnd(booking.markup), formatVnd(calculateTotal(booking))]]} /></Card>
      <Card><h3>Mock Scenario</h3><Pill className={scenarios.find(s => s.id === scenario).badge}>{result.status}</Pill><p>{scenarios.find(s => s.id === scenario).description}</p><p className="muted">Next: {result.nextAction}</p>{result.newTotal && <strong>{formatVnd(result.newTotal)}</strong>}</Card>
    </div>
  </div>
}

function MMB() {
  const [filter, setFilter] = useState('')
  const filtered = bookings.filter(b => [b.pnr, b.phone, b.status, b.departure].join(' ').toLowerCase().includes(filter.toLowerCase()))
  const refund = calculateRefund(calculateTotal(bookings[3]))
  return <div className="space-y-4">
    <Card><div className="between wrap"><h3>Manage My Booking</h3><input placeholder="Filter by PNR, SĐT, ngày khởi hành, trạng thái" value={filter} onChange={e => setFilter(e.target.value)} /></div><Table headers={['PNR', 'Service', 'Customer (masked)', 'Departure', 'Status', 'Owner', 'Total']} rows={filtered.map(b => [b.pnr, b.service, `${b.customer} / ${b.phone}`, b.departure, b.status, b.owner, formatVnd(calculateTotal(b))])} /></Card>
    <div className="grid lg:grid-cols-3 gap-4">
      <Card><h3>Ancillaries</h3><ul className="checks"><li>Hành lý +23kg: check realtime price</li><li>Suất ăn: deduct wallet</li><li>Chỗ ngồi: update E-ticket</li></ul><button className="primary">Buy ancillary</button></Card>
      <Card><h3>Refund</h3><p>Penalty fee: <b>{formatVnd(refund.penalty)}</b></p><p>Refundable: <b>{formatVnd(refund.refundable)}</b></p><button className="secondary">Submit F1 approval</button></Card>
      <Card><h3>Re-book</h3><p className="muted">Select new itinerary → calculate fare difference → deduct wallet → re-issue ticket.</p><button className="secondary">Re-issue ticket</button></Card>
    </div>
  </div>
}

function WalletInvoice() { return <div className="grid lg:grid-cols-2 gap-4"><Card><h3>Wallet / Top-up / Audit Trail</h3><div className="topup"><Icon name="building-2" /><span>Bank Transfer → Virtual Account → Auto Matching → Wallet Update</span></div><Table headers={['ID', 'Type', 'Amount', 'Note', 'Status']} rows={walletHistory.map(w => [w.id, w.type, formatVnd(w.amount), w.note, w.status])} /></Card><Card><h3>Hóa đơn điện tử</h3><div className="grid md:grid-cols-2 gap-3"><Field label="Tên công ty" value="Công ty Saigon Travel" /><Field label="MST" value="0312345678" /><Field label="Địa chỉ" value="Quận 1, TP.HCM" /><Field label="Email" value="invoice@saigontravel.vn" /></div><div className="invoice"><b>XML/PDF Preview</b><p>Issue Success → Request Invoice → Input Tax Info → Generate XML/PDF → Send Email</p></div></Card></div> }

function AdminRisk() {
  const risk = creditRisk({ walletBalance: 5000000, creditLimit: 40000000, creditUsed: 43000000, overdueDays: 16 })
  const alerts = detectFraud(Array.from({ length: 7 }, (_, i) => ({ agencyId: 'F2-SAIGON', ip: '113.22.10.8', type: i % 2 ? 'refund' : 'issue', minute: 100 + i })), { threshold: 3 })
  return <div className="space-y-4"><div className="grid lg:grid-cols-3 gap-4"><Card><h3>F1 Commission Config</h3><Table headers={['Provider', 'Commission']} rows={[['Taxi Xanh SM', '5%'], ['CGV', '8%'], ['Hotel Partner', '6%']]} /></Card><Card><h3>Kill Switch</h3><ul className="checks"><li>Khóa/Mở đại lý</li><li>Chặn login</li><li>Chặn trừ ví</li></ul><button className="danger">Block Issue Ticket</button></Card><Card className="warning"><h3>Credit Limit</h3><p>{risk.message}</p><p>Remaining: <b>{formatVnd(risk.remaining)}</b></p></Card></div><Card><h3>Fraud Detection</h3><Table headers={['Agency', 'IP', 'Type', 'Count', 'Severity']} rows={alerts.map(a => [a.agencyId, a.ip, a.type, a.count, a.severity])} /></Card><Card><h3>F2 Markup & F3 Management</h3><Table headers={['Config', 'Value']} rows={[['Nội địa', '180.000đ/ticket'], ['Quốc tế', '2.2%'], ['Xe khách', '35.000đ/ticket'], ['F3 commission', 'Auto split profit 40%']]} /></Card></div>
}

function SupportData() { return <div className="grid lg:grid-cols-2 gap-4"><Card><h3>Internal Ticketing trên PNR</h3><p className="muted">Open Booking → Create Ticket → Select Issue → Submit to F1.</p><div className="grid md:grid-cols-2 gap-3"><Field label="PNR" value="VN8K2L" /><Field label="Issue" value="Đổi giờ bay" /></div><button className="primary">Submit to F1</button><Table headers={['Ticket', 'PNR', 'Issue', 'Status', 'SLA']} rows={tickets.map(t => [t.id, t.pnr, t.issue, t.status, t.sla])} /></Card><Card><h3>Data Policy & Compliance</h3><div className="ownership">{agencies.map(a => <div key={a.id}><b>{a.tier}</b><span>{a.name}</span><small>{a.role}</small></div>)}</div><label className="consent"><input type="checkbox" defaultChecked /> Đồng ý xử lý dữ liệu cá nhân theo Nghị định 13</label><p className="muted">F3 sở hữu khách tự tạo; F2 xem danh sách có masking SĐT/Email để chống cướp khách nội bộ.</p></Card></div> }

function Table({ headers, rows }) { return <div className="tableWrap"><table><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.length ? rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>) : <tr><td colSpan={headers.length}>Empty result</td></tr>}</tbody></table></div> }

function App() {
  const [active, setActive] = useState('Dashboard')
  const [dark, setDark] = useState(true)
  useEffect(() => { window.lucide?.createIcons() })
  const page = useMemo(() => ({ Auth: <AuthPanel />, Dashboard: <Dashboard />, Booking: <BookingFlow />, MMB: <MMB />, Wallet: <WalletInvoice />, Invoice: <WalletInvoice />, Admin: <AdminRisk />, Risk: <AdminRisk />, Support: <SupportData /> })[active], [active])
  return <main className={dark ? 'app dark' : 'app'}><aside><div className="brand"><Icon name="plane" /> <div><b>VNPAYAGENT OS</b><span>2026 Executive Demo</span></div></div>{navItems.map(([name, icon]) => <button key={name} onClick={() => setActive(name)} className={active === name ? 'selected' : ''}><Icon name={icon} />{name}</button>)}<button onClick={() => setDark(!dark)} className="mode">{dark ? <Icon name="sun" /> : <Icon name="moon" />} {dark ? 'Light mode' : 'Dark mode'}</button></aside><section className="content"><header><div><p>Version 2.2 — Prototype Presentation</p><h1>{active}</h1></div><div className="headerActions"><Pill>F1 → F2 → F3 → Customer</Pill><Pill>Responsive React + Tailwind-style UI</Pill></div></header>{page}</section></main>
}

createRoot(document.getElementById('root')).render(<App />)
