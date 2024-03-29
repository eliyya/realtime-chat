'use client'

import { useSelectedView } from '@/hooks/globalStates'
import { useDB } from '@/hooks/useDB'
import { View } from '@/lib/constants'

export function AddFriendButton() {
    const { setSelectedView, selectedView } = useSelectedView()
    const { session } = useDB()

    if (!session?.token || selectedView === View.DuplicateConnection) return null
    
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