'use client'
import { useDB } from '@/hooks/useDB'
import ChatOption from './ChatOption'

export default function Chats() {
    const {chats} = useDB()
    
    return (<>
        {chats.map((chat) => 
            <ChatOption key={chat.phone} chat={chat} />)}
    </>
    )
}