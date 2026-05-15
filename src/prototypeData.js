export const services = [
  { id: 'flight', name: 'Vé máy bay', group: 'GDS/API', flow: ['Search', 'Hold Booking', 'Check Wallet', 'Issue Ticket', 'Complete'], color: 'from-sky-500 to-blue-700', markup: 180000 },
  { id: 'bus', name: 'Xe khách', group: 'GDS/API', flow: ['Search', 'Hold Booking', 'Check Wallet', 'Issue Ticket', 'Complete'], color: 'from-emerald-500 to-teal-700', markup: 35000 },
  { id: 'taxi', name: 'Taxi', group: 'Micro-services', flow: ['Booking', 'Deduct Wallet', 'Complete', 'Cashback'], color: 'from-lime-500 to-green-700', commissionRate: 0.05 },
  { id: 'movie', name: 'Vé phim', group: 'Micro-services', flow: ['Booking', 'Deduct Wallet', 'Check-in', 'Cashback'], color: 'from-fuchsia-500 to-pink-700', commissionRate: 0.08 },
  { id: 'hotel', name: 'Khách sạn', group: 'Lưu trú', flow: ['Check Room', 'Booking Request', 'Approval', 'Payment', 'Commission'], color: 'from-amber-500 to-orange-700', commissionRate: 0.06 },
]

export const agencies = [
  { id: 'f1', tier: 'F1', name: 'VNPAY / Master Agency', role: 'Quản trị hệ thống, hoa hồng, hạn mức, kill switch' },
  { id: 'f2', tier: 'F2', name: 'Saigon Travel Agency', role: 'Đại lý bán dịch vụ, cấu hình markup, quản lý F3' },
  { id: 'f3', tier: 'F3', name: 'CTV Nguyễn An', role: 'Seller trực tiếp, sở hữu dữ liệu khách do mình tạo' },
]

export const scenarios = [
  { id: 'success', label: 'Success', description: 'Giữ chỗ, trừ ví và xuất vé thành công.', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200' },
  { id: 'timeout', label: 'Timeout', description: 'NCC không phản hồi, tạo ticket hỗ trợ F1.', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200' },
  { id: 'empty', label: 'Empty result', description: 'Không có chuyến/phòng phù hợp bộ lọc.', badge: 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-200' },
  { id: 'priceChanged', label: 'Price changed', description: 'Giá realtime thay đổi trước khi issue.', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200' },
  { id: 'holdExpired', label: 'Hold expired', description: 'PNR hết hạn giữ chỗ, yêu cầu hold lại.', badge: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200' },
]

export const bookings = [
  { pnr: 'VN8K2L', service: 'Flight', route: 'SGN → HAN', customer: 'Nguyễn Minh Anh', phone: '090***219', email: 'm***@agency.vn', departure: '2026-06-18 09:20', status: 'Hold', owner: 'F3 Nguyễn An', net: 1780000, tax: 420000, markup: 180000, holdUntil: '11:45', risk: 'Normal' },
  { pnr: 'BUS4Q9', service: 'Bus', route: 'HCM → Đà Lạt', customer: 'Trần Quốc Bảo', phone: '091***778', email: 'b***@mail.vn', departure: '2026-06-20 22:00', status: 'Issued', owner: 'F2 Saigon Travel', net: 320000, tax: 0, markup: 35000, holdUntil: '-', risk: 'Normal' },
  { pnr: 'MOV9CP', service: 'Movie', route: 'CGV Landmark 81', customer: 'Lê Hoàng Vy', phone: '093***456', email: 'v***@mail.vn', departure: '2026-05-22 19:30', status: 'Issued', owner: 'F3 Nguyễn An', net: 220000, tax: 0, markup: 0, holdUntil: '-', risk: 'Cashback pending' },
  { pnr: 'HTL2AP', service: 'Hotel', route: 'Đà Nẵng Riverside', customer: 'Phạm Gia Huy', phone: '098***002', email: 'h***@corp.vn', departure: '2026-07-01', status: 'Refund Pending', owner: 'F2 Saigon Travel', net: 2400000, tax: 190000, markup: 160000, holdUntil: '-', risk: 'Manual approval' },
]

export const walletHistory = [
  { id: 'TX-001', type: 'Top-up', amount: 50000000, note: 'Auto matching VA 9704***221', status: 'Completed' },
  { id: 'TX-002', type: 'Booking payment', amount: -2380000, note: 'Issue PNR VN8K2L', status: 'Completed' },
  { id: 'TX-003', type: 'Commission', amount: 11000, note: 'CGV check-in MOV9CP', status: 'Completed' },
  { id: 'TX-004', type: 'Refund', amount: 1840000, note: 'Refund after F1 approval HTL2AP', status: 'Pending' },
  { id: 'TX-005', type: 'Adjustment', amount: -50000, note: 'Manual correction by F1', status: 'Audited' },
]

export const tickets = [
  { id: 'SUP-2026-118', pnr: 'VN8K2L', issue: 'Đổi giờ bay', status: 'Open', sla: '18 phút', assignee: 'F1 Air Desk' },
  { id: 'SUP-2026-119', pnr: 'HTL2AP', issue: 'Lỗi hoàn tiền', status: 'In Progress', sla: '42 phút', assignee: 'F1 Finance' },
  { id: 'SUP-2026-120', pnr: 'BUS4Q9', issue: 'Sai tên', status: 'Resolved', sla: 'Đúng hạn', assignee: 'F1 Support' },
]

export const dashboard = {
  walletBalance: 126800000,
  creditLimit: 40000000,
  creditUsed: 36500000,
  gmv: 842000000,
  bookings: 1284,
  commission: 38200000,
  chart: [52, 68, 61, 82, 74, 96, 112],
  mix: [44, 18, 16, 22],
  rankings: [
    { name: 'Saigon Travel', region: 'Miền Nam', gmv: 342000000, bookings: 482 },
    { name: 'Hanoi AirGo', region: 'Miền Bắc', gmv: 286000000, bookings: 391 },
    { name: 'Danang BizTrip', region: 'Miền Trung', gmv: 214000000, bookings: 276 },
  ],
}
