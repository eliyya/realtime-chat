'use client'

import { useDB } from '@/hooks/useDB'
import { useSelectedView } from '@/hooks/globalStates'
import { useEffect } from 'react'
import { ClientEvent, ClientEventName, View } from '@/lib/constants'

export function EventHandler() {
    const {setSelectedView} = useSelectedView()
    const {session} = useDB()
    
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
                        if (event.event === ClientEventName.DuplicateConnection) {
                            alert('Duplicate Connection')
                            return setSelectedView(View.DuplicateConnection)
                        }
                        console.log('event', event)                        
                    } catch (error) {
                        console.log('Error decoding event', decoder.decode(value))
                    }
                }
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    })()}, [session])
    
    return <></>
}