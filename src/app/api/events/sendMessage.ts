import { ServerEventFunctionHandlerProps } from '@/lib/constants'
import { NextResponse } from 'next/server'
import { clients } from '@/lib/Clients'

export const sendMessage = async ({ 
    body, 
    session
}:ServerEventFunctionHandlerProps) => {    
    const clientToSend = clients.get(body.data.to)
    if (!clientToSend) return new NextResponse('client not online', { status: 404 })
    
    clientToSend.sendMessage({...body.data, from: session.phone})
    if (body.data.to !== session.phone) clients.get(session.phone)?.sendMessage({...body.data, from: session.phone})

    return new NextResponse('ok')
}