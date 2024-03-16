'use client'
import { create } from 'zustand'

export const useSelectedChat = create<{selectedChat:number, setSelectedChat: (value: number) => void}>((set) => ({
    selectedChat: -1,
    setSelectedChat: (selectedChat: number) => set({ selectedChat }),
}))

export const useName = create<{name:string, setName: (value: string) => void}>((set) => ({
    name: 'your name',
    setName: (name: string) => set({ name }),
}))