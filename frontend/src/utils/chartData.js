// Chart-data derivations for the Admin dashboard.
// Colors come ONLY from the design tokens in src/styles/tokens.css — never hardcoded hex.
// Anything marked with `sample: true` is NOT backed by an API yet (lists the missing
// endpoint/field) and is rendered with a visible "Sample" tag in the UI.

/** Resolve a CSS custom property from the token sheet for recharts (needs concrete colors). */
export function tokenColor(name, fallback = 'var(--color-accent)') {
  if (typeof window === 'undefined') {
    return fallback;
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/** Deterministic PRNG so placeholder sparklines/trends stay stable between renders. */
function seededRandom(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Placeholder points for a stat-card sparkline (persisted between renders). */
function samplePoints(random, base, length = 7) {
  const floor = Math.max(2, base * 0.25);
  const points = [];
  let current = base;
  for (let i = 0; i < length; i += 1) {
    current = clamp(current + (random() - 0.45) * base * 0.22, floor, base * 1.35);
    points.push(Number(current.toFixed(1)));
  }
  return points;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatShortDay(date) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(date);
}

/**
 * The four stat cards. `value` comes from GET /api/admin/dashboard (real).
 * Sparklines + trend deltas have no time-series endpoint yet -> clearly-marked sample data.
 */
export function buildStatCards(dashboard) {
  const random = seededRandom((dashboard.totalStudents || 1) * 31 + (dashboard.totalTeachers || 1) * 7);
  const delta = () => `${random() >= 0.5 ? '+' : '-'}${(random() * 6 + 0.4).toFixed(1)}%`;

  return [
    {
      id: 'students',
      label: 'Total students',
      value: dashboard.totalStudents,
      decimals: 0,
      tone: 'accent',
      icon: 'UserRound',
      delta: delta(),
      points: samplePoints(random, dashboard.totalStudents),
      sample: true,
    },
    {
      id: 'teachers',
      label: 'Total teachers',
      value: dashboard.totalTeachers,
      decimals: 0,
      tone: 'teal',
      icon: 'GraduationCap',
      delta: delta(),
      points: samplePoints(random, dashboard.totalTeachers),
      sample: true,
    },
    {
      id: 'attendance',
      label: "Today's attendance",
      value: dashboard.todayAttendancePercentage,
      decimals: 1,
      tone: 'amber',
      icon: 'CalendarCheck',
      unit: '%',
      delta: delta(),
      points: samplePoints(random, dashboard.todayAttendancePercentage || 20),
      sample: true,
    },
    {
      id: 'pendingFees',
      label: 'Pending fees',
      value: dashboard.pendingFees,
      decimals: 0,
      tone: 'rose',
      icon: 'Wallet',
      isCurrency: true,
      delta: delta(),
      points: samplePoints(random, 8),
      sample: true,
    },
  ];
}

/** MISSING API: no per-day attendance endpoint exists. Sample-only line for the 7-day area chart. */
export function buildAttendanceTrend(percentage) {
  const anchor = clamp(Number(percentage) || 0, 0, 100);
  const random = seededRandom(42);
  const today = new Date();
  const points = [];

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const wander = i === 6 ? (random() - 0.5) * 10 : 0;
    const percent = clamp(anchor + wander, 40, 98);
    points.push({ day: formatShortDay(date), percent: Number(percent.toFixed(1)) });
  }
  points[6] = { day: formatShortDay(today), percent: Number(anchor.toFixed(1)) };

  return { points, sample: true };
}

/** Aggregates today's PRESENT / ABSENT / LATE counts from GET /api/teacher/attendance. */
export function buildAttendanceBreakdown(records) {
  const counts = { present: 0, absent: 0, late: 0 };
  records.forEach((record) => {
    const status = (record.status || '').toUpperCase();
    if (status === 'PRESENT') counts.present += 1;
    else if (status === 'LATE') counts.late += 1;
    else counts.absent += 1;
  });
  const total = counts.present + counts.absent + counts.late;
  const percentage = total
    ? Number((((counts.present + counts.late) / total) * 100).toFixed(1))
    : Number(0).toFixed(1);
  return { ...counts, total, percentage };
}

/** Real fee split (collected vs pending) from GET /api/admin/fees. */
export function buildFeeDonut(fees) {
  const total = { collected: 0, pending: 0, billed: 0 };
  fees.forEach((fee) => {
    total.collected += Number(fee.paidAmount || 0);
    total.pending += Number(fee.pendingAmount || 0);
    total.billed += Number(fee.totalAmount || 0);
  });
  const round = (value) => Math.round(value * 100) / 100;
  const collected = round(total.collected);
  const pending = round(total.pending);
  const billed = round(total.billed);
  const collectedPercent = billed ? Math.round((collected / billed) * 100) : 0;
  return { collected, pending, billed, collectedPercent };
}

/** Students per class from GET /api/admin/students. */
export function buildStudentsPerClass(students) {
  const grouped = new Map();
  students.forEach((student) => {
    const name = student.className || 'Unassigned';
    grouped.set(name, (grouped.get(name) || 0) + 1);
  });
  return [...grouped.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/** Top 5 fees by pending amount (real), descending. */
export function buildTopPendingFees(fees, limit = 5) {
  return [...fees]
    .filter((fee) => Number(fee.pendingAmount || 0) > 0)
    .sort((a, b) => Number(b.pendingAmount) - Number(a.pendingAmount))
    .slice(0, limit);
}

/** Most recent 5 payments (real). Payments endpoint already sorts by date desc. */
export function buildRecentPayments(payments, limit = 5) {
  return [...payments]
    .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
    .slice(0, limit);
}