import React from 'react'

function Dashboard() {
  return (
    <div className="container">
      <h1>Voters count : <span class="badge bg-secondary">0</span></h1>
      <h1>Proposals count : <span class="badge bg-secondary">0</span></h1>
      <h1>Winner ID : <span class="badge bg-secondary"></span></h1>
    </div>
  )
}

export default Dashboard