import test from 'node:test'
import assert from 'node:assert/strict'
import { bookings, dashboard, scenarios } from './prototypeData.js'
import { calculateRefund, calculateTotal, creditRisk, detectFraud, simulateScenario } from './prototypeLogic.js'

test('calculates GDS/API markup total before issue ticket', () => {
  assert.equal(calculateTotal(bookings[0]), 2380000)
})

test('covers all required mock scenarios', () => {
  const statuses = scenarios.map(s => simulateScenario(s.id, bookings[0]).status)
  assert.deepEqual(statuses, ['Success', 'Timeout', 'Empty result', 'Price changed', 'Hold expired'])
})

test('blocks issue ticket when credit is overdue or exhausted', () => {
  const risk = creditRisk({ walletBalance: 1_000_000, creditLimit: 10_000_000, creditUsed: 11_500_000, overdueDays: 16 })
  assert.equal(risk.autoKill, true)
  assert.match(risk.message, /Auto-Kill/)
})

test('warns when remaining wallet plus credit limit is under ten percent', () => {
  const risk = creditRisk({ walletBalance: dashboard.walletBalance, creditLimit: dashboard.creditLimit, creditUsed: 151_000_000 })
  assert.equal(risk.warning, true)
  assert.equal(risk.autoKill, false)
})

test('detects burst issue/refund events by agency and IP', () => {
  const events = Array.from({ length: 6 }, (_, i) => ({ agencyId: 'F2-SAIGON', ip: '113.22.10.8', type: 'refund', minute: 200 + i }))
  assert.deepEqual(detectFraud(events, { threshold: 5 })[0], { agencyId: 'F2-SAIGON', ip: '113.22.10.8', type: 'refund', count: 6, severity: 'Medium' })
})

test('calculates refund amount after penalty for MMB refund approval', () => {
  assert.deepEqual(calculateRefund(2_750_000), { penalty: 545000, refundable: 2205000 })
})
