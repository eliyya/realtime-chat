'use client'

import { View, useChats, useSelectedView, useSession } from '@/hooks/globalStates'

export function AddFriendButton() {
    const {} = useChats()
    const {setSelectedView} = useSelectedView()
    const {session} = useSession()

    if (!session?.token) return null
    
    return (
        <button
            className="p-4"
            onClick={() => {
                setSelectedView(View.AddFriend)
            }}
        >
            Add Friend
        </button>
    )
}