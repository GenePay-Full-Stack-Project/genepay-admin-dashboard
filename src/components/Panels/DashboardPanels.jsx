import React from 'react'
import StatCard from '../StatCard'

const DashboardPanels = ({ dashboard, platformBalance, currency }) => {
  if (!dashboard && !platformBalance) {
    return (
      <section className="stats-grid">
        <StatCard label="Loading..." value="—" />
      </section>
    )
  }

  const totalUsers = dashboard?.totalUsers || 0
  const totalMerchants = dashboard?.totalMerchants || 0
  const totalTransactionVolume = platformBalance?.totalTransactionVolume || 0
  const failedTransactions = dashboard?.failedTransactions || 0
  const totalTransactions = dashboard?.totalTransactions || 0
  const failureRate = totalTransactions > 0 ? ((failedTransactions / totalTransactions) * 100).toFixed(1) : 0

  return (
    <>
      <section className="stats-grid">
        <StatCard label="Registered users" value={totalUsers} />
        <StatCard label="Merchants onboarded" value={totalMerchants} />
        <StatCard label="Total transaction volume" value={currency.format(totalTransactionVolume)} />
        <StatCard label="Failed transactions" value={failedTransactions} trendLabel={`Failure rate ${failureRate}%`} />
      </section>
    </>
  )
}

export default DashboardPanels
