export const formatVnd = amount => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount)

export function calculateTotal({ net = 0, tax = 0, markup = 0 }) {
  return net + tax + markup
}

export function calculateRefund(total, penaltyRate = 0.18, fixedFee = 50000) {
  const penalty = Math.round(total * penaltyRate) + fixedFee
  return { penalty, refundable: Math.max(total - penalty, 0) }
}

export function creditRisk({ walletBalance, creditLimit, creditUsed, overdueDays = 0, maxOverdueDays = 15 }) {
  const remaining = walletBalance + creditLimit - creditUsed
  const threshold = (walletBalance + creditLimit) * 0.1
  return {
    remaining,
    warning: remaining < threshold,
    autoKill: remaining <= 0 || overdueDays >= maxOverdueDays,
    message: remaining <= 0 || overdueDays >= maxOverdueDays
      ? 'Auto-Kill: chặn Issue Ticket và khóa công nợ quá hạn.'
      : remaining < threshold
        ? 'Cảnh báo: số dư + hạn mức còn dưới 10%.'
        : 'Hạn mức an toàn.',
  }
}

export function detectFraud(events, { windowMinutes = 30, threshold = 5 } = {}) {
  const cutoff = Math.max(...events.map(e => e.minute)) - windowMinutes
  const grouped = events
    .filter(e => e.minute >= cutoff && ['issue', 'refund'].includes(e.type))
    .reduce((acc, e) => {
      const key = `${e.agencyId}:${e.ip}:${e.type}`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  return Object.entries(grouped)
    .filter(([, count]) => count >= threshold)
    .map(([key, count]) => {
      const [agencyId, ip, type] = key.split(':')
      return { agencyId, ip, type, count, severity: count >= threshold * 2 ? 'High' : 'Medium' }
    })
}

export function simulateScenario(id, booking) {
  const total = calculateTotal(booking)
  const common = { pnr: booking.pnr, total }
  switch (id) {
    case 'timeout':
      return { ...common, status: 'Timeout', nextAction: 'Create support ticket to F1', walletDelta: 0 }
    case 'empty':
      return { ...common, status: 'Empty result', nextAction: 'Relax filters or change date', walletDelta: 0 }
    case 'priceChanged':
      return { ...common, status: 'Price changed', newTotal: total + 120000, nextAction: 'Ask customer to accept fare difference', walletDelta: 0 }
    case 'holdExpired':
      return { ...common, status: 'Hold expired', nextAction: 'Hold booking again before issue', walletDelta: 0 }
    default:
      return { ...common, status: 'Success', nextAction: 'Issue completed and invoice available', walletDelta: -total }
  }
}
