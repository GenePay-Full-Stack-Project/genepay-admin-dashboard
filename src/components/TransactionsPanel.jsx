import React from 'react'
import StatusBadge from './StatusBadge'

const TransactionsPanel = ({ transactions, currency }) => (
  <section className="panel wide" id="recent-transactions">
    <header>
      <div>
        <p className="subtle">Payments overview</p>
        <h2>Recent transactions</h2>
      </div>
      <button className="ghost-btn">View all</button>
    </header>
    <table>
      <thead>
        <tr>
          <th>Txn ID</th>
          <th>User</th>
          <th>Merchant</th>
          <th>Amount</th>
          <th>Method</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx) => (
          <tr key={tx.transactionId || tx.id}>
            <td>{tx.transactionId ?? tx.id}</td>
            <td>{tx.userName ?? tx.user}</td>
                    <td>{tx.merchantName ?? tx.merchant}</td>
                    <td>{currency.format(Number(tx.amount) || 0)}</td>
            <td>{tx.type ?? tx.method ?? '-'}</td>
            <td>{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : tx.date || '-'}</td>
            <td>
              <StatusBadge status={tx.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
)

export default TransactionsPanel
