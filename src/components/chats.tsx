'use client'
import { useLocalBD } from '@/hooks/useDB'
import { useEffect, useState } from 'react'
import ChatOption from './chat_option'

export default function Chats() {
    const [chats, setChats] = useState<{name:string, id:number}[]>([])
    const db = useLocalBD()
    
    useEffect(() => {
        const getAll = async () => {
            const ch = await db.getChats()
            console.log('e',ch)
            setChats(ch)
        }
        getAll()
    }, [db])
    
    return (
        <section className="">
            {chats.map((chat) => 
                <ChatOption key={chat.id} chat={chat} />)}
        </section>
    )
}