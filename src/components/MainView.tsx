'use client'

import { useSelectedView } from '@/hooks/globalStates'
import { Login } from './views/Login'
import { AddFriend } from './views/AddFriend'
import { Chat } from './views/Chat'
import { View } from '@/lib/constants'
import { DuplicateConnection } from './views/DuplicateConnection'
import { Settings } from './views/Settings'

export default function MainView(){
    const { selectedView } = useSelectedView()
    
    if (selectedView === View.Login) return <Login />
    if (selectedView === View.AddFriend) return <AddFriend />
    if (selectedView === View.DuplicateConnection) return <DuplicateConnection />
    if (selectedView === View.Settings) return <Settings />
    return <Chat />
}