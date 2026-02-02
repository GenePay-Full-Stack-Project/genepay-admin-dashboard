import { useMemo, useRef, useState, useEffect } from 'react'
import './App.css'
import * as api from './api'
import {
  AuthCard,
  Sidebar,
  DashboardPanels,
  MerchantsPanel,
  UsersPanel,
  TransactionsPanel,
  UserReportModal,
} from './components'

// Removed static mock data — UI now exclusively uses backend-provided data.
// If you need local mock data while backend is offline, re-add sample objects here.

const currency = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
  maximumFractionDigits: 0,
})

// StatCard, StatusBadge and other visual pieces are now extracted to `src/components`.

function App() {
  const [selectedUserId, setSelectedUserId] = useState('')
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [loginForm, setLoginForm] = useState(() => {
    const saved = localStorage.getItem('bio_admin_login')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return { email: parsed.email || '', password: parsed.password || '', remember: true }
      } catch {
        return { email: '', password: '', remember: false }
      }
    }
    return { email: '', password: '', remember: false }
  })
  const [loginError, setLoginError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  // token and fetched data
  const [token, setToken] = useState(() => localStorage.getItem('bio_admin_token'))
  const [users, setUsers] = useState([])
  const [merchants, setMerchants] = useState([])
  const [transactions, setTransactions] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [platformBalance, setPlatformBalance] = useState(null)
  const [merchantRevenues, setMerchantRevenues] = useState({})
  const [userTransactions, setUserTransactions] = useState([])
  // registration removed - admin login only
  const dashboardSectionRef = useRef(null)
  const usersSectionRef = useRef(null)
  const merchantsSectionRef = useRef(null)
  const recentTransactionsSectionRef = useRef(null)
  const transactionsSectionRef = useRef(null)

  const scrollToSection = (ref, navItem) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (navItem) setActiveNav(navItem)
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault()
    setLoginError('')
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!loginForm.email || !emailRegex.test(loginForm.email)) {
      setLoginError('Please enter a valid email address')
      return
    }
    
    // Validate password length (minimum 6 characters)
    if (!loginForm.password || loginForm.password.length < 6) {
      setLoginError('Password must be at least 6 characters long')
      return
    }
    
    // If validation passes, navigate to dashboard
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('bio_admin_token')
    setToken(null)
    setIsAuthenticated(false)
    // Optionally reset other state
    setUsers([])
    setMerchants([])
    setTransactions([])
    setDashboard(null)
    setPlatformBalance(null)
    setMerchantRevenues({})
    setUserTransactions([])
    setSelectedUserId('')
  }

  const loadData = async (tok) => {
    try {
      const [dashboardData, usersData, merchantsData, transactionsData, balanceData] = await Promise.all([
        api.getDashboard(tok),
        api.getAllUsers(tok),
        api.getAllMerchants(tok),
        api.getAllTransactions(tok),
        api.getPlatformBalance(tok),
      ])
      setDashboard(dashboardData)
      setUsers(usersData)
      setMerchants(merchantsData)
      setTransactions(transactionsData)
      setPlatformBalance(balanceData)

      // Calculate merchant revenues
      const revenues = {}
      for (const merchant of merchantsData) {
        try {
          const merchantTxs = await api.getMerchantTransactions(merchant.id, tok)
          const merchantData = merchantTxs?.content || merchantTxs || []
          const totalRevenue = merchantData
            .filter(tx => tx.status === 'COMPLETED')
            .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0)
          revenues[merchant.id] = totalRevenue
        } catch (err) {
          console.error(`Failed to load transactions for merchant ${merchant.id}:`, err)
          revenues[merchant.id] = 0
        }
      }
      setMerchantRevenues(revenues)
    } catch (err) {
      console.error('Failed to load data:', err)
      // Optionally handle error, e.g., logout if token invalid
      if (err.status === 401) {
        handleLogout()
      }
    }
  }

  // centralize display variables and derived state
  const displayUsers = users
  const displayMerchants = merchants
  const displayTransactions = transactions

  // when users load, set default selected user id
  useEffect(() => {
    if (!selectedUserId && displayUsers && displayUsers.length > 0) {
      setSelectedUserId(String(displayUsers[0].id))
    }
  }, [displayUsers, selectedUserId])

  // Fetch user transactions when selected user changes
  useEffect(() => {
    const fetchUserTransactions = async () => {
      if (selectedUserId && token) {
        try {
          const response = await api.getUserTransactions(selectedUserId, token)
          const txData = response?.content || response || []
          setUserTransactions(txData)
        } catch (err) {
          console.error('Failed to load user transactions:', err)
          setUserTransactions([])
        }
      }
    }
    fetchUserTransactions()
  }, [selectedUserId, token])

  // Check for existing token on mount
  useEffect(() => {
    const tok = localStorage.getItem('bio_admin_token')
    if (tok) {
      setToken(tok)
      setIsAuthenticated(true)
      loadData(tok)
    }
  }, [])

  const selectedUser = useMemo(() => displayUsers.find((user) => String(user.id) === String(selectedUserId)), [displayUsers, selectedUserId])
  const selectedUserTransactions = useMemo(
    () => userTransactions,
    [userTransactions],
  )

  const userPayments = selectedUserTransactions.reduce(
    (acc, tx) => {
      acc.total += Number(tx.amount) || 0
      acc.count += 1
      if ((tx.status || '').toUpperCase() !== 'COMPLETED') {
        acc.nonSuccess += 1
      }
      return acc
    },
    { total: 0, count: 0, nonSuccess: 0 },
  )
//print report function
  const handlePrintReport = () => {
    if (!selectedUser) return
    const reportWindow = window.open('', '_blank', 'width=900,height=700')
    if (!reportWindow) return
    const tableRows = selectedUserTransactions
      .map(
        (tx) => `
        <tr>
          <td>${tx.transactionId || tx.id}</td>
          <td>${tx.merchantName || tx.merchant || '-'}</td>
          <td>${currency.format(Number(tx.amount) || 0)}</td>
          <td>${tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : tx.date || '-'}</td>
          <td>${tx.status}</td>
        </tr>
      `,
      )
      .join('')

    reportWindow.document.write(`
      <html>
        <head>
          <title>${selectedUser.name} - FaceWallet Report</title>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; padding: 24px; color: #0a005a; }
            h1 { margin: 0 0 4px; }
            h2 { margin: 24px 0 12px; }
            .meta { color: #475569; margin: 4px 0; }
            .summary { display: flex; gap: 16px; flex-wrap: wrap; margin: 16px 0; }
            .summary div { border: 1px solid rgba(10,0,90,0.2); border-radius: 14px; padding: 12px 18px; min-width: 150px; background: #f8fafc; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px; }
            th { text-align: left; border-bottom: 2px solid rgba(10,0,90,0.2); padding: 8px 4px; text-transform: uppercase; font-size: 12px; color: #64748b; }
            td { border-bottom: 1px solid rgba(10,0,90,0.1); padding: 8px 4px; }
          </style>
        </head>
        <body>
          <h1>FaceWallet - User Report</h1>
          <p class="meta">Generated on ${new Date().toLocaleString()}</p>
          <h2>${selectedUser.fullName}</h2>
          <p class="meta">${selectedUser.email}</p>
          <div class="summary">
            <div>
              <p>Total volume</p>
              <strong>${currency.format(userPayments.total)}</strong>
            </div>
            <div>
              <p>Transactions</p>
              <strong>${userPayments.count}</strong>
            </div>
            <div>
              <p>Non-successful</p>
              <strong>${userPayments.nonSuccess}</strong>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Merchant</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows || '<tr><td colspan="5">No transactions available</td></tr>'}
            </tbody>
          </table>
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `)
    reportWindow.document.close()
  }

  const totalPayments = displayTransactions.reduce((sum, tx) => sum + tx.amount, 0)
  const dailyStatsMap = displayTransactions.reduce((acc, tx) => {
    acc[tx.date] = (acc[tx.date] || 0) + tx.amount
    return acc
  }, {})
  const dailyStats = Object.entries(dailyStatsMap)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  if (!isAuthenticated) {
    return (
      <AuthCard
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        loginError={loginError}
        handleLoginSubmit={handleLoginSubmit}
      />
    )
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        refs={{
          dashboardRef: dashboardSectionRef,
          merchantsRef: merchantsSectionRef,
          usersRef: usersSectionRef,
          transactionsRef: recentTransactionsSectionRef,
          reportsRef: transactionsSectionRef,
        }}
      />

      <main className="page">
        <header className="page-header" ref={dashboardSectionRef}>
          <div>
            <h1>Dashboard</h1>
            {platformBalance && (
              <div className="platform-stats">
                <p>Total Transaction Volume: {currency.format(platformBalance.totalTransactionVolume || 0)}</p>
                <p>Platform Income: {currency.format(platformBalance.totalFeesCollected || 0)}</p>
              </div>
            )}
          </div>
          <div className="admin-chip">
            <span className="avatar">AD</span>
            <div>
              <p className="name">Admin User</p>
              <small>System Super Admin</small>
            </div>
            <button className="ghost-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <DashboardPanels dashboard={dashboard} platformBalance={platformBalance} currency={currency} />

        <section className="panels">
            <div className="panel" ref={merchantsSectionRef}>
              <MerchantsPanel merchants={displayMerchants} merchantRevenues={merchantRevenues} currency={currency} />
            </div>
        </section>

        <div className="panel wide" ref={usersSectionRef}>
          <UsersPanel users={displayUsers} />
        </div>

        <div className="panel wide" ref={recentTransactionsSectionRef}>
          <header>
            <div>
              <p className="subtle">Payments overview</p>
              <h2>Recent transactions</h2>
            </div>
            <button className="ghost-btn">View all</button>
          </header>
          <TransactionsPanel transactions={displayTransactions} currency={currency} />
          {/* If you still need a dedicated table element here for any additional content, keep it under the component */}
          {/* This block intentionally replaced by `TransactionsPanel` component */}
        </div>

        <section className="panel wide" ref={transactionsSectionRef}>
          <header>
            <div>
              <p className="subtle">Individual insights</p>
              <h2>User transaction report</h2>
            </div>
            <div className="header-actions">
              <select
                className="user-select"
                value={selectedUserId}
                onChange={(event) => setSelectedUserId(event.target.value)}
              >
                {displayUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName || user.name}
                  </option>
                ))}
              </select>
              <button className="ghost-btn" onClick={() => setIsReportOpen(true)}>
                View report
              </button>
              <button className="ghost-btn" onClick={handlePrintReport}>
                Print PDF
              </button>
            </div>
          </header>

          <div className="user-report-grid">
            <div className="user-profile">
              <h3>{selectedUser?.name}</h3>
              <p>{selectedUser?.email}</p>
              <p className="tag">{selectedUser?.role}</p>
            </div>
            <div className="summary-chips">
              <div className="chip">
                <p>Total transactions</p>
                <strong>{userPayments.count}</strong>
              </div>
              <div className="chip">
                <p>Total volume</p>
                <strong>{currency.format(userPayments.total)}</strong>
              </div>
              <div className="chip">
                <p>Non-successful</p>
                <strong>{userPayments.nonSuccess}</strong>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Merchant</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedUserTransactions.map((tx) => (
                <tr key={tx.transactionId || tx.id}>
                  <td>{tx.transactionId || tx.id}</td>
                  <td>{tx.merchantName || tx.merchant || '-'}</td>
                  <td>{currency.format(Number(tx.amount) || 0)}</td>
                  <td>{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : tx.date || '-'}</td>
                  <td>
                    <span className={`status-badge ${((tx.status) || '').toLowerCase()}`}>{tx.status}</span>
                  </td>
                </tr>
              ))}
              {selectedUserTransactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-row">
                    No transactions recorded for this user yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <UserReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          user={selectedUser}
          transactions={selectedUserTransactions}
          userPayments={userPayments}
          currency={currency}
        />
      </main>
    </div>
  )
}

export default App
