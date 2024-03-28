'use client'
import { create } from 'zustand'
import { MyDB, useDB } from './useDB'

export enum View {
    Login,
    Chat,
    AddFriend,
}

export const useSelectedView = create<{
    selectedChat: MyDB['chats']['value']['phone']
    selectedView: View
    setSelectedChat: (value: MyDB['chats']['value']['phone']) => void
    setSelectedView: (value: View) => void
}>((set) => {
            useDB().getSesion().then(session => session?.token && set({ selectedView: View.Chat }))
            return {
                selectedChat: '',
                setSelectedChat: (selectedChat) => set({ selectedChat }),
                selectedView: View.Login,
                setSelectedView: (selectedView) => set({ selectedView }),
            }
        })

export const useName = create<{name:string, setName: (value: string) => void}>((set) => {
    useDB().getInfo().then(info=>set({name: info?.name || 'your name'}))
    return {
        name: 'your name',
        setName: (name: string) => set({ name }),
    }
})

export const useChats = create<{
    chats: MyDB['chats']['value'][],
}>(set=>{
    useDB().getChats().then(chats=>set({chats}))
    return {
        chats: []
    }
})

export const useSession = create<{
    session: MyDB['session']['value'],
    setSession: (value: MyDB['session']['value']) => void
}>(set=>{
            const db = useDB()
            db.getSesion().then(session=>set({session}))
            return {
                session: {token: '', session_id: '', phone: ''},
                setSession: (session: MyDB['session']['value']) => set({session})
            }
        })