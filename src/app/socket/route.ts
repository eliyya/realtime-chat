import { NextRequest, NextResponse } from 'next/server'
import EventEmitter from 'events'

const eventEmitter = new EventEmitter()

export async function GET(req: NextRequest) {
    // get token from cookies
    
    return new Response(new ReadableStream({
        cancel(r) {
            console.log('canceled', r)
        },
        async start(controller) {         
        },
    }))
}