'use client'
import ChatOption from './ChatOption'
import { useChats } from '@/hooks/globalStates'

export default function Chats() {
    const {chats} = useChats()
    
    return (<>
        {chats.map((chat) => 
            <ChatOption key={chat.id} chat={chat} />)}
    </>
    )
}