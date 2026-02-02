import React from 'react'

const UsersPanel = ({ users }) => (
  <section className="panel wide" id="users-panel">
    <header>
      <div>
        <p className="subtle">Latest activity</p>
        <h2>User registrations</h2>
      </div>
      <div className="header-actions">
        <button className="ghost-btn">Filters</button>
        <button className="primary-btn">Invite admin</button>
      </div>
    </header>
    <table>
      <thead>
        <tr>
          <th>User ID</th>
          <th>Full name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Joined</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.fullName || user.name}</td>
            <td>{user.email}</td>
            <td>{user.phoneNumber || '-'}</td>
            <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : user.joined || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
)

export default UsersPanel
