'use client'

import { useDB } from '@/hooks/useDB'
import { useSelectedView } from '@/hooks/globalStates'
import { useEffect } from 'react'
import { ClientEvent, ClientEventName, View } from '@/lib/constants'

export function EventHandler() {
    const { setSelectedView } = useSelectedView()
    const { session, removeMessageToSend, addMessage, addSession } = useDB()
    
    useEffect(() => {(async ()=>{        
        if (!session?.token) return setSelectedView(View.Login)
        setSelectedView(View.Chat)

        const decoder = new TextDecoder()

        fetch('/api', { headers: { authorization: session.token } })
            .then(async r => {
                if (r.status !== 200) return alert('unable to connect to server')
                const reader = r.body!.getReader()
                
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    try {
                        const event = JSON.parse(decoder.decode(value)) as ClientEvent
                        console.log('event', event)                     

                        if (event.event === ClientEventName.DuplicateConnection) {
                            alert('Duplicate Connection')
                            return setSelectedView(View.DuplicateConnection)
                        } else if (event.event === ClientEventName.NewMessage) {
                            removeMessageToSend(event.data.id)
                            addMessage(event.data)
                        } else if (event.event === ClientEventName.NewConnection) {
                            console.log('New Connection', event.data)
                            console.log(event.data.session_id, session.session_id)
                            
                            if (session.session_id === event.data.session_id) return
                            console.log('New Connection2', event.data)
                            
                            const {platform,session_id} = event.data
                            addSession({
                                phone: session.phone,
                                platform,
                                session_id,
                            })
                        }
                    } catch (error) {
                        console.log('Error decoding event', decoder.decode(value))
                    }
                }
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    })()}, [session])
    
    return <></>
}