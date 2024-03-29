'use client'

import { useSelectedView } from '@/hooks/globalStates'
import { useDB } from '@/hooks/useDB'
import { View } from '@/lib/constants'

export function Settings() {
    const { deleteSesion } = useDB()
    const { setSelectedView } = useSelectedView()

    const logout = () => {
        deleteSesion()
        setSelectedView(View.Login)
    }

    return <>
        <h2>Settings</h2>
        <button onClick={logout} >Logout</button>
        <span></span>
    </>
}