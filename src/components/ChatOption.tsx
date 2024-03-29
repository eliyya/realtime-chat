'use client'

import {useSelectedView} from '@/hooks/globalStates'
import { RTCSchemma } from '@/hooks/useDB'

export default function ChatOption({chat}: {chat: RTCSchemma['chats']['value']}) {
    const {setSelectedChat} = useSelectedView()
    return <div className="p-3" onClick={() => {
        setSelectedChat(chat.phone)
        console.log(chat)
    }} data-label={chat.phone} aria-selected="false">
        <label>{chat.name}</label>
    </div>
}