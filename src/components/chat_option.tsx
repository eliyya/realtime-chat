'use client'

import {useSelectedChat} from "@/hooks/useSelectedChat"

export default function ChatOption({chat}: {chat: {name:string, id:number}}) {
    const {setSelectedChat} = useSelectedChat()
    return <div className="p-3" onClick={() => {
        setSelectedChat(chat.id)
        console.log(chat);
    }} data-label={chat.id} aria-selected="false">
    <label>{chat.name}</label>
  </div>
}