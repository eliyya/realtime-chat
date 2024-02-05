"use client"
import { create } from "zustand"

export const useSelectedChat = create<{selectedChat:number, setSelectedChat: (value: number) => void}>((set) => ({
    selectedChat: -1,
    setSelectedChat: (selectedChat: number) => set({ selectedChat }),
}))
