import React from 'react'
import StatusBadge from './StatusBadge'

const UserReportModal = ({ isOpen, onClose, user, transactions, userPayments, currency }) => {
  if (!isOpen) return null
  return (
    <div className="report-overlay">
      <div className="report-modal">
        <header>
          <div>
            <p className="subtle">Report preview</p>
            <h2>{user?.fullName}</h2>
            <p className="muted">{user?.email}</p>
          </div>
          <button className="ghost-btn" onClick={onClose}>
            Close
          </button>
        </header>
        <div className="report-summary">
          <div>
            <p>Role</p>
            <strong>{user?.role}</strong>
          </div>
          <div>
            <p>Total volume</p>
            <strong>{currency.format(userPayments.total)}</strong>
          </div>
          <div>
            <p>Transactions</p>
            <strong>{userPayments.count}</strong>
          </div>
          <div>
            <p>Non-successful</p>
            <strong>{userPayments.nonSuccess}</strong>
          </div>
        </div>
        <div className="report-table-wrapper">
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
              {transactions.map((tx) => (
                <tr key={tx.transactionId || tx.id}>
                  <td>{tx.transactionId || tx.id}</td>
                  <td>{tx.merchantName || tx.merchant || '-'}</td>
                  <td>{currency.format(Number(tx.amount) || 0)}</td>
                  <td>{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : tx.date || '-'}</td>
                  <td>
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UserReportModal
