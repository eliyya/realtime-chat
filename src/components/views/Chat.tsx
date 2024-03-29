'use client'

import { useSelectedView } from '@/hooks/globalStates'
import { useDB } from '@/hooks/useDB'
import { ServerEventName } from '@/lib/constants'
import { useState } from 'react'

export function Chat(){
    const { selectedChat } = useSelectedView()
    const [message, setMessage] = useState('')
    const { session, addMessageToSend, messagesToSend, messages, sessions } = useDB()
    const sendMessage = () => {
        if (!message) return
        const m = {
            message,
            created_at: Date.now(),
            id: crypto.randomUUID(),
            to: selectedChat?.phone!
        }
        addMessageToSend(m)
        fetch('/api', {
            method: 'POST',
            headers: { authorization: session?.token! },
            body: JSON.stringify({
                event: ServerEventName.SendMessage,
                data: m
            })
        }).then(async r => {
            if (r.status !== 200) return alert('unable to send message')
            setMessage('')  
        }).catch(console.info)
    }

    if (!selectedChat) return (
        <>
            <span></span>
            <span>select a chat to open it</span>
            <span></span>
        </>
    )
    
    return ( 
        <>
            <span className='p-4 bg-slate-950' >{selectedChat.name}</span>
            <div className='bg-slate-950/20 flex-1'>
                {[...messagesToSend, ...messages].sort((a,b)=> a.created_at - b.created_at).map(m => (
                    <div key={m.id} className='p-2' >
                        <span>{m.message}</span>
                    </div>
                ))}
            </div>
            <div className='flex gap-1' >
                <input type='text' value={message} onChange={e => setMessage(e.target.value)} className='flex-1 border rounded-md bg-transparent p-1' placeholder='type a message' />
                <button className='p-2 border rounded-md' onClick={sendMessage} >send</button>
            </div>
        </>
    )
}