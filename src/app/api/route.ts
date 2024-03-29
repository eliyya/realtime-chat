import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/server/auth'
import { ClientEventName, ForegroundColors, FormatColors, ServerEvent, ServerEventName } from '@/lib/constants'
import { sendMessage } from './events/sendMessage'
import { Client, clients } from '@/lib/Clients'

export async function GET(req: NextRequest) {
    // check session
    const token = req.headers.get('authorization')
    if (!token) return new NextResponse('unauthorized', { status: 401 })
    const session = await getSession(token)
    if (!session) return new NextResponse('unauthorized', { status: 401 })
    
    // check if client is already connected
    const userAgent = req.headers.get('user-agent')?.toLowerCase()??''
    const platform = userAgent.includes('android') ? 'android' : userAgent.includes('linux') ? 'linux' : userAgent.includes('windows') ? 'windows' : 'unknown'
    const { session_id } = session
    clients.has(session.phone) || clients.set(session.phone, new Client(session.phone, platform))
    const client = clients.get(session.phone)!
    const id = client.addSession(session_id)

    // create events stream
    const response = new NextResponse(new ReadableStream({
        cancel: () => client.removeSession(session_id, id),
        start(controller) {
            client.emitter.on(`${session_id}+${id}`, (event, data) => {
                console.log('trying to send', client.phone, session_id, id, event, data)
                try {
                    controller.enqueue(JSON.stringify({event, data}))
                } catch (error) {
                    console.log('error enqueue', (error as Error).message)
                }
            })            
            client.emitter.once(`${session_id}+${id}+cancel`, () => {
                console.log('trying to close', client.phone, session_id, id)
                try {
                    controller.enqueue(JSON.stringify({event: ClientEventName.DuplicateConnection, data: {phone:client.phone, session_id}}))
                    controller.close()
                } catch {}
                client.removeSession(session_id, id)
            })
        },
    }))

    console.log(ForegroundColors.Blue, 'Connected', FormatColors.Reset, client.phone, session_id, 'events:', client.emitter.listeners(`${session_id}+${id}`).length)    
    return response
}

export async function POST(req: NextRequest) {
    // check session
    const token = req.headers.get('authorization')
    if (!token) return new NextResponse('unauthorized', { status: 401 })
    const session = await getSession(token)
    if (!session) return new NextResponse('unauthorized', { status: 401 })
    
    let body: ServerEvent | undefined
    try {
        body = await req.json()
    } catch {}
    if (!body) return new NextResponse('invalid request', { status: 400 })

    if (body.event === ServerEventName.SendMessage) return sendMessage({ body, session, req })
    
    return new NextResponse('ok')
}