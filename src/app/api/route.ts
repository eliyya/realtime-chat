import EventEmitter from 'events'
import { NextRequest, NextResponse } from 'next/server'
import { EVENT_NAMES, events } from '@/lib/constants'

type user_phone = string
type session_id = string

const users = new Map<user_phone, Set<session_id>>()
const emitter = new EventEmitter() as MyEventEmitter

interface MyEventEmitter {
    emit<T extends keyof events>(event: string, args: {name:T, value: events[T]}): void
    on<T extends keyof events>(event: string, listener: (args: {name:T, value: events[T]}) => void): void
    once<T extends keyof events>(event: string, listener: (args: {name:T, value: events[T]}) => void): void
    removeListener(event: string, listener: (args: any) => void): void
    removeAllListeners(event?: string | symbol | undefined): void
}

export async function POST(req: NextRequest) {
    const user_phone = req.cookies.get('user_phone')?.value
    const session_id = req.cookies.get('session_id')?.value
    if (!user_phone || !session_id) return new NextResponse('Unauthorized', { status: 401 })
    if (!users.has(user_phone)) users.set(user_phone, new Set())
    const all = users.get(user_phone)!
    if (all.has(session_id)) {
        const event = await req.json()
        console.log('event', event)
        if (event.name === EVENT_NAMES.infoRequest) {
            const other = Array.from(all).filter(e=>e!==session_id)[0]
            if (other) emitter.emit(`${user_phone}+${other}`, { name: EVENT_NAMES.infoRequest, value: { from: session_id } })
            return new NextResponse(JSON.stringify({ user_phone, session_id, requested: other }))
        }
        else if (event.name === EVENT_NAMES.deleteRequest) {
            all.delete(event.value)
            emitter.emit(`${user_phone}+${event.value}+delete`, { name: 'delete_request', value: event.value})
            const other = Array.from(all)[0]
            if (other) emitter.emit(`${user_phone}+${other}`, { name: EVENT_NAMES.infoRequest, value: { from: session_id } })
            return new NextResponse(JSON.stringify({ user_phone, session_id, requested: other }))
        } else if (event.name === EVENT_NAMES.infoResponse) {
            const other = Array.from(all)[0]
            if (other) emitter.emit(`${user_phone}+${event.value.to}`, { name: EVENT_NAMES.infoResponse, value: { name: event.value.name, user_phone } })
        } else if (event.name === EVENT_NAMES.sendMessage) {
            all.forEach(other=>{
                // emitter.emit(`${user_phone}+${other}`, { name: eventNames.sendMessage, value: { to: event.value.to, message: event.value.message } })
            })
        }
        return new NextResponse(JSON.stringify({status: 'ok'}))
    } else {
        const other = Array.from(all)[0]
        all.add(session_id)
        if (other) emitter.emit(`${user_phone}+${other}`, { name: EVENT_NAMES.infoRequest, value: { from: session_id } })
        return new NextResponse(JSON.stringify({ user_phone, session_id, requested: other }))
    }
}

export async function GET(req: NextRequest) {
    const user_phone = req.cookies.get('user_phone')?.value
    const session_id = req.cookies.get('session_id')?.value
    console.log('user_phone', user_phone, 'session_id', session_id)
    if (!user_phone || !session_id) {
        return new NextResponse('Unauthorized', { status: 401 })
    }
    
    return new Response(new ReadableStream({
        async pull(controller) {
            emitter.removeAllListeners(`${user_phone}+${session_id}`)
            emitter.on(`${user_phone}+${session_id}`, (ev)=>controller.enqueue(JSON.stringify(ev)))
            emitter.removeAllListeners(`${session_id}+${user_phone}+delete`)
            emitter.once(`${session_id}+${user_phone}+delete`, () => {
                emitter.removeAllListeners(`${user_phone}+${session_id}`)
                controller.close()                
                console.log('closed', user_phone, session_id)
            })            
        },
    }))
}

export async function DELETE(req: NextRequest) {
    const user_phone = req.cookies.get('user_phone')?.value
    const session_id = req.cookies.get('session_id')?.value
    users.get(user_phone??'')?.delete(session_id??'')
    emitter.emit(`${user_phone}+${session_id}+delete`, { name: 'delete_request', value: session_id!})
    console.log('delete', user_phone, session_id)
    
    return new NextResponse('ok')
}