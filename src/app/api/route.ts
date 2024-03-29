import { NextRequest, NextResponse } from 'next/server'
import EventEmitter from 'events'
import { getSession } from '@/server/auth'
import { ClientEventName, ForegroundColors, FormatColors } from '@/lib/constants'
import { randomUUID } from 'crypto'

const eventEmitter = new EventEmitter()
const clients = new Map<string, Array<{session_id: string;phone: string;socket_id: string}>>()

export async function GET(req: NextRequest) {
    // check session
    const userAgent = req.headers.get('user-agent')?.toLowerCase()??''
    const platform = userAgent.includes('android') ? 'android' : userAgent.includes('linux') ? 'linux' : userAgent.includes('windows') ? 'windows' : 'unknown'
    const token = req.headers.get('authorization')
    if (!token) return new NextResponse('unauthorized', { status: 401 })
    const session = await getSession(token)
    if (!session) return new NextResponse('unauthorized', { status: 401 })
    
    // check if client is already connected
    const { phone, session_id } = session
    const socket_id = randomUUID()
    clients.has(phone) || clients.set(phone, [])
    clients.set(phone, clients.get(phone)!.filter(s => {
        if (s.session_id !== session_id) return true
        eventEmitter.emit(`${phone}+${session_id}+${s.socket_id}+cancel`)    
    }))
    clients.get(phone)?.push({ session_id, phone, socket_id: socket_id })

    const onCancell = () => {
        eventEmitter.removeAllListeners(`${phone}+${session_id}`)
        clients.set(phone, clients.get(phone)!.filter(s => s.socket_id !== socket_id))
        if (!clients.get(phone)?.length) clients.delete(phone)
        console.log(ForegroundColors.Blue, 'Disconnected', FormatColors.Reset, phone, session_id, 'events:', eventEmitter.listeners(`${phone}+${session_id}`).length)
    }
    // create events stream
    const response = new NextResponse(new ReadableStream({
        cancel: () => onCancell(),
        start(controller) {
            eventEmitter.on(`${phone}+${session_id}+${socket_id}`, (event, data) => {
                try {
                    controller.enqueue(JSON.stringify({event, data}))
                } catch (error) {
                    console.log('error enqueue', (error as Error).message)
                }
            })            
            eventEmitter.once(`${phone}+${session_id}+${socket_id}+cancel`, () => {
                console.log('trying to close', phone, session_id, socket_id)
                try {
                    controller.enqueue(JSON.stringify({event: ClientEventName.DuplicateConnection, data: {phone, session_id}}))
                    controller.close()
                } catch {}4
                eventEmitter.removeAllListeners(`${phone}+${session_id}+${socket_id}`)
            })
        },
    }))

    console.log(ForegroundColors.Blue, 'Connected', FormatColors.Reset, phone, session_id, 'events:', eventEmitter.listeners(`${phone}+${session_id}+${socket_id}`).length)
    clients.get(phone)?.forEach(session => eventEmitter.emit(`${phone}+${session.session_id}+${session.socket_id}`, ClientEventName.NewConnection, {session_id, platform}))
    
    return response
}