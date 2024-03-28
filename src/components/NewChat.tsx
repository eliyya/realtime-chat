'use client'

import { View, useChats, useSelectedView, useSession } from '@/hooks/globalStates'

export function NewChat() {
    const {} = useChats()
    const {setSelectedView} = useSelectedView()
    const {session} = useSession()
    return (
        <>
            {session?.token && <button
                className="p-4"
                onClick={() => {
                    setSelectedView(View.newChat)
                }}
            >
            New Chat
            </button>}
        </>
    )
}