import EventEmitter from 'events'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
const emitter = new EventEmitter()
   
export async function GET(req: NextRequest) {
    const user = req.headers.get('user_id')
    console.log(user)
   
    return new Response(new ReadableStream({
        async pull(controller) {
            controller.enqueue(user)
            await new Promise(resolve => setTimeout(resolve, 3000))
            controller.enqueue('hello')
            await new Promise(resolve => setTimeout(resolve, 3000))
            controller.enqueue('world')
            controller.close()
            // const { value, done } = await iterator.next()
   
            // if (done) {
            //     controller.close()
            // } else {
            //     controller.enqueue(value)
            // }
        },
    }))
}