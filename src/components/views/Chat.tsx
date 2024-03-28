'use client'

import { useSelectedView } from '@/hooks/globalStates'

export function Chat(){
    const { selectedChat } = useSelectedView()
    
    return ( 
        <>
            <span></span>
            <span>
                {
                    !selectedChat 
                        ? 'select a chat to open it'
                        : `chat opened ${selectedChat}`
                }
            </span>
            <span></span>
        </>
    )
}