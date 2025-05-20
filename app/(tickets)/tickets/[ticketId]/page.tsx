import React from 'react'

const SpecificTicketPage = async ({params}:{params:Promise<{ticketId:string}>}) => {
  const {ticketId} = await params;
  return (
    <div>
        <h1>Specific Ticket Page</h1>
        <p>{ticketId}</p>
    </div>
  )
}

export default SpecificTicketPage