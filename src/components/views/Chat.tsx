'use client'

import { useSelectedView } from '@/hooks/globalStates'

export function Chat(){
    const { selectedChat } = useSelectedView()

    if (!selectedChat) return (
        <>
            <span></span>
            <span>select a chat to open it</span>
            <span></span>
        </>
    )
    
    return ( 
        <>
            <span>{selectedChat.name}</span>
            <span>
                {
                    `chat opened ${selectedChat.phone}`
                }
            </span>
            <span></span>
        </>
    )
}