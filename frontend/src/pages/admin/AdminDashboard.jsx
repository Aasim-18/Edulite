import { useEffect, useId, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Activity,
  BarChart3,
  Bell,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  GraduationCap,
  Info,
  Megaphone,
  PieChart as PieIcon,
  Receipt,
  TrendingUp,
  UserPlus,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAuth } from '../../hooks/AuthContext';
import {
  getAdminDashboard,
  getClasses,
  getFees,
  getPayments,
  getStudents,
} from '../../services/adminService';
import { getAttendance } from '../../services/teacherService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import {
  buildAttendanceBreakdown,
  buildAttendanceTrend,
  buildFeeDonut,
  buildRecentPayments,
  buildStatCards,
  buildStudentsPerClass,
  buildTopPendingFees,
  tokenColor,
} from '../../utils/chartData';
import { formatCurrency, formatDate, getErrorMessage } from '../../utils/formatters';

const chartTooltipStyle = {
  background: tokenColor('--color-surface'),
  border: `1px solid ${tokenColor('--color-border')}`,
  borderRadius: '10px',
  color: tokenColor('--color-text'),
  fontSize: '12px',
  boxShadow: 'var(--shadow-sm)',
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function fullDate() {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

function padTwo(number) {
  return String(number).padStart(2, '0');
}

/** Smoothly counts from 0 to the target value (disabled when the user prefers reduced motion). */
function CountUp({ value, decimals = 0, duration = 700 }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduced) {
      setDisplay(Number(value) || 0);
      return;
    }

    const to = Number(value) || 0;
    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(to * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, decimals, duration, reduced]);

  const formatted = decimals
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString('en-IN');
  return <>{formatted}</>;
}

/** Tiny area sparkline used inside each stat card. */
function MiniSparkline({ points, color, tone }) {
  const gradientId = useId();
  const data = points.map((value, index) => ({ index, value }));

  return (
    <div className="dash-spark" aria-hidden="true">
      <ResponsiveContainer width="100%" height={42}>
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.32} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function TrendChip({ delta, sample }) {
  return (
    <span
      className="dash-trend"
      title={sample ? 'Sample trend — no history endpoint yet' : undefined}
    >
      {sample && <span className="sr-only">Sample</span>}
      <TrendingUp size={12} aria-hidden="true" />
      {delta}
      {sample && <span className="dash-trend-mark">sample</span>}
    </span>
  );
}

const statIcons = { UserRound, GraduationCap, CalendarCheck, Wallet };

function statColor(tone) {
  if (tone === 'teal') return tokenColor('--color-success');
  if (tone === 'amber') return tokenColor('--color-warning');
  if (tone === 'rose') return tokenColor('--color-danger');
  return tokenColor('--color-accent');
}

/** One of the four KPI cards. `markedToday=false` means no attendance was marked yet. */
function DashStat({ card, markedToday = true }) {
  const Icon = statIcons[card.icon] || Users;
  const color = statColor(card.tone);

  return (
    <Card className={`dash-stat dash-stat-${card.tone}`}>
      <div className="dash-stat-top">
        <span className="dash-stat-icon" aria-hidden="true">
          <Icon size={20} strokeWidth={2} />
        </span>
        {markedToday ? (
          <TrendChip delta={card.delta} sample={card.sample} />
        ) : (
          <Badge tone="neutral">Not marked yet</Badge>
        )}
      </div>
      <strong className="dash-stat-value">
        {markedToday ? (
          <>
            {card.isCurrency ? '₹' : ''}
            <CountUp value={card.value} decimals={card.decimals} />
            {card.unit || ''}
          </>
        ) : (
          '—'
        )}
      </strong>
      <span className="dash-stat-label">{card.label}</span>
      {markedToday && <MiniSparkline points={card.points} color={color} tone={card.tone} />}
    </Card>
  );
}

/** Shared card chrome for every dashboard widget. `sample` renders a "Sample" tag. */
function ChartCard({ title, subtitle, icon: Icon, sample, action, children }) {
  return (
    <Card className="dash-card">
      <header className="dash-card-head">
        <span className="dash-card-title-icon" aria-hidden="true">
          <Icon size={18} strokeWidth={2} />
        </span>
        <div className="dash-card-title">
          <div className="dash-card-title-row">
            <h3>{title}</h3>
            {sample && <Badge tone="neutral">Sample</Badge>}
          </div>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </header>
      {children}
    </Card>
  );
}

function attendanceData(counts) {
  return [
    { name: 'Present', value: counts.present, color: tokenColor('--color-success') },
    { name: 'Late', value: counts.late, color: tokenColor('--color-warning') },
    { name: 'Absent', value: counts.absent, color: tokenColor('--color-danger') },
  ].filter((entry) => entry.value > 0);
}

/** Donut (3 segments) with today's present/absent/late counts in the middle. */
function AttendanceRing({ counts }) {
  if (!counts.total) {
    return (
      <EmptyState
        title="No attendance marked today"
        message="Teachers haven't marked attendance yet."
      />
    );
  }

  const data = attendanceData(counts);

  return (
    <div className="dash-ring">
      <div className="dash-ring-chart">
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={84}
              paddingAngle={3}
              strokeWidth={0}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={chartTooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="dash-ring-center">
          <strong>{counts.percentage}%</strong>
          <span>present</span>
        </div>
      </div>
      <ul className="dash-legend">
        {data.map((entry) => (
          <li key={entry.name}>
            <span className="dash-legend-dot" style={{ background: entry.color }} />
            <span>{entry.name}</span>
            <strong>{entry.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Collected vs pending fee split. */
function FeeDonut({ donut }) {
  if (!donut.billed) {
    return (
      <EmptyState
        title="No fees recorded"
        message="Fee collection will appear here once fees are added."
      />
    );
  }

  const data = [
    { name: 'Collected', value: donut.collected, color: tokenColor('--color-success') },
    { name: 'Pending', value: donut.pending, color: tokenColor('--color-danger') },
  ].filter((entry) => entry.value > 0);

  return (
    <div className="dash-ring">
      <div className="dash-ring-chart">
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={84}
              paddingAngle={3}
              strokeWidth={0}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
        <div className="dash-ring-center">
          <strong>{donut.collectedPercent}%</strong>
          <span>collected</span>
        </div>
      </div>
      <ul className="dash-legend dash-legend-tight">
        <li>
          <span className="dash-legend-dot" style={{ background: tokenColor('--color-success') }} />
          <span>Collected</span>
          <strong>{formatCurrency(donut.collected)}</strong>
        </li>
        <li>
          <span className="dash-legend-dot" style={{ background: tokenColor('--color-danger') }} />
          <span>Pending</span>
          <strong>{formatCurrency(donut.pending)}</strong>
        </li>
      </ul>
    </div>
  );
}

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase() || '?';
}

function badgeTone(method) {
  const upper = (method || '').toUpperCase();
  if (upper === 'CASH') return 'success';
  if (upper === 'UPI') return 'accent';
  return 'neutral';
}

/** Screen / grid for the loading phase — mirrors the real layout as skeletons. */
function DashboardSkeleton() {
  return (
    <div className="dash-skeleton-page">
      <Skeleton width="38%" height="2rem" />
      <Skeleton width="24%" height="1rem" />
      <div className="dash-stat-grid" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="dash-stat dash-stat-skeleton">
            <Skeleton width="60%" height="0.75rem" />
            <Skeleton width="72%" height="1.9rem" />
            <Skeleton width="80%" height="0.75rem" />
            <Skeleton height="42px" />
          </Card>
        ))}
      </div>
      <Card className="dash-card">
        <Skeleton height="220px" />
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [remindedId, setRemindedId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [dashboard, classes, students, fees, payments] = await Promise.all([
          getAdminDashboard(),
          getClasses(),
          getStudents(),
          getFees(),
          getPayments(),
        ]);

        // Today's present/absent/late counts are aggregated from each class's
        // attendance (GET /api/teacher/attendance), which is also allowed for ADMIN.
        const today = `${new Date().getFullYear()}-${padTwo(
          new Date().getMonth() + 1,
        )}-${padTwo(new Date().getDate())}`;
        const perClass = classes.length
          ? await Promise.all(classes.map((entry) => getAttendance(entry.id, today)))
          : [];

        if (!cancelled) {
          setData({ dashboard, classes, students, fees, payments, attendanceRecords: perClass.flat() });
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getErrorMessage(loadError));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => (data ? buildStatCards(data.dashboard) : []), [data]);
  const trend = useMemo(
    () => (data ? buildAttendanceTrend(data.dashboard.todayAttendancePercentage) : null),
    [data],
  );
  const ring = useMemo(
    () => (data ? buildAttendanceBreakdown(data.attendanceRecords) : null),
    [data],
  );
  const feeDonut = useMemo(() => (data ? buildFeeDonut(data.fees) : null), [data]);
  const perClass = useMemo(() => (data ? buildStudentsPerClass(data.students) : []), [data]);
  const topPending = useMemo(() => (data ? buildTopPendingFees(data.fees) : []), [data]);
  const recentPayments = useMemo(() => (data ? buildRecentPayments(data.payments) : []), [data]);

  const entrance = (delay = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.1 },
          transition: { duration: 0.4, delay, ease: 'easeOut' },
        };

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!data) {
    return (
      <>
        <div className="page-heading">
          <div>
            <p className="eyebrow">{fullDate()}</p>
            <h1>Admin dashboard</h1>
            <p className="dashboard-description">Loading the latest numbers...</p>
          </div>
        </div>
        <DashboardSkeleton />
      </>
    );
  }

  const firstName = (user.name || '').split(' ')[0];

  return (
    <>
      <motion.header
        className="ui-page-header dash-header"
        {...entrance(0)}
      >
        <div>
          <p className="eyebrow">{fullDate()}</p>
          <h1>
            {greeting()}, {firstName}
          </h1>
          <p className="dashboard-description">
            Here's what's happening across your institution today.
          </p>
        </div>
        <div className="ui-page-header-actions">
          <Link to="/admin/students" className="ui-button ui-button-secondary">
            <UserPlus size={17} aria-hidden="true" />
            Add student
          </Link>
          <Link to="/admin/teachers" className="ui-button ui-button-secondary">
            <GraduationCap size={17} aria-hidden="true" />
            Add teacher
          </Link>
          <Link to="/admin/payments" className="ui-button ui-button-primary">
            <CreditCard size={17} aria-hidden="true" />
            Record payment
          </Link>
        </div>
      </motion.header>

      <div className="dash-info-strip" role="note">
        <Info size={16} aria-hidden="true" />
        <span>
          <strong>Sample data:</strong> the 7-day trend, stat-card sparklines and announcements
          have no backend endpoint yet, so those areas are shown as marked <em>sample</em> data.
        </span>
      </div>

      <div className="dash-stat-grid">
        {stats.map((card, index) => (
          <motion.div key={card.id} {...entrance(0.06 * index)}>
            <DashStat
              card={card}
              markedToday={!(card.id === 'attendance' && ring && !ring.total)}
            />
          </motion.div>
        ))}
      </div>

      <div className="dash-grid dash-grid-2">
        <motion.div {...entrance(0.05)}>
          <ChartCard
            title="Attendance trend"
            subtitle="Average attendance over the last 7 days"
            icon={CalendarDays}
            sample={trend ? trend.sample : true}
          >
            {trend ? (
              <ResponsiveContainer width="100%" height={235}>
                <AreaChart data={trend.points} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="attendance-trend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={tokenColor('--color-accent')} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={tokenColor('--color-accent')} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={tokenColor('--color-border')} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 11,
                      fill: tokenColor('--color-text-muted'),
                    }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 11,
                      fill: tokenColor('--color-text-muted'),
                    }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => [`${value}%`, 'Attendance']}
                  />
                  <Area
                    type="monotone"
                    dataKey="percent"
                    stroke={tokenColor('--color-accent')}
                    strokeWidth={2.5}
                    fill="url(#attendance-trend)"
                    animationDuration={600}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton height="235px" />
            )}
          </ChartCard>
        </motion.div>

        <motion.div {...entrance(0.1)}>
          <ChartCard
            title="Today's attendance"
            subtitle="Strength split across all classes"
            icon={Activity}
          >
            {ring ? <AttendanceRing counts={ring} /> : <Skeleton height="210px" />}
          </ChartCard>
        </motion.div>
      </div>

      <div className="dash-grid dash-grid-3">
        <motion.div {...entrance(0.05)}>
          <ChartCard title="Fee collection" subtitle="Collected vs pending" icon={PieIcon}>
            {feeDonut ? <FeeDonut donut={feeDonut} /> : <Skeleton height="210px" />}
          </ChartCard>
        </motion.div>

        <motion.div {...entrance(0.1)}>
          <ChartCard title="Students per class" subtitle="Live class strength" icon={BarChart3}>
            {perClass.length ? (
              <ResponsiveContainer width="100%" height={235}>
                <BarChart data={perClass} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={tokenColor('--color-border')} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    tick={{
                      fontSize: 11,
                      fill: tokenColor('--color-text-muted'),
                    }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 11,
                      fill: tokenColor('--color-text-muted'),
                    }}
                  />
                  <Tooltip cursor={{ fill: tokenColor('--color-accent-soft') }} contentStyle={chartTooltipStyle} />
                  <Bar
                    dataKey="count"
                    name="Students"
                    fill={tokenColor('--color-accent')}
                    radius={[8, 8, 0, 0]}
                    maxBarSize={46}
                    animationDuration={600}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                title="No students yet"
                message="Add students to see class strength here."
              />
            )}
          </ChartCard>
        </motion.div>

        <motion.div {...entrance(0.15)}>
          <ChartCard title="Top pending fees" subtitle="Highest balances first" icon={Wallet}>
            {topPending.length ? (
              <>
                <ul className="dash-pending-list">
                  {topPending.map((fee) => (
                    <li className="dash-pending-row" key={fee.studentId}>
                      <span className="dash-avatar">{initials(fee.studentName)}</span>
                      <div className="dash-pending-info">
                        <strong>{fee.studentName}</strong>
                        <span>
                          {fee.rollNumber} · {fee.className}
                        </span>
                      </div>
                      <span className="dash-pending-amount">
                        {formatCurrency(fee.pendingAmount)}
                      </span>
                      <Button
                        variant="ghost"
                        className="dash-remind-btn"
                        onClick={() => setRemindedId(fee.studentId)}
                        aria-label={`Send payment reminder to ${fee.studentName}`}
                      >
                        <Bell size={16} aria-hidden="true" />
                        Remind
                      </Button>
                    </li>
                  ))}
                </ul>
                {remindedId && (
                  <p className="dash-remind-note">
                    Reminder is shown as a demo — there is no reminder API yet
                    (suggest <code>POST /api/admin/reminders</code>).
                  </p>
                )}
              </>
            ) : (
              <EmptyState title="No pending fees" message="All outstanding balances are cleared." />
            )}
          </ChartCard>
        </motion.div>
      </div>

      <div className="dash-grid dash-grid-2-equal">
        <motion.div {...entrance(0.05)}>
          <ChartCard title="Recent payments" subtitle="Latest collections across the school" icon={Receipt}>
            {recentPayments.length ? (
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Date</th>
                      <th>Received by</th>
                      <th>
                        <span className="sr-only">View receipt</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td>
                          <strong>{payment.studentName}</strong>
                        </td>
                        <td className="dash-table-amount">{formatCurrency(payment.amount)}</td>
                        <td>
                          <Badge tone={badgeTone(payment.method)}>{payment.method}</Badge>
                        </td>
                        <td>{formatDate(payment.paymentDate)}</td>
                        <td>{payment.receivedBy}</td>
                        <td>
                          <button
                            type="button"
                            className="dash-icon-btn"
                            onClick={() => navigate('/admin/fees')}
                            aria-label={`View receipt for ${payment.studentName}`}
                          >
                            <Receipt size={16} aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No payments yet" message="Recorded payments will appear here." />
            )}
          </ChartCard>
        </motion.div>

        <motion.div {...entrance(0.1)}>
          <ChartCard
            title="Latest announcements"
            subtitle="School-wide notices"
            icon={Megaphone}
            sample
          >
            <div className="dash-announcements">
              {Array.from({ length: 5 }).map((_, index) => (
                <div className="dash-announcement" key={index} aria-hidden="true">
                  <Skeleton width="55%" height="0.9rem" />
                  <Skeleton width="100%" height="0.75rem" />
                  <Skeleton width="100%" height="0.75rem" />
                  <Skeleton width="66%" height="0.75rem" />
                </div>
              ))}
            </div>
            <p className="dash-missing-note">
              <Info size={13} aria-hidden="true" />
              No <code>GET /api/announcements</code> endpoint yet — placeholders shown instead.
            </p>
          </ChartCard>
        </motion.div>
      </div>
    </>
  );
}