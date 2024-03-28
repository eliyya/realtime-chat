'use client'

import { useChats } from '@/hooks/globalStates'
import { EVENT_NAMES } from '@/lib/constants'
import { FormEventHandler } from 'react'


export function AddFriend() {
    const {chats} = useChats()
    
    const createChat: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        const form = new FormData(e.currentTarget)
        const to = form.get('to') as string
        const message = form.get('message') as string

        if (chats.some(c => c.phone === to)) {
            // send message
        } else {
            // create chat
            fetch('/api', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: EVENT_NAMES.sendMessage, value: {to,message}})
            })
        }
    }

    return (
        <>
            <span>New Chat</span>
            <form onSubmit={createChat} className='flex flex-col justify-center items-start p-4 gap-2' >
                <div className='flex w-full' >
                    <label>to</label>
                    <input type="text" name='to' className='bg-transparent border rounded-md ml-1 flex-1' />
                </div>
                <label>message</label>
                <textarea cols={30} rows={10} name='message' className='w-full border rounded-md bg-transparent' ></textarea>
                <input type="submit" value='Send >' className='rounded-md border p-1' />
            </form>
            <span></span>
        </>
    )
}