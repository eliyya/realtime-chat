'use client'
import { create } from 'zustand'
import { MyDB, useDB } from './useDB'

export enum View {
    login,
    chat,
    newChat,
    settings
}

export const useSelectedView = create<{
    selectedChat: number
    selectedView: View
    setSelectedChat: (value: number) => void
    setSelectedView: (value: View) => void
}>((set) => {
            useDB().getSesion().then(session => {
                console.log('session', session)
                
                session?.token && set({ selectedView: View.chat })
            })
            return {
                selectedChat: -1,
                setSelectedChat: (selectedChat: number) => set({ selectedChat }),
                selectedView: View.login,
                setSelectedView: (selectedView: View) => set({ selectedView }),
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