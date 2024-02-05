import { NextRequest, NextResponse } from 'next/server'
import {randomUUID} from 'node:crypto'

type email = string
type token = string

const sesionRequest = new Map<email, token>()

export async function POST(req: NextRequest) {
    const form = await req.formData()
    const uid = randomUUID()
    const email = form.get('email') as string
    if (!email) return new NextResponse('need email', {
        status: 401
    })
    console.log(email, uid)
    sesionRequest.set(email, uid)
    return new NextResponse(uid)
}

export async function GET(req:NextRequest) {
    const uid = req.nextUrl.searchParams.get('uid')
    console.log(uid)
    return new NextResponse(uid)
    // res.writeHead(200, {
    //     'Cache-Control': 'no-cache',
    //     'Content-Type': 'text/event-stream',
    //   });
    //   res.write('data: Processing...');
    //   /* https://github.com/expressjs/compression#server-sent-events
    //     Because of the nature of compression this module does not work out of the box with
    //     server-sent events. To compress content, a window of the output needs to be
    //     buffered up in order to get good compression. Typically when using server-sent
    //     events, there are certain block of data that need to reach the client.
    
    //     You can achieve this by calling res.flush() when you need the data written to
    //     actually make it to the client.
    // */
    //   res.flush();
    //   setTimeout(() => {
    //     res.write('data: Processing2...');
    //     res.flush();
    //   }, 1000);
}