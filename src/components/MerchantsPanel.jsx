import React from 'react'

const MerchantsPanel = ({ merchants, merchantRevenues, currency }) => (
  <article className="panel" id="merchants-panel">
    <header>
      <div>
        <h2>Merchants</h2>
      </div>
      
    </header>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Merchant</th>
          <th>Business Type</th>
          <th>Phone</th>
          <th>Revenue</th>
        </tr>
      </thead>
      <tbody>
        {merchants.map((merchant) => {
          const revenue = merchantRevenues?.[merchant.id] || 0
          return (
            <tr key={merchant.id}>
              <td>{merchant.id}</td>
              <td>
                <div className="cell-main">
                  <p>{merchant.businessName || merchant.name}</p>
                  <small>{merchant.email || ''}</small>
                </div>
              </td>
              <td>{merchant.businessType || '-'}</td>
              <td>{merchant.phoneNumber || '-'}</td>
              <td>{currency.format(revenue)}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </article>
)

export default MerchantsPanel
