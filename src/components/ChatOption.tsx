'use client'

import {useSelectedView} from '@/hooks/globalStates'

export default function ChatOption({chat}: {chat: {name:string, id:number}}) {
    const {setSelectedChat} = useSelectedView()
    return <div className="p-3" onClick={() => {
        setSelectedChat(chat.id)
        console.log(chat)
    }} data-label={chat.id} aria-selected="false">
        <label>{chat.name}</label>
    </div>
}