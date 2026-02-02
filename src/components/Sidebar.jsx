import React from 'react'

const Sidebar = ({ activeNav, setActiveNav, refs }) => {
  const { dashboardRef, merchantsRef, usersRef, transactionsRef, reportsRef } = refs

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="pulse" />
        <div>
          <p className="brand-title">FaceWallet Admin</p>
        </div>
      </div>
      <nav>
        <p className="nav-label">Overview</p>
        <a
          className={`nav-link ${activeNav === 'Dashboard' ? 'active' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => {
            scrollToSection(dashboardRef)
            setActiveNav('Dashboard')
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              scrollToSection(dashboardRef)
              setActiveNav('Dashboard')
            }
          }}
        >
          Dashboard
        </a>
        <a
          className={`nav-link ${activeNav === 'Merchants' ? 'active' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => {
            scrollToSection(merchantsRef)
            setActiveNav('Merchants')
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              scrollToSection(merchantsRef)
              setActiveNav('Merchants')
            }
          }}
        >
          Merchants
        </a>
        <a
          className={`nav-link ${activeNav === 'Users' ? 'active' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => {
            scrollToSection(usersRef)
            setActiveNav('Users')
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              scrollToSection(usersRef)
              setActiveNav('Users')
            }
          }}
        >
          Users
        </a>
        <a
          className={`nav-link ${activeNav === 'Transactions' ? 'active' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => {
            scrollToSection(transactionsRef)
            setActiveNav('Transactions')
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              scrollToSection(transactionsRef)
              setActiveNav('Transactions')
            }
          }}
        >
          Transactions
        </a>
        <a
          className={`nav-link ${activeNav === 'User Reports' ? 'active' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => {
            scrollToSection(reportsRef)
            setActiveNav('User Reports')
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              scrollToSection(reportsRef)
              setActiveNav('User Reports')
            }
          }}
        >
          User Reports
        </a>
      </nav>
    </aside>
  )
}

export default Sidebar
