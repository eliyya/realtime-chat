'use client'

import { View, useSelectedView } from '@/hooks/globalStates'
import { Login } from './views/Login'
import { AddFriend } from './views/AddFriend'
import { Chat } from './views/Chat'

export default function MainView(){
    const { selectedView } = useSelectedView()
    
    if (selectedView === View.Login) return <Login />
    if (selectedView === View.AddFriend) return <AddFriend />
    return <Chat />
}