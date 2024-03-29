'use client'

import {useSelectedView} from '@/hooks/globalStates'
import { RTCSchemma } from '@/hooks/useDB'
import { View } from '@/lib/constants'

export default function ChatOption({chat}: {chat: RTCSchemma['chats']['value']}) {
    const { setSelectedChat, setSelectedView } = useSelectedView()
    return <div className="p-3 hover:bg-slate-950/50 cursor-pointer" onClick={() => {
        setSelectedChat(chat)
        setSelectedView(View.Chat)
    }} data-label={chat.phone} aria-selected="false">
        <label>{chat.name}</label>
    </div>
}